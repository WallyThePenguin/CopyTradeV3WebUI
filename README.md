# CopyTradeV3WebUI

CopyTradeV3WebUI is a modern web dashboard for monitoring, analyzing, and configuring an automated trading system that leverages Discord channels, AI-driven signals, and real-time analytics.

## Features

- **Dashboard**: Real-time overview of trading performance, portfolio value, win rates, and live system metrics.
- **Trades**: Detailed trade history with filtering, searching, and status tracking.
- **Positions**: Portfolio holdings with performance metrics, gainers/losers, and unrealized P&L.
- **Channels**: Manage Discord channels as trading signal sources, including auto-disable based on win rate.
- **Analytics**: In-depth analytics on trades, traders, asset distribution, and channel performance.
- **Market Calendar**: Upcoming market events, earnings, and economic news with impact levels.
- **Settings**: Configure trading bot parameters, risk controls, and notification preferences.

## Project Structure

```
Layout.js
Components/
  analytics/
    TraderAnalytics.jsx
  channels/
    ChannelCard.jsx
    WinRateConfig.jsx
  dashboard/
    ChannelStatus.jsx
    LiveMetrics.jsx
    RecentTrades.jsx
    StatsCard.jsx
Pages/
  Analytics.jsx
  Channels.jsx
  Dashboard.jsx
  Market.jsx
  News.jsx
  Positions.jsx
  Settings.jsx
  Trades.jsx
Entities/
  Channel.json
  MarketEvent.json
  NewsArticle.json
  Position.json
  Signal.json
  Trade.json
  Trader.json
```

## Getting Started

1. **Install dependencies**
   ```sh
   npm install
   ```
2. **Run the development server**
   ```sh
   npm run dev
   ```
3. **Open in browser**
   Visit [http://localhost:3000](http://localhost:3000) (or the port specified in your setup).

## Usage

- Navigate between pages using the sidebar.
- Configure channels and system settings as needed.
- Analyze trading performance and market events in real time.

## Technologies Used

- **React** for UI
- **framer-motion** for animations
- **recharts** for data visualization
- **date-fns** for date handling
- **Lucide Icons** for UI icons
- **Tailwind CSS** (utility classes in JSX)

## Customization

- UI components are modular and can be extended in `Components/`.
- Pages are located in `Pages/`.
- Entity schemas are defined in `Entities/` as JSON files.

## License

MIT License

---

*This project is for educational and demonstration purposes. No financial advice is provided.*
