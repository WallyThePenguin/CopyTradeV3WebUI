import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { User, TrendingUp, Target, Award, AlertTriangle, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function TraderAnalytics({ trades, timeRange }) {
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [sortBy, setSortBy] = useState('total_pnl');

  const getTraderStats = () => {
    const traderData = {};
    
    trades.forEach(trade => {
      const trader = trade.trader || 'Unknown';
      if (!traderData[trader]) {
        traderData[trader] = {
          name: trader,
          trades: [],
          wins: 0,
          losses: 0,
          total_pnl: 0,
          total_trades: 0,
          channels: new Set(),
          asset_types: {},
          confidence_scores: [],
          last_active: null
        };
      }

      const data = traderData[trader];
      data.trades.push(trade);
      data.total_trades += 1;
      data.channels.add(trade.channel);
      data.asset_types[trade.type] = (data.asset_types[trade.type] || 0) + 1;
      
      if (trade.confidence) data.confidence_scores.push(trade.confidence);
      if (trade.created_date) {
        const tradeDate = new Date(trade.created_date);
        if (!data.last_active || tradeDate > new Date(data.last_active)) {
          data.last_active = trade.created_date;
        }
      }

      if (trade.pnl !== undefined && trade.pnl !== null) {
        data.total_pnl += trade.pnl;
        if (trade.pnl > 0) data.wins += 1;
        else if (trade.pnl < 0) data.losses += 1;
      }
    });

    // Calculate derived metrics
    return Object.values(traderData).map(trader => {
      const winRate = trader.total_trades > 0 ? (trader.wins / trader.total_trades) * 100 : 0;
      const avgPnL = trader.total_trades > 0 ? trader.total_pnl / trader.total_trades : 0;
      const avgConfidence = trader.confidence_scores.length > 0 
        ? trader.confidence_scores.reduce((sum, conf) => sum + conf, 0) / trader.confidence_scores.length 
        : 0;
      
      const profitableTrades = trader.trades.filter(t => (t.pnl || 0) > 0);
      const losingTrades = trader.trades.filter(t => (t.pnl || 0) < 0);
      const bestTrade = profitableTrades.length > 0 ? Math.max(...profitableTrades.map(t => t.pnl || 0)) : 0;
      const worstTrade = losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl || 0)) : 0;

      // Calculate Sharpe-like ratio (simplified)
      const tradePnLs = trader.trades.map(t => t.pnl || 0);
      const stdDev = tradePnLs.length > 1 ? Math.sqrt(
        tradePnLs.reduce((sum, pnl) => sum + Math.pow(pnl - avgPnL, 2), 0) / (tradePnLs.length - 1)
      ) : 0;
      const sharpeRatio = stdDev > 0 ? avgPnL / stdDev : 0;

      // Consistency score (lower volatility = higher consistency)
      const consistencyScore = stdDev > 0 ? Math.max(0, 100 - (stdDev / Math.abs(avgPnL)) * 20) : 50;

      return {
        ...trader,
        win_rate: winRate,
        avg_pnl: avgPnL,
        avg_confidence: avgConfidence,
        best_trade: bestTrade,
        worst_trade: worstTrade,
        sharpe_ratio: sharpeRatio,
        consistency_score: Math.min(100, Math.max(0, consistencyScore)),
        primary_asset: Object.keys(trader.asset_types).reduce((a, b) => 
          trader.asset_types[a] > trader.asset_types[b] ? a : b, 'STOCK'),
        channel_count: trader.channels.size
      };
    });
  };

  const traderStats = getTraderStats();
  const sortedTraders = [...traderStats].sort((a, b) => {
    switch(sortBy) {
      case 'win_rate': return b.win_rate - a.win_rate;
      case 'total_trades': return b.total_trades - a.total_trades;
      case 'avg_pnl': return b.avg_pnl - a.avg_pnl;
      case 'sharpe_ratio': return b.sharpe_ratio - a.sharpe_ratio;
      case 'consistency': return b.consistency_score - a.consistency_score;
      default: return b.total_pnl - a.total_pnl;
    }
  });

  const getTraderPerformanceOverTime = (trader) => {
    const tradesByDate = {};
    let cumulativePnL = 0;

    trader.trades
      .sort((a, b) => new Date(a.created_date) - new Date(b.created_date))
      .forEach(trade => {
        const date = format(new Date(trade.created_date), 'MMM dd');
        cumulativePnL += trade.pnl || 0;
        tradesByDate[date] = cumulativePnL;
      });

    return Object.entries(tradesByDate).map(([date, pnl]) => ({ date, pnl }));
  };

  const getRiskVsReturnData = () => {
    return traderStats.map(trader => ({
      name: trader.name,
      risk: Math.abs(trader.worst_trade),
      return: trader.avg_pnl,
      totalPnL: trader.total_pnl,
      trades: trader.total_trades
    }));
  };

  const getRiskLevel = (trader) => {
    const volatility = Math.abs(trader.worst_trade - trader.best_trade);
    if (volatility > 500) return { level: 'HIGH', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
    if (volatility > 200) return { level: 'MEDIUM', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
    return { level: 'LOW', color: 'bg-green-500/20 text-green-300 border-green-500/30' };
  };

  return (
    <div className="space-y-6">
      {/* Header with Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Trader Analytics</h2>
          <p className="text-gray-400">Deep dive into individual trader performance</p>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="total_pnl">Total P&L</SelectItem>
            <SelectItem value="win_rate">Win Rate</SelectItem>
            <SelectItem value="avg_pnl">Avg P&L</SelectItem>
            <SelectItem value="total_trades">Total Trades</SelectItem>
            <SelectItem value="sharpe_ratio">Sharpe Ratio</SelectItem>
            <SelectItem value="consistency">Consistency</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Top Performers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTraders.slice(0, 6).map((trader, index) => {
          const riskLevel = getRiskLevel(trader);
          return (
            <motion.div
              key={trader.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`glass border-white/20 hover:border-blue-500/30 transition-all duration-200 cursor-pointer ${
                  selectedTrader?.name === trader.name ? 'ring-2 ring-blue-500/50' : ''
                }`}
                onClick={() => setSelectedTrader(trader)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {trader.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{trader.name}</h3>
                      <p className="text-xs text-gray-400">{trader.channel_count} channels</p>
                    </div>
                    <Badge className={riskLevel.color}>
                      {riskLevel.level}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Total P&L</p>
                      <p className={`text-lg font-bold ${
                        trader.total_pnl >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ${trader.total_pnl.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Win Rate</p>
                      <p className="text-lg font-bold text-white">{trader.win_rate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Avg P&L</p>
                      <p className={`text-sm font-medium ${
                        trader.avg_pnl >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ${trader.avg_pnl.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Trades</p>
                      <p className="text-sm font-medium text-white">{trader.total_trades}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Consistency</span>
                      <span className="text-white">{trader.consistency_score.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${trader.consistency_score}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <Badge variant="outline" className="bg-white/5 text-white border-white/20">
                      {trader.primary_asset}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {trader.last_active ? format(new Date(trader.last_active), 'MMM d') : 'No recent activity'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Trader Analysis */}
      {selectedTrader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Performance Over Time */}
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                {selectedTrader.name} - Performance Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getTraderPerformanceOverTime(selectedTrader)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pnl" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Metrics */}
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Advanced Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-sm text-gray-400">Sharpe Ratio</p>
                  <p className="text-xl font-bold text-white">
                    {selectedTrader.sharpe_ratio.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-sm text-gray-400">Best Trade</p>
                  <p className="text-xl font-bold text-green-400">
                    ${selectedTrader.best_trade.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-sm text-gray-400">Worst Trade</p>
                  <p className="text-xl font-bold text-red-400">
                    ${selectedTrader.worst_trade.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-sm text-gray-400">Avg Confidence</p>
                  <p className="text-xl font-bold text-blue-400">
                    {(selectedTrader.avg_confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-medium text-white mb-3">Asset Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(selectedTrader.asset_types).map(([type, count]) => {
                    const percentage = (count / selectedTrader.total_trades) * 100;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{type}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-white w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Risk vs Return Scatter Plot */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Risk vs Return Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={getRiskVsReturnData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="risk" 
                  stroke="#9ca3af"
                  label={{ value: 'Risk (Max Loss)', position: 'insideBottom', offset: -5, style: { fill: '#9ca3af' } }}
                />
                <YAxis 
                  dataKey="return" 
                  stroke="#9ca3af"
                  label={{ value: 'Avg Return', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name, props) => [
                    name === 'return' ? `$${value.toFixed(2)}` : `$${value.toFixed(2)}`,
                    name === 'return' ? 'Avg Return' : 'Max Risk'
                  ]}
                  labelFormatter={(label, payload) => 
                    payload && payload[0] ? `${payload[0].payload.name} (${payload[0].payload.trades} trades)` : ''
                  }
                />
                <Scatter 
                  dataKey="return" 
                  fill="#3b82f6"
                  stroke="#1d4ed8"
                  strokeWidth={2}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}