
import React, { useState, useEffect } from 'react';
import { Position } from '@/entities/all';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Briefcase, TrendingUp, TrendingDown, RefreshCw, DollarSign } from "lucide-react";
import { format } from "date-fns";

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    setIsLoading(true);
    try {
      const data = await Position.list('-created_date');
      setPositions(data || []);
    } catch (error) {
      console.error('Error loading positions:', error);
      setPositions([]); // Set to empty array on error
    }
    setIsLoading(false);
  };

  const calculatePortfolioStats = () => {
    const totalValue = positions.reduce((sum, pos) => sum + (pos.market_value || 0), 0);
    const totalUnrealizedPnL = positions.reduce((sum, pos) => sum + (pos.unrealized_pnl || 0), 0);
    const gainers = positions.filter(pos => (pos.unrealized_pnl || 0) > 0).length;
    const losers = positions.filter(pos => (pos.unrealized_pnl || 0) < 0).length;

    return { 
      totalValue: totalValue || 0, 
      totalUnrealizedPnL: totalUnrealizedPnL || 0, 
      gainers, 
      losers 
    };
  };

  const stats = calculatePortfolioStats();

  const getTypeColor = (type) => {
    switch (type) {
      case 'STOCK': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'OPTION': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'CRYPTO': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Positions</h1>
          <p className="text-gray-400">Monitor your current holdings and performance</p>
        </div>
        <Button
          onClick={loadPositions}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Value</p>
                <p className="text-xl font-bold text-white">${stats.totalValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                stats.totalUnrealizedPnL >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {stats.totalUnrealizedPnL >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-400">Unrealized P&L</p>
                <p className={`text-xl font-bold ${
                  stats.totalUnrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  ${stats.totalUnrealizedPnL.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Gainers</p>
                <p className="text-xl font-bold text-white">{stats.gainers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Losers</p>
                <p className="text-xl font-bold text-white">{stats.losers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Positions Table */}
      <Card className="glass border-white/20">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2 text-white">
            <Briefcase className="w-5 h-5" />
            Current Positions ({positions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-300">Symbol</TableHead>
                  <TableHead className="text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-300">Quantity</TableHead>
                  <TableHead className="text-gray-300">Avg Cost</TableHead>
                  <TableHead className="text-gray-300">Current Price</TableHead>
                  <TableHead className="text-gray-300">Market Value</TableHead>
                  <TableHead className="text-gray-300">Unrealized P&L</TableHead>
                  <TableHead className="text-gray-300">% Change</TableHead>
                  <TableHead className="text-gray-300">Channel</TableHead>
                  <TableHead className="text-gray-300">Open Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((position, index) => {
                  const avgPrice = position.avg_price || 0;
                  const currentPrice = position.current_price || 0;
                  const percentChange = avgPrice > 0 
                    ? ((currentPrice - avgPrice) / avgPrice) * 100 
                    : 0;

                  return (
                    <motion.tr
                      key={position.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-white/5 hover:bg-white/5"
                    >
                      <TableCell>
                        <span className="font-medium text-white">{position.symbol || 'N/A'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(position.type || 'STOCK')}>
                          {position.type || 'STOCK'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{position.quantity || 0}</TableCell>
                      <TableCell className="text-white">${avgPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-white">${currentPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-white">${(position.market_value || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          (position.unrealized_pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          ${(position.unrealized_pnl || 0).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          percentChange >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-300">{position.channel || 'N/A'}</TableCell>
                      <TableCell className="text-gray-300">
                        {position.open_date ? format(new Date(position.open_date), 'MMM d, yyyy') : '-'}
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {positions.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No positions held</p>
              <p className="text-gray-500 text-sm">Your portfolio positions will appear here</p>
            </div>
          )}

          {isLoading && (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-400">Loading positions...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}