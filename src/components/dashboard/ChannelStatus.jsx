import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Radio, Wifi, WifiOff } from "lucide-react";

export default function ChannelStatus({ channels = [], isLoading }) {
  if (isLoading) {
    return (
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Channel Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1,2,3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-2/3"></div>
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
        <CardTitle className="flex items-center gap-2 text-white">
          <Radio className="w-5 h-5" />
          Channel Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {channels.map((channel, index) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  channel.is_active ? 'bg-green-500/20' : 'bg-gray-500/20'
                }`}>
                  {channel.is_active ? (
                    <Wifi className="w-4 h-4 text-green-400" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">{channel.name || 'Unknown Channel'}</p>
                  <p className="text-xs text-gray-400">
                    {channel.total_trades || 0} trades • {(channel.win_rate || 0).toFixed(1)}% win rate
                  </p>
                </div>
              </div>
              <Badge 
                variant={channel.is_active ? 'default' : 'secondary'}
                className={channel.is_active 
                  ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                  : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                }
              >
                {channel.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </motion.div>
          ))}
          
          {channels.length === 0 && (
            <div className="text-center py-6">
              <Radio className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">No channels configured</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}