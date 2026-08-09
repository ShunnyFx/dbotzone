import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const app: Express = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with real DB in production)
const users: Map<string, any> = new Map();
const trades: Map<string, any> = new Map();
const portfolios: Map<string, any> = new Map();

// Auth Middleware
const authMiddleware = (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ============ AUTHENTICATION ============

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const userId = uuidv4();
  const user = {
    id: userId,
    username,
    email,
    password, // In production, hash this!
    balance: 10000,
    createdAt: new Date(),
  };

  users.set(userId, user);
  portfolios.set(userId, {
    userId,
    totalBalance: 10000,
    availableBalance: 10000,
    usedMargin: 0,
    openTrades: [],
    closedTrades: [],
    totalProfitLoss: 0,
    winRate: 0,
  });

  const token = jwt.sign({ id: userId, email }, JWT_SECRET);

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance,
    },
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  let user = Array.from(users.values()).find((u) => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance,
    },
  });
});

// ============ USER ============

app.get('/api/user/profile', authMiddleware, (req: Request, res: Response) => {
  const user = users.get((req as any).user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    balance: user.balance,
    createdAt: user.createdAt,
  });
});

app.put('/api/user/profile', authMiddleware, (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const user = users.get(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { username, email } = req.body;
  if (username) user.username = username;
  if (email) user.email = email;

  users.set(userId, user);

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    balance: user.balance,
  });
});

// ============ PORTFOLIO ============

app.get('/api/portfolio', authMiddleware, (req: Request, res: Response) => {
  const portfolio = portfolios.get((req as any).user.id);

  if (!portfolio) {
    return res.status(404).json({ message: 'Portfolio not found' });
  }

  res.json(portfolio);
});

app.get('/api/portfolio/balance', authMiddleware, (req: Request, res: Response) => {
  const user = users.get((req as any).user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ balance: user.balance });
});

// ============ TRADES ============

app.post('/api/trades/open', authMiddleware, (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { asset, type, amount, entryPrice, expiry } = req.body;

  const portfolio = portfolios.get(userId);
  if (!portfolio || amount > portfolio.availableBalance) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }

  const tradeId = uuidv4();
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + parseInt(expiry) || 1);

  const trade = {
    id: tradeId,
    userId,
    asset,
    type,
    entryPrice,
    amount,
    expiryTime,
    status: 'open',
    entryTime: new Date(),
  };

  trades.set(tradeId, trade);

  // Update portfolio
  portfolio.usedMargin += amount;
  portfolio.availableBalance -= amount;
  portfolio.openTrades.push(trade);
  portfolios.set(userId, portfolio);

  // Update user balance
  const user = users.get(userId);
  user.balance -= amount;
  users.set(userId, user);

  res.json(trade);
});

app.post('/api/trades/:id/close', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { exitPrice } = req.body;
  const userId = (req as any).user.id;

  const trade = trades.get(id);

  if (!trade || trade.userId !== userId) {
    return res.status(404).json({ message: 'Trade not found' });
  }

  const profit = (exitPrice - trade.entryPrice) * trade.amount;
  const profitPercentage = ((exitPrice - trade.entryPrice) / trade.entryPrice) * 100;

  trade.status = 'closed';
  trade.exitPrice = exitPrice;
  trade.exitTime = new Date();
  trade.profit = profit;
  trade.profitPercentage = profitPercentage;
  trade.roi = profitPercentage;

  trades.set(id, trade);

  // Update portfolio
  const portfolio = portfolios.get(userId);
  portfolio.usedMargin -= trade.amount;
  portfolio.availableBalance += trade.amount + profit;
  portfolio.totalProfitLoss += profit;
  portfolio.openTrades = portfolio.openTrades.filter((t: any) => t.id !== id);
  portfolio.closedTrades.push(trade);

  // Calculate win rate
  const winningTrades = portfolio.closedTrades.filter((t: any) => (t.profit || 0) > 0).length;
  portfolio.winRate = (winningTrades / portfolio.closedTrades.length) * 100;

  portfolios.set(userId, portfolio);

  // Update user balance
  const user = users.get(userId);
  user.balance += trade.amount + profit;
  users.set(userId, user);

  res.json(trade);
});

app.get('/api/trades/active', authMiddleware, (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const userTrades = Array.from(trades.values())
    .filter((t) => t.userId === userId && (t.status === 'open' || t.status === 'pending'))
    .sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime());

  res.json(userTrades);
});

app.get('/api/trades/history', authMiddleware, (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { limit = 50, offset = 0 } = req.query;

  const userTrades = Array.from(trades.values())
    .filter((t) => t.userId === userId)
    .sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime())
    .slice(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string));

  res.json(userTrades);
});

app.get('/api/trades/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const trade = trades.get(id);

  if (!trade || trade.userId !== (req as any).user.id) {
    return res.status(404).json({ message: 'Trade not found' });
  }

  res.json(trade);
});

// ============ MARKET DATA ============

