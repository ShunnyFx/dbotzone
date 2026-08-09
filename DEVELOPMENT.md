# DBotZone Development Guide

## 📋 Quick Start

### Prerequisites
- Node.js 18.18 or later
- npm or yarn
- Git

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/ShunnyFx/dbotzone.git
cd dbotzone

# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Environment Setup

```bash
# Frontend
cp .env.example .env.local

# Backend
cd server
cp .env.example .env
cd ..
```

**Frontend (.env.local):**
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001/ws
```

**Backend (server/.env):**
```env
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### 3. Run Development Servers

**Terminal 1 - Start Backend API:**
```bash
cd server
npm run dev
# Server runs on http://localhost:3001
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

Visit `http://localhost:3000` in your browser.

## 🏗️ Project Architecture

```
dbotzone/
├── src/                          # Frontend (Next.js/React)
│   ├── pages/                   # Next.js pages
│   │   ├── index.tsx           # Home (redirects to dashboard)
│   │   ├── dashboard.tsx       # Trading dashboard
│   │   ├── portfolio.tsx       # Portfolio management
│   │   ├── trading.tsx         # Trading interface
│   │   ├── markets.tsx         # Markets overview
│   │   ├── login.tsx           # Authentication
│   │   ├── _app.tsx            # App wrapper
│   ├── components/              # React components
│   │   ├── Dashboard.tsx       # Dashboard component
│   │   ├── Portfolio.tsx       # Portfolio component
│   │   ├── TradeForm.tsx       # Trade entry form
│   │   ├── PriceChart.tsx      # Price charts
│   │   ├── LoginPage.tsx       # Login component
│   │   └── Layout.tsx          # Layout wrapper
│   ├── store/                  # Zustand state management
│   │   └── tradingStore.ts    # Global trading state
│   ├── services/               # API services
│   │   └── tradingService.ts  # API client
│   ├── types/                  # TypeScript types
│   │   └── index.ts           # Type definitions
│   ├── utils/                  # Utilities
│   │   ├── calculations.ts    # Trading calculations
│   │   ├── websocketManager.ts # WebSocket client
│   │   └── mockData.ts        # Mock data generators
│   ├── globals.css            # Global styles
│   └── index.ts               # Barrel exports
│
├── server/                      # Backend (Express.js)
│   ├── index.ts               # Main server file
│   ├── package.json           # Server dependencies
│   └── .env.example           # Environment template
│
├── public/                      # Static assets
├── package.json               # Frontend dependencies
├── tsconfig.json              # TypeScript config
├── tsconfig.server.json       # Server TypeScript config
├── next.config.js             # Next.js config
├── tailwind.config.ts         # Tailwind config
├── postcss.config.js          # PostCSS config
└── README.md                  # Documentation
```

## 🛣️ Application Routes

### Frontend Routes
- `/` → Redirects to `/dashboard`
- `/dashboard` → Trading dashboard with portfolio overview
- `/portfolio` → Trade history and statistics
- `/trading` → Trading interface with charts and forms
- `/markets` → Available assets listing
- `/login` → Authentication page

### API Endpoints

**Base URL:** `http://localhost:3001/api`

#### Authentication
- `POST /auth/register` - Create new account
- `POST /auth/login` - User login

#### User
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update profile

#### Portfolio
- `GET /portfolio` - Get portfolio summary
- `GET /portfolio/balance` - Get account balance

#### Trades
- `POST /trades/open` - Open new trade
- `POST /trades/:id/close` - Close trade
- `GET /trades/:id` - Get trade details
- `GET /trades/active` - Get active trades
- `GET /trades/history` - Get trade history

#### Market Data
- `GET /market/assets` - List available assets
- `GET /market/assets/:symbol` - Get asset details
- `GET /market/prices/:symbol` - Get price history

#### Statistics
- `GET /statistics/trades` - Get trading statistics
- `GET /statistics/win-rate` - Get win rate

#### Transactions
- `POST /transactions/deposit` - Deposit funds
- `POST /transactions/withdraw` - Withdraw funds
- `GET /transactions` - Get transaction history

#### Health
- `GET /api/health` - API health check

## 💾 Data Models

### User
```typescript
{
  id: string;
  username: string;
  email: string;
  password: string; // hashed in production
  balance: number;
  createdAt: Date;
}
```

