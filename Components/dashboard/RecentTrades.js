import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function RecentTrades({ trades = [], isLoading }) {
  if (isLoading) {
    return (
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-white/20">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-white">Recent Trades</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {trades.slice(0, 5).map((trade, index) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  trade.action === 'BUY' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {trade.action === 'BUY' ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">{trade.symbol || 'N/A'}</p>
                  <p className="text-xs text-gray-400">
                    {trade.quantity || 0} shares @ ${(trade.price || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={trade.status === 'EXECUTED' ? 'default' : 'secondary'}
                  className={`mb-1 ${
                    trade.status === 'EXECUTED' 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  }`}
                >
                  {trade.status || 'UNKNOWN'}
                </Badge>
                <p className="text-xs text-gray-400">
                  {trade.created_date ? format(new Date(trade.created_date), 'MMM d, HH:mm') : 'No date'}
                </p>
              </div>
            </motion.div>
          ))}
          
          {trades.length === 0 && (
            <div className="text-center py-8">
              <ArrowRight className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">No trades yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}