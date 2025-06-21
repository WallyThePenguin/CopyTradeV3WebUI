
import React, { useState, useEffect } from 'react';
import { Trade } from '@/entities/all';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Search, Filter, RefreshCw } from "lucide-react";
import { format } from "date-fns";

export default function Trades() {
  const [trades, setTrades] = useState([]);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  useEffect(() => {
    loadTrades();
  }, []);

  useEffect(() => {
    filterTrades();
  }, [trades, searchTerm, statusFilter, actionFilter]);

  const loadTrades = async () => {
    setIsLoading(true);
    try {
      const data = await Trade.list('-created_date', 100);
      setTrades(data || []);
    } catch (error) {
      console.error('Error loading trades:', error);
      setTrades([]);
    }
    setIsLoading(false);
  };

  const filterTrades = () => {
    let filtered = trades;

    if (searchTerm) {
      filtered = filtered.filter(trade => 
        (trade.symbol || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trade.channel || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trade.trader || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(trade => trade.status === statusFilter);
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter(trade => trade.action === actionFilter);
    }

    setFilteredTrades(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'EXECUTED': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'CANCELLED': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'FAILED': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'UNKNOWN': return 'bg-gray-700/20 text-gray-400 border-gray-700/30';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
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
          <h1 className="text-3xl font-bold text-white mb-2">Trade History</h1>
          <p className="text-gray-400">Monitor and analyze all trading activity</p>
        </div>
        <Button
          onClick={loadTrades}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Filters */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search symbol, channel, trader..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="EXECUTED">Executed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="BUY">Buy</SelectItem>
                <SelectItem value="SELL">Sell</SelectItem>
                <SelectItem value="HOLD">Hold</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-400 flex items-center">
              {filteredTrades.length} of {trades.length} trades
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trades Table */}
      <Card className="glass border-white/20">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-300">Symbol</TableHead>
                  <TableHead className="text-gray-300">Action</TableHead>
                  <TableHead className="text-gray-300">Quantity</TableHead>
                  <TableHead className="text-gray-300">Price</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">P&L</TableHead>
                  <TableHead className="text-gray-300">Channel</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredTrades.map((trade, index) => (
                    <motion.tr
                      key={trade.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-white/5 hover:bg-white/5"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{trade.symbol || 'N/A'}</span>
                          <Badge variant="outline" className="text-xs">
                            {trade.type || 'STOCK'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {trade.action === 'BUY' ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`font-medium ${
                            trade.action === 'BUY' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {trade.action || 'N/A'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{trade.quantity || 0}</TableCell>
                      <TableCell className="text-white">${(trade.price || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(trade.status || 'UNKNOWN')}>
                          {trade.status || 'UNKNOWN'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {trade.pnl !== undefined && trade.pnl !== null ? (
                          <span className={`font-medium ${
                            trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            ${trade.pnl.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">{trade.channel || 'N/A'}</TableCell>
                      <TableCell className="text-gray-300">
                        {trade.created_date ? format(new Date(trade.created_date), 'MMM d, HH:mm') : 'No date'}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
          
          {filteredTrades.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No trades found</p>
              <p className="text-gray-500 text-sm">Try adjusting your filters or refresh the data</p>
            </div>
          )}

          {isLoading && (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-400">Loading trades...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
