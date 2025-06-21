import React, { useState, useEffect } from 'react';
import { Trade, Position } from '@/entities/all';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, Calendar, RefreshCw, Users, Target, Award, TrendingDown as TrendingDownIcon, ArrowUp, ArrowDown } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

import TraderAnalytics from "../Components/analytics/TraderAnalytics";

export default function Analytics() {
  const [trades, setTrades] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [tradesData, positionsData] = await Promise.all([
        Trade.list('-created_date', 500),
        Position.list('-created_date')
      ]);

      setTrades(tradesData || []);
      setPositions(positionsData || []);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setTrades([]);
      setPositions([]);
    }
    setIsLoading(false);
  };

  const getFilteredTrades = () => {
    const days = parseInt(timeRange.replace('d', ''));
    const cutoffDate = startOfDay(subDays(new Date(), days));
    return trades.filter(trade => trade.created_date && new Date(trade.created_date) >= cutoffDate);
  };

  const getPnLOverTime = () => {
    const filteredTrades = getFilteredTrades();
    const daily = {};

    filteredTrades.forEach(trade => {
      if (trade.status === 'EXECUTED' && trade.pnl !== undefined) {
        const date = format(new Date(trade.created_date), 'MMM dd');
        daily[date] = (daily[date] || 0) + trade.pnl;
      }
    });

    return Object.entries(daily).map(([date, pnl]) => ({
      date,
      pnl: parseFloat(pnl.toFixed(2))
    }));
  };

  const getTradeVolumeData = () => {
    const filteredTrades = getFilteredTrades();
    const daily = {};

    filteredTrades.forEach(trade => {
      const date = format(new Date(trade.created_date), 'MMM dd');
      daily[date] = (daily[date] || 0) + 1;
    });

    return Object.entries(daily).map(([date, count]) => ({
      date,
      count
    }));
  };

  const getAssetTypeDistribution = () => {
    const typeCount = {};
    trades.forEach(trade => {
      typeCount[trade.type || 'STOCK'] = (typeCount[trade.type || 'STOCK'] || 0) + 1;
    });

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#ec4899'];
    return Object.entries(typeCount).map(([type, count], index) => ({
      name: type,
      value: count,
      color: colors[index % colors.length]
    }));
  };

  const getChannelPerformance = () => {
    const channelStats = {};

    trades.forEach(trade => {
      const channel = trade.channel || 'Unknown';
      if (!channelStats[channel]) {
        channelStats[channel] = { wins: 0, losses: 0, total: 0, pnl: 0 };
      }

      channelStats[channel].total += 1;
      if (trade.pnl !== undefined) {
        if (trade.pnl > 0) channelStats[channel].wins += 1;
        else if (trade.pnl < 0) channelStats[channel].losses += 1;
        channelStats[channel].pnl += trade.pnl;
      }
    });

    return Object.entries(channelStats).map(([channel, stats]) => ({
      channel,
      winRate: stats.total > 0 ? (stats.wins / stats.total * 100).toFixed(1) : 0,
      totalPnL: stats.pnl.toFixed(2),
      avgPnL: stats.total > 0 ? (stats.pnl / stats.total).toFixed(2) : '0.00',
      trades: stats.total
    }));
  };

  const getAdvancedOverviewStats = () => {
    const filteredTrades = getFilteredTrades().filter(t => t.status === 'EXECUTED' && t.pnl !== null && t.pnl !== undefined);

    const winningTrades = filteredTrades.filter(t => t.pnl > 0);
    const losingTrades = filteredTrades.filter(t => t.pnl < 0);

    const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));

    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : Infinity;

    const symbolPerformance = {};
    filteredTrades.forEach(trade => {
      symbolPerformance[trade.symbol] = (symbolPerformance[trade.symbol] || 0) + trade.pnl;
    });

    const sortedSymbols = Object.entries(symbolPerformance)
      .sort(([, pnlA], [, pnlB]) => pnlB - pnlA);

    return {
      totalWins: winningTrades.length,
      totalLosses: losingTrades.length,
      avgWin: winningTrades.length > 0 ? grossProfit / winningTrades.length : 0,
      avgLoss: losingTrades.length > 0 ? grossLoss / losingTrades.length : 0,
      profitFactor: profitFactor,
      topSymbols: sortedSymbols.slice(0, 5),
      worstSymbols: sortedSymbols.slice(-5).reverse(),
    };
  };

  const pnlData = getPnLOverTime();
  const volumeData = getTradeVolumeData();
  const assetDistribution = getAssetTypeDistribution();
  const channelPerformance = getChannelPerformance();
  const advancedStats = getAdvancedOverviewStats();

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trading Analytics</h1>
          <p className="text-gray-400">Comprehensive performance analysis and insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={loadAnalyticsData}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-96 bg-white/10 border border-white/20">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-600 text-white"
          >
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="traders"
            className="data-[state=active]:bg-blue-600 text-white"
          >
            <Users className="w-4 h-4 mr-2" />
            Trader Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Profit Factor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-400">{isFinite(advancedStats.profitFactor) ? advancedStats.profitFactor.toFixed(2) : '∞'}</p>
                <p className="text-xs text-gray-500">Gross Profit / Gross Loss</p>
              </CardContent>
            </Card>
            <Card className="glass border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Avg. Winning Trade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-400">${advancedStats.avgWin.toFixed(2)}</p>
                <p className="text-xs text-gray-500">From {advancedStats.totalWins} trades</p>
              </CardContent>
            </Card>
            <Card className="glass border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Avg. Losing Trade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-400">${advancedStats.avgLoss.toFixed(2)}</p>
                <p className="text-xs text-gray-500">From {advancedStats.totalLosses} trades</p>
              </CardContent>
            </Card>
            <Card className="glass border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Win / Loss Count</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{advancedStats.totalWins} / {advancedStats.totalLosses}</p>
                <p className="text-xs text-gray-500">Total winning vs losing trades</p>
              </CardContent>
            </Card>
          </div>

          {/* P&L Over Time */}
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5" />
                Profit & Loss Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pnlData}>
                    <defs>
                      <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
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
                    <Area
                      type="monotone"
                      dataKey="pnl"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#pnlGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6"> {/* Changed from lg:grid-cols-2 to lg:grid-cols-3 */}
            {/* Trade Volume */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5" />
                  Daily Trade Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volumeData}>
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
                      <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Asset Distribution */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="w-5 h-5" />
                  Asset Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {assetDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Win/Loss Ratio */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5" />
                  Win / Loss Ratio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{ name: 'Trades', wins: advancedStats.totalWins, losses: advancedStats.totalLosses }]} layout="vertical" barCategoryGap="0%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                      <XAxis type="number" stroke="#9ca3af" />
                      <YAxis type="category" dataKey="name" hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="wins" stackId="a" fill="#10b981" />
                      <Bar dataKey="losses" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Top 5 Symbols */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white"><Award />Top 5 Symbols</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {advancedStats.topSymbols.length > 0 ? (
                    advancedStats.topSymbols.map(([symbol, pnl]) => (
                      <li key={symbol} className="flex justify-between items-center text-sm">
                        <span className="font-medium text-white">{symbol}</span>
                        <span className="font-semibold text-green-400 flex items-center gap-1">
                          <ArrowUp className="w-3 h-3" />
                          ${pnl.toFixed(2)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No data available for top symbols.</p>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Worst 5 Symbols */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white"><TrendingDownIcon />Worst 5 Symbols</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {advancedStats.worstSymbols.length > 0 ? (
                    advancedStats.worstSymbols.map(([symbol, pnl]) => (
                      <li key={symbol} className="flex justify-between items-center text-sm">
                        <span className="font-medium text-white">{symbol}</span>
                        <span className="font-semibold text-red-400 flex items-center gap-1">
                          <ArrowDown className="w-3 h-3" />
                          ${pnl.toFixed(2)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No data available for worst symbols.</p>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Channel Performance (Simplified) */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto h-48">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-gray-300 py-2">Channel</th>
                        <th className="text-right text-gray-300 py-2">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {channelPerformance.length > 0 ? (
                        channelPerformance.sort((a, b) => parseFloat(b.totalPnL) - parseFloat(a.totalPnL)).map((channel, index) => (
                          <motion.tr
                            key={channel.channel}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-white/5"
                          >
                            <td className="py-2 text-white font-medium">{channel.channel}</td>
                            <td className={`py-2 text-right font-medium ${parseFloat(channel.totalPnL) >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                              ${channel.totalPnL}
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="py-2 text-center text-gray-400">No channel data available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traders">
          <TraderAnalytics trades={trades} timeRange={timeRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