const mockAssets = [
  {
    id: 'eur_usd',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    type: 'forex',
    currentPrice: 1.0950,
    bid: 1.0949,
    ask: 1.0951,
    lastUpdate: new Date(),
  },
  {
    id: 'gbp_usd',
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    type: 'forex',
    currentPrice: 1.2750,
    bid: 1.2749,
    ask: 1.2751,
    lastUpdate: new Date(),
  },
  {
    id: 'btc_usd',
    symbol: 'BTC/USD',
    name: 'Bitcoin / US Dollar',
    type: 'crypto',
    currentPrice: 42500,
    bid: 42490,
    ask: 42510,
    lastUpdate: new Date(),
  },
  {
    id: 'eth_usd',
    symbol: 'ETH/USD',
    name: 'Ethereum / US Dollar',
    type: 'crypto',
    currentPrice: 2250,
    bid: 2249,
    ask: 2251,
    lastUpdate: new Date(),
  },
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    currentPrice: 195.5,
    bid: 195.49,
    ask: 195.51,
    lastUpdate: new Date(),
  },
  {
    id: 'spx',
    symbol: 'SPX',
    name: 'S&P 500 Index',
    type: 'index',
    currentPrice: 5380.5,
    bid: 5380.0,
    ask: 5381.0,
    lastUpdate: new Date(),
  },
];

app.get('/api/market/assets', (req: Request, res: Response) => {
  res.json(mockAssets);
});

app.get('/api/market/assets/:symbol', (req: Request, res: Response) => {
  const { symbol } = req.params;
  const asset = mockAssets.find((a) => a.symbol === symbol);

  if (!asset) {
    return res.status(404).json({ message: 'Asset not found' });
  }

  res.json(asset);
});

app.get('/api/market/prices/:symbol', (req: Request, res: Response) => {
  const { symbol } = req.params;
  const { timeframe = '15m', limit = 100 } = req.query;

  const asset = mockAssets.find((a) => a.symbol === symbol);
  if (!asset) {
    return res.status(404).json({ message: 'Asset not found' });
  }

  // Generate mock candlestick data
  const candles = [];
  let basePrice = asset.currentPrice;

  for (let i = parseInt(limit as string); i > 0; i--) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - i);

    const open = basePrice;
    const close = basePrice + (Math.random() - 0.5) * 2;
    const high = Math.max(open, close) + Math.random() * 0.5;
    const low = Math.min(open, close) - Math.random() * 0.5;

    candles.push({
      timestamp: date,
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 100000),
    });

    basePrice = close;
  }

  res.json(candles);
});

// ============ STATISTICS ============

app.get('/api/statistics/trades', authMiddleware, (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const portfolio = portfolios.get(userId);

  if (!portfolio) {
    return res.status(404).json({ message: 'Portfolio not found' });
  }

  const closedTrades = portfolio.closedTrades;
  const totalTrades = closedTrades.length;
  const winningTrades = closedTrades.filter((t: any) => (t.profit || 0) > 0).length;
  const losingTrades = closedTrades.filter((t: any) => (t.profit || 0) < 0).length;

  const totalWins = closedTrades
    .filter((t: any) => (t.profit || 0) > 0)
    .reduce((sum: number, t: any) => sum + t.profit, 0);

  const totalLosses = Math.abs(
    closedTrades
      .filter((t: any) => (t.profit || 0) < 0)
      .reduce((sum: number, t: any) => sum + t.profit, 0)
  );

  const avgWin = winningTrades > 0 ? totalWins / winningTrades : 0;
  const avgLoss = losingTrades > 0 ? totalLosses / losingTrades : 0;

  res.json({
    totalTrades,
    winningTrades,
    losingTrades,
    winRate: portfolio.winRate,
    averageWin: avgWin,
    averageLoss: avgLoss,
    profitFactor: totalLosses > 0 ? totalWins / totalLosses : 0,
    maxDrawdown: 0, // Simplified
    totalProfit: portfolio.totalProfitLoss,
    roi: totalTrades > 0 ? (portfolio.totalProfitLoss / (totalTrades * 100)) * 100 : 0,
  });
});

app.get('/api/statistics/win-rate', authMiddleware, (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const portfolio = portfolios.get(userId);

  if (!portfolio) {
    return res.status(404).json({ message: 'Portfolio not found' });
  }

  res.json({ winRate: portfolio.winRate });
});

// ============ TRANSACTIONS ============

app.post('/api/transactions/deposit', authMiddleware, (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { amount, method } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  const user = users.get(userId);
  const portfolio = portfolios.get(userId);

  user.balance += amount;
  portfolio.totalBalance += amount;
  portfolio.availableBalance += amount;

  users.set(userId, user);
  portfolios.set(userId, portfolio);

  res.json({
    id: uuidv4(),
    userId,
    type: 'deposit',
    amount,
    timestamp: new Date(),
    status: 'completed',
  });
});

app.post('/api/transactions/withdraw', authMiddleware, (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { amount, method } = req.body;

  const user = users.get(userId);
  const portfolio = portfolios.get(userId);

  if (!amount || amount <= 0 || amount > portfolio.availableBalance) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  user.balance -= amount;
  portfolio.totalBalance -= amount;
  portfolio.availableBalance -= amount;

  users.set(userId, user);
  portfolios.set(userId, portfolio);

  res.json({
    id: uuidv4(),
    userId,
    type: 'withdrawal',
    amount,
    timestamp: new Date(),
    status: 'completed',
  });
});

app.get('/api/transactions', authMiddleware, (req: Request, res: Response) => {
  // Mock transaction history
  res.json([]);
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Trading API server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});