### Trade
```typescript
{
  id: string;
  userId: string;
  asset: Asset;
  type: 'call' | 'put';
  entryPrice: number;
  exitPrice?: number;
  amount: number;
  entryTime: Date;
  exitTime?: Date;
  expiryTime: Date;
  profit?: number;
  profitPercentage?: number;
  roi?: number;
  status: 'pending' | 'open' | 'closed' | 'expired';
}
```

### Portfolio
```typescript
{
  userId: string;
  totalBalance: number;
  availableBalance: number;
  usedMargin: number;
  openTrades: Trade[];
  closedTrades: Trade[];
  totalProfitLoss: number;
  winRate: number;
}
```

## 🧪 Testing

### Mock Data
The application comes with mock data generators for testing:

```typescript
import { generateMockPortfolio, generateMockTrades, mockAssets } from '@utils/mockData';

const portfolio = generateMockPortfolio('userId');
const trades = generateMockTrades(10);
```

### Test Credentials
Since this uses in-memory storage in development:

1. Visit `/login`
2. Create a new account with any credentials
3. You'll be auto-logged in and redirected to dashboard

## 🔄 State Management with Zustand

The app uses Zustand for state management:

```typescript
import { useTradingStore } from '@store/tradingStore';

// In a component
const portfolio = useTradingStore((state) => state.portfolio);
const addTrade = useTradingStore((state) => state.addTrade);
```

## 📊 Key Features

### Trading Engine
- Binary options with Call/Put
- Multiple asset classes (Forex, Crypto, Stocks, Indices)
- Flexible expiry times (1m, 5m, 15m, 1h, 4h, 1d)
- Real-time balance tracking

### Analytics
- Win rate calculation
- Profit/Loss tracking
- Profit factor analysis
- Drawdown calculation
- ROI metrics

### Charts
- Interactive price charts using Chart.js
- Multiple timeframes
- Candlestick data simulation

## 🚀 Building for Production

### Frontend Build
```bash
npm run build
npm run start
```

### Server Build
```bash
cd server
npm run build
npm start
```

### Environment Variables for Production

**Frontend (.env.production):**
```env
REACT_APP_API_URL=https://api.dbotzone.com
REACT_APP_WS_URL=wss://api.dbotzone.com/ws
```

**Backend (.env):**
```env
PORT=3001
JWT_SECRET=your-very-secure-secret-key-here
NODE_ENV=production
DATABASE_URL=your-database-connection-string
```

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t dbotzone .
```

### Run Container
```bash
docker run -p 3000:3000 -p 3001:3001 -e JWT_SECRET=your-secret dbotzone
```

## 📝 Code Style & Best Practices

- Use TypeScript for type safety
- Follow React hooks best practices
- Keep components small and focused
- Use Zustand for complex state
- Write meaningful commit messages
- Add comments for complex logic

## 🔐 Security Considerations

- [ ] Hash passwords in production (bcrypt)
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Validate and sanitize inputs
- [ ] Use HTTPS/WSS in production
- [ ] Implement proper CORS
- [ ] Add request logging
- [ ] Implement account lockout
- [ ] Add 2FA support

## 🐛 Debugging

### Frontend
- Use React DevTools browser extension
- Check browser console for errors
- Use Redux DevTools (if applicable)

### Backend
- Enable detailed logging
- Use Postman for API testing
- Check server console output

### Common Issues

**Port Already in Use:**
```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3002 npm run dev
```

**Module Not Found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📞 Support & Troubleshooting

For issues:
1. Check existing GitHub issues
2. Review this guide
3. Create a new GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Screenshots/logs

## 🎯 Development Workflow

1. **Setup** - Install dependencies and configure env
2. **Develop** - Make changes to components/pages
3. **Test** - Use mock data to test features
4. **Build** - Run build command
5. **Deploy** - Push to repository
6. **Monitor** - Check production health

## 📈 Performance Tips

- Use React.memo for expensive components
- Implement code splitting with dynamic imports
- Optimize images with Next.js Image component
- Use WebSocket for real-time updates
- Implement pagination for large datasets
- Cache API responses where appropriate

---

**Made with ❤️ by the DBotZone Team**

Last updated: August 2026