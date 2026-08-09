import { Portfolio, Trade, User } from '@types/index';

/**
 * Mock data generators for development and testing
 */

export const mockUsers = {
  user1: {
    id: '1',
    username: 'trader_john',
    email: 'john@example.com',
    balance: 10000,
    createdAt: new Date('2026-01-01'),
  } as User,
};

export const mockAssets = [
  {
    id: 'eur_usd',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    type: 'forex' as const,
    currentPrice: 1.0950,
    bid: 1.0949,
    ask: 1.0951,
    lastUpdate: new Date(),
  },
  {
    id: 'gbp_usd',
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    type: 'forex' as const,
    currentPrice: 1.2750,
    bid: 1.2749,
    ask: 1.2751,
    lastUpdate: new Date(),
  },
  {
    id: 'btc_usd',
    symbol: 'BTC/USD',
    name: 'Bitcoin / US Dollar',
    type: 'crypto' as const,
    currentPrice: 42500,
    bid: 42490,
    ask: 42510,
    lastUpdate: new Date(),
  },
  {
    id: 'eth_usd',
    symbol: 'ETH/USD',
    name: 'Ethereum / US Dollar',
    type: 'crypto' as const,
    currentPrice: 2250,
    bid: 2249,
    ask: 2251,
    lastUpdate: new Date(),
  },
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock' as const,
    currentPrice: 195.50,
    bid: 195.49,
    ask: 195.51,
    lastUpdate: new Date(),
  },
  {
    id: 'spx',
    symbol: 'SPX',
    name: 'S&P 500 Index',
    type: 'index' as const,
    currentPrice: 5380.50,
    bid: 5380.00,
    ask: 5381.00,
    lastUpdate: new Date(),
  },
];

export const generateMockCandles = (count: number = 50) => {
  const candles = [];
  let basePrice = 100;

  for (let i = count; i > 0; i--) {
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

  return candles;
};

export const generateMockTrades = (count: number = 10): Trade[] => {
  const trades: Trade[] = [];

  for (let i = 0; i < count; i++) {
    const entryTime = new Date();
    entryTime.setMinutes(entryTime.getMinutes() - Math.random() * 60);

    const exitTime = new Date(entryTime);
    exitTime.setMinutes(exitTime.getMinutes() + (Math.random() * 30 + 5));

    const entryPrice = 100 + Math.random() * 10;
    const exitPrice = entryPrice + (Math.random() - 0.5) * 5;
    const amount = 100 + Math.floor(Math.random() * 400);
    const profit = (exitPrice - entryPrice) * amount;

    trades.push({
      id: `trade_${i}`,
      userId: '1',
      asset: mockAssets[Math.floor(Math.random() * mockAssets.length)],
      type: Math.random() > 0.5 ? 'call' : 'put',
      entryPrice,
      amount,
      expiryTime: exitTime,
      status: 'closed',
      entryTime,
      exitTime,
      exitPrice,
      profit,
      profitPercentage: (profit / (entryPrice * amount)) * 100,
      roi: ((exitPrice - entryPrice) / entryPrice) * 100,
    });
  }

  return trades;
};

export const generateMockPortfolio = (userId: string): Portfolio => {
  const trades = generateMockTrades(20);
  const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);

  return {
    userId,
    totalBalance: 10000 + totalProfit,
    availableBalance: 5000,
    usedMargin: 2000,
    openTrades: trades.filter((t) => t.status === 'open'),
    closedTrades: trades.filter((t) => t.status === 'closed'),
    totalProfitLoss: totalProfit,
    winRate: (trades.filter((t) => (t.profit || 0) > 0).length / trades.length) * 100,
  };
};
