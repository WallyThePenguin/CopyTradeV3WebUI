import React, { useState, useEffect } from 'react';
import { Trade, Position, Channel, Signal } from '@/entities/all';
import { TrendingUp, DollarSign, Target, BarChart3, Sunrise } from 'lucide-react';
import { motion } from 'framer-motion';
import { isToday } from 'date-fns';

import StatsCard from "../Components/dashboard/StatsCard";
import LiveMetrics from "../Components/dashboard/LiveMetrics";
import RecentTrades from "../Components/dashboard/RecentTrades";
import ChannelStatus from "../Components/dashboard/ChannelStatus";

export default function Dashboard() {
  const [trades, setTrades] = useState([]);
  const [positions, setPositions] = useState([]);
  const [channels, setChannels] = useState([]);
  const [signals, setSignals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [tradesData, positionsData, channelsData, signalsData] = await Promise.all([
        Trade.list('-created_date', 50),
        Position.list('-created_date'),
        Channel.list(),
        Signal.list('-created_date', 20)
      ]);

      setTrades(tradesData || []);
      setPositions(positionsData || []);
      setChannels(channelsData || []);
      setSignals(signalsData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set empty arrays on error to prevent null issues
      setTrades([]);
      setPositions([]);
      setChannels([]);
      setSignals([]);
    }
    setIsLoading(false);
  };

  const calculateStats = () => {
    const totalTrades = trades.length;
    const executedTrades = trades.filter(t => t.status === 'EXECUTED');
    const totalPnL = executedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const winningTrades = executedTrades.filter(t => (t.pnl || 0) > 0);
    const winRate = executedTrades.length > 0 ? (winningTrades.length / executedTrades.length) * 100 : 0;
    const totalPositionValue = positions.reduce((sum, pos) => sum + (pos.market_value || 0), 0);
    const avgPnL = executedTrades.length > 0 ? totalPnL / executedTrades.length : 0;

    const todaysTrades = executedTrades.filter(t => t.execution_time && isToday(new Date(t.execution_time)));
    const todaysReturn = todaysTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);

    return {
      totalTrades,
      totalPnL: totalPnL || 0,
      avgPnL: avgPnL || 0,
      winRate: winRate || 0,
      totalPositionValue: totalPositionValue || 0,
      todaysReturn: todaysReturn || 0
    };
  };

  const stats = calculateStats();

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trading Dashboard</h1>
          <p className="text-gray-400">Real-time monitoring and analytics for your automated trading system</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <StatsCard
          title="Portfolio Value"
          value={`$${stats.totalPositionValue.toFixed(2)}`}
          change="+5.7%"
          trend="up"
          icon={BarChart3}
          color="blue"
        />
        <StatsCard
          title="Total P&L"
          value={`$${stats.totalPnL.toFixed(2)}`}
          change={stats.totalPnL >= 0 ? "+8.2%" : "-3.1%"}
          trend={stats.totalPnL >= 0 ? "up" : "down"}
          icon={DollarSign}
          color={stats.totalPnL >= 0 ? "green" : "orange"}
        />
        <StatsCard
          title="Today's P&L"
          value={`$${stats.todaysReturn.toFixed(2)}`}
          change={stats.todaysReturn >= 0 ? "+1.3%" : "-0.5%"}
          trend={stats.todaysReturn >= 0 ? "up" : "down"}
          icon={Sunrise}
          color={stats.todaysReturn >= 0 ? "green" : "orange"}
        />
        <StatsCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          change="+2.1%"
          trend="up"
          icon={Target}
          color="purple"
        />
        <StatsCard
          title="Avg P&L / Trade"
          value={`$${stats.avgPnL.toFixed(2)}`}
          change={stats.avgPnL >= 0 ? "+5.4%" : "-2.8%"}
          trend={stats.avgPnL >= 0 ? "up" : "down"}
          icon={Target}
          color={stats.avgPnL >= 0 ? "green" : "orange"}
        />
        <StatsCard
          title="Total Trades"
          value={stats.totalTrades}
          change="+12%"
          trend="up"
          icon={TrendingUp}
          color="blue"
        />
      </div>

      {/* Live Metrics and Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LiveMetrics />
          <RecentTrades trades={trades} isLoading={isLoading} />
        </div>

        <div className="space-y-6">
          <ChannelStatus channels={channels} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}