
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Target, AlertTriangle, CheckCircle2, Settings } from "lucide-react";

export default function WinRateConfig({ channel, onUpdate, onSave, onCancel }) {
  const [config, setConfig] = useState({
    win_rate_threshold: channel.win_rate_threshold || 60,
    min_trades_for_evaluation: channel.min_trades_for_evaluation || 10,
    auto_disable_enabled: channel.auto_disable_enabled || false
  });

  const handleSave = () => {
    onSave(channel.id, config);
  };

  const getPerformanceStatus = () => {
    const hasEnoughTrades = (channel.total_trades || 0) >= config.min_trades_for_evaluation;
    const winRate = channel.win_rate || 0;
    
    if (!hasEnoughTrades) {
      return {
        status: 'pending',
        message: `Need ${config.min_trades_for_evaluation - (channel.total_trades || 0)} more trades for evaluation`,
        color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      };
    }
    
    if (winRate >= config.win_rate_threshold) {
      return {
        status: 'good',
        message: `Win rate ${winRate.toFixed(1)}% meets threshold`,
        color: 'bg-green-500/20 text-green-300 border-green-500/30'
      };
    }
    
    return {
      status: 'poor',
      message: `Win rate ${winRate.toFixed(1)}% below ${config.win_rate_threshold}% threshold`,
      color: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
  };

  const performanceStatus = getPerformanceStatus();
  const avgPnL = (channel.total_trades || 0) > 0 ? (channel.total_pnl || 0) / (channel.total_trades || 1) : 0;

  return (
    <Card className="glass border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Target className="w-5 h-5" />
          Win Rate Configuration - {channel.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Performance */}
        <div className="p-4 rounded-lg bg-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-white">Current Performance</h3>
            <Badge className={performanceStatus.color}>
              {performanceStatus.status.toUpperCase()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-3">
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
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-white">
              {performanceStatus.message}
            </AlertDescription>
          </Alert>
        </div>

        {/* Configuration Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Auto-Disable Based on Win Rate</Label>
              <p className="text-sm text-gray-400">
                Automatically disable channel when performance falls below threshold
              </p>
            </div>
            <Switch
              checked={config.auto_disable_enabled}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, auto_disable_enabled: checked }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Win Rate Threshold (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={config.win_rate_threshold}
                onChange={(e) => 
                  setConfig(prev => ({ ...prev, win_rate_threshold: parseFloat(e.target.value) }))
                }
                className="bg-white/10 border-white/20 text-white"
              />
              <p className="text-xs text-gray-400">
                Minimum win rate % to keep channel active
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Minimum Trades for Evaluation</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={config.min_trades_for_evaluation}
                onChange={(e) => 
                  setConfig(prev => ({ ...prev, min_trades_for_evaluation: parseInt(e.target.value) }))
                }
                className="bg-white/10 border-white/20 text-white"
              />
              <p className="text-xs text-gray-400">
                Number of trades needed before evaluation starts
              </p>
            </div>
          </div>
        </div>

        {/* Simulation */}
        {config.auto_disable_enabled && (
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Configuration Preview</span>
            </div>
            <div className="text-sm text-gray-300">
              <p>• Channel will be auto-disabled if win rate drops below {config.win_rate_threshold}%</p>
              <p>• Evaluation starts after {config.min_trades_for_evaluation} trades</p>
              <p>• Current status: <span className="font-medium">{performanceStatus.status}</span></p>
              {performanceStatus.status === 'poor' && config.auto_disable_enabled && (
                <p className="text-red-400 font-medium">⚠ This channel would be disabled with current settings</p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-white/20 hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}