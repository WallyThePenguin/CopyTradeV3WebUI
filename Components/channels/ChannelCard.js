
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Wifi, WifiOff, Settings2, Target, AlertTriangle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export default function ChannelCard({ channel, index, onToggleStatus, onConfigureWinRate, onConfigureGeneral }) {
  const getWinRateStatus = () => {
    const hasEnoughTrades = (channel.total_trades || 0) >= (channel.min_trades_for_evaluation || 10);
    const winRate = channel.win_rate || 0;
    const threshold = channel.win_rate_threshold || 60;
    
    if (!hasEnoughTrades) {
      return { status: 'pending', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
    }
    
    if (winRate >= threshold) {
      return { status: 'good', color: 'bg-green-500/20 text-green-300 border-green-500/30' };
    }
    
    return { status: 'poor', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
  };

  const winRateStatus = getWinRateStatus();
  const avgPnL = (channel.total_trades || 0) > 0 ? (channel.total_pnl || 0) / (channel.total_trades || 1) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="glass border-white/20 hover:border-blue-500/30 transition-all duration-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                channel.is_active ? 'bg-green-500/20' : 'bg-gray-500/20'
              }`}>
                {channel.is_active ? (
                  <Wifi className="w-5 h-5 text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <CardTitle className="text-white">{channel.name || 'Unknown Channel'}</CardTitle>
                <p className="text-sm text-gray-400">{channel.description || 'Trading signal source'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-400">Active</Label>
              <Switch
                checked={channel.is_active || false}
                onCheckedChange={() => onToggleStatus(channel)}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{channel.total_trades || 0}</p>
              <p className="text-xs text-gray-400">Total Trades</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {(channel.win_rate || 0).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-400">Win Rate</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${
                (channel.total_pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ${(channel.total_pnl || 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">Total P&L</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${
                avgPnL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ${avgPnL.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">Avg P&L</p>
            </div>
          </div>

          {/* Confidence Threshold */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Confidence Threshold</p>
              <p className="text-xs text-gray-400">Minimum AI confidence for trades</p>
            </div>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              {((channel.confidence_threshold || 0.7) * 100).toFixed(0)}%
            </Badge>
          </div>

          {/* Win Rate Auto-Disable Status */}
          {channel.auto_disable_enabled && (
            <div className={`p-3 rounded-lg ${
              winRateStatus.status === "good" ? "bg-green-500/10 border-green-500/20" :
              winRateStatus.status === 'poor' ? 'bg-red-500/10 border-red-500/20' :
              'bg-yellow-500/10 border-yellow-500/20'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Auto-Disable Active</span>
              </div>
              <p className="text-xs text-gray-300">
                {winRateStatus.status === 'pending' && 
                  `Need ${(channel.min_trades_for_evaluation || 10) - (channel.total_trades || 0)} more trades for evaluation`
                }
                {winRateStatus.status === 'good' && 
                  `Win rate meets ${channel.win_rate_threshold}% threshold`
                }
                {winRateStatus.status === 'poor' && 
                  `Win rate below ${channel.win_rate_threshold}% threshold - channel at risk`
                }
              </p>
            </div>
          )}

          {/* Disabled Reason */}
          {!channel.is_active && channel.disabled_reason && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-300">
                <strong>Disabled:</strong> {channel.disabled_reason}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConfigureWinRate(channel)}
              className="border-white/20 hover:bg-white/10 flex-1"
            >
              <Target className="w-4 h-4 mr-2" />
              Win Rate Config
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConfigureGeneral(channel)}
              className="border-white/20 hover:bg-white/10 flex-1"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              General Settings
            </Button>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-4 border-t border-white/10">
            <div>
              <p className="text-gray-400">Discord ID</p>
              <p className="text-white font-mono text-xs">{channel.discord_id || 'Not configured'}</p>
            </div>
            <div>
              <p className="text-gray-400">Last Message</p>
              <p className="text-white text-xs">
                {channel.last_message 
                  ? format(new Date(channel.last_message), 'MMM d, yyyy HH:mm')
                  : 'No messages yet'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}