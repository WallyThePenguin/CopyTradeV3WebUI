// src/entities/all.js

// Cache to store mock data after first generation
const mockDataCache = {};

class BaseEntity {
  static async list(sort = '', limit = 50) {
    const entityName = this.name;

    // Check if data is already in cache
    if (!mockDataCache[entityName]) {
      // Generate a larger dataset once and cache it
      mockDataCache[entityName] = this.getMockData(entityName, 500);
    }

    // Return a slice of the cached data
    // In a real app, sorting would happen here or on the server
    return mockDataCache[entityName].slice(0, limit);
  }

  static async update(id, data) {
    console.log(`Updating ${this.name} ${id}:`, data);
    // In a real app, you would also update the cache here
    return { id, ...data };
  }

  static getMockData(entityName, limit) {
    switch (entityName) {
      case 'Trade':
        return this.generateMockTrades(limit);
      case 'Position':
        return this.generateMockPositions(limit);
      case 'Channel':
        return this.generateMockChannels(limit);
      case 'Signal':
        return this.generateMockSignals(limit);
      case 'NewsArticle':
        return this.generateMockNews(limit);
      case 'MarketEvent':
        return this.generateMockEvents(limit);
      default:
        return [];
    }
  }

  static generateMockTrades(limit) {
    const symbols = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NFLX'];
    const channels = ['alpha-signals', 'pro-traders', 'market-movers', 'crypto-calls'];
    const traders = ['TradeMaster', 'AlphaWolf', 'MarketGuru', 'CryptoKing', 'StockSage'];

    return Array.from({ length: Math.min(limit, 50) }, (_, i) => ({
      id: i + 1,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      action: Math.random() > 0.5 ? 'BUY' : 'SELL',
      quantity: Math.floor(Math.random() * 100) + 1,
      price: Math.random() * 200 + 50,
      type: Math.random() > 0.8 ? 'OPTION' : 'STOCK',
      status: ['EXECUTED', 'PENDING', 'CANCELLED'][Math.floor(Math.random() * 3)],
      channel: channels[Math.floor(Math.random() * channels.length)],
      trader: traders[Math.floor(Math.random() * traders.length)],
      confidence: Math.random() * 0.4 + 0.6,
      pnl: (Math.random() - 0.5) * 200,
      created_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      execution_time: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }

  static generateMockPositions(limit) {
    const symbols = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL'];
    const channels = ['alpha-signals', 'pro-traders', 'market-movers'];

    return Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
      id: i + 1,
      symbol: symbols[i % symbols.length],
      quantity: Math.floor(Math.random() * 50) + 10,
      avg_price: Math.random() * 200 + 100,
      current_price: Math.random() * 200 + 100,
      market_value: 0, // Will be calculated
      unrealized_pnl: 0, // Will be calculated
      type: 'STOCK',
      channel: channels[Math.floor(Math.random() * channels.length)],
      open_date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
    })).map(pos => {
      pos.market_value = pos.quantity * pos.current_price;
      pos.unrealized_pnl = (pos.current_price - pos.avg_price) * pos.quantity;
      return pos;
    });
  }

  static generateMockChannels(limit) {
    const channels = [
      { name: 'Alpha Signals', discord_id: '123456789', description: 'Premium trading signals' },
      { name: 'Pro Traders', discord_id: '987654321', description: 'Professional trader community' },
      { name: 'Market Movers', discord_id: '456789123', description: 'High-impact market moves' },
      { name: 'Crypto Calls', discord_id: '789123456', description: 'Cryptocurrency trading signals' }
    ];

    return channels.map((channel, i) => ({
      id: i + 1,
      ...channel,
      is_active: Math.random() > 0.2,
      total_trades: Math.floor(Math.random() * 100) + 10,
      win_rate: Math.random() * 40 + 50,
      total_pnl: (Math.random() - 0.3) * 1000,
      confidence_threshold: 0.7,
      win_rate_threshold: 60,
      min_trades_for_evaluation: 10,
      auto_disable_enabled: Math.random() > 0.5,
      last_message: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }

  static generateMockSignals(limit) {
    const symbols = ['AAPL', 'TSLA', 'NVDA', 'MSFT'];
    const channels = ['alpha-signals', 'pro-traders'];

    return Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
      id: i + 1,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      action: Math.random() > 0.5 ? 'BUY' : 'SELL',
      confidence: Math.random() * 0.3 + 0.7,
      price_target: Math.random() * 200 + 100,
      channel: channels[Math.floor(Math.random() * channels.length)],
      processed: Math.random() > 0.3,
      created_date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }

  static generateMockNews(limit) {
    const sources = ['Reuters', 'Bloomberg', 'CNBC', 'MarketWatch'];
    const categories = ['MARKET', 'EARNINGS', 'ECONOMIC', 'CRYPTO'];
    const sentiments = ['POSITIVE', 'NEGATIVE', 'NEUTRAL'];

    return Array.from({ length: Math.min(limit, 30) }, (_, i) => ({
      id: i + 1,
      title: `Market News Article ${i + 1}`,
      summary: 'This is a sample news article summary that provides key insights into market movements.',
      source: sources[Math.floor(Math.random() * sources.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      importance: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)],
      symbols_mentioned: ['AAPL', 'TSLA'].slice(0, Math.floor(Math.random() * 2) + 1),
      published_date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://example.com/news'
    }));
  }

  static generateMockEvents(limit) {
    const events = [
      { title: 'Apple Earnings Report', category: 'EARNINGS', impact: 'HIGH' },
      { title: 'Federal Reserve Meeting', category: 'FED', impact: 'HIGH' },
      { title: 'Tesla Delivery Numbers', category: 'EARNINGS', impact: 'MEDIUM' },
      { title: 'GDP Report Release', category: 'ECONOMIC', impact: 'MEDIUM' }
    ];

    return events.map((event, i) => ({
      id: i + 1,
      ...event,
      date: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '09:30 AM EST',
      description: `Important ${event.category.toLowerCase()} event that may impact market movements.`,
      symbols_affected: event.category === 'EARNINGS' ? [event.title.split(' ')[0].toUpperCase()] : []
    }));
  }
}

export class Trade extends BaseEntity { }
export class Position extends BaseEntity { }
export class Channel extends BaseEntity { }
export class Signal extends BaseEntity { }
export class NewsArticle extends BaseEntity { }
export class MarketEvent extends BaseEntity { }