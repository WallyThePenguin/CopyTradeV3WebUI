import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings2, Bot, Shield, Bell, Database, Zap } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    tradingEnabled: false,
    simulationMode: true,
    confidenceThreshold: 0.7,
    maxPositionSize: 1000,
    riskPerTrade: 2,
    notifications: {
      trades: true,
      signals: true,
      errors: true,
      dailyReport: false
    }
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNotificationSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
          <p className="text-gray-400">Configure your trading bot and monitoring preferences</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trading Configuration */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bot className="w-5 h-5" />
              Trading Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Trading Enabled</Label>
                <p className="text-sm text-gray-400">Enable automated trading execution</p>
              </div>
              <Switch
                checked={settings.tradingEnabled}
                onCheckedChange={(checked) => updateSetting('tradingEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Simulation Mode</Label>
                <p className="text-sm text-gray-400">Trade with virtual money for testing</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.simulationMode}
                  onCheckedChange={(checked) => updateSetting('simulationMode', checked)}
                />
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  SAFE MODE
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Global Confidence Threshold</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.confidenceThreshold}
                  onChange={(e) => updateSetting('confidenceThreshold', parseFloat(e.target.value))}
                  className="bg-white/10 border-white/20 text-white"
                />
                <span className="text-sm text-gray-400">
                  {(settings.confidenceThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Minimum AI confidence required for trade execution
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Max Position Size</Label>
                <Input
                  type="number"
                  value={settings.maxPositionSize}
                  onChange={(e) => updateSetting('maxPositionSize', parseInt(e.target.value))}
                  className="bg-white/10 border-white/20 text-white"
                />
                <p className="text-xs text-gray-400">USD per trade</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Risk Per Trade</Label>
                <Input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={settings.riskPerTrade}
                  onChange={(e) => updateSetting('riskPerTrade', parseFloat(e.target.value))}
                  className="bg-white/10 border-white/20 text-white"
                />
                <p className="text-xs text-gray-400">% of portfolio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Trade Notifications</Label>
                <p className="text-sm text-gray-400">Alerts for executed trades</p>
              </div>
              <Switch
                checked={settings.notifications.trades}
                onCheckedChange={(checked) => updateNotificationSetting('trades', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Signal Alerts</Label>
                <p className="text-sm text-gray-400">New trading signals detected</p>
              </div>
              <Switch
                checked={settings.notifications.signals}
                onCheckedChange={(checked) => updateNotificationSetting('signals', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Error Notifications</Label>
                <p className="text-sm text-gray-400">System errors and failures</p>
              </div>
              <Switch
                checked={settings.notifications.errors}
                onCheckedChange={(checked) => updateNotificationSetting('errors', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Daily Report</Label>
                <p className="text-sm text-gray-400">Daily performance summary</p>
              </div>
              <Switch
                checked={settings.notifications.dailyReport}
                onCheckedChange={(checked) => updateNotificationSetting('dailyReport', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white">Discord Bot</span>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Connected
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white">Mistral AI Model</span>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-white">Robinhood API</span>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                Simulation
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white">Database</span>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="w-5 h-5" />
              Advanced Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full border-white/20 hover:bg-white/10 text-white"
            >
              <Database className="w-4 h-4 mr-2" />
              Export Trading Data
            </Button>

            <Button
              variant="outline"
              className="w-full border-white/20 hover:bg-white/10 text-white"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Reset Configuration
            </Button>

            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Security Note</span>
              </div>
              <p className="text-sm text-gray-300">
                All sensitive credentials are stored securely and encrypted. 
                Never share your API keys or passwords.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Save Settings
        </Button>
      </div>
    </div>
  );
}