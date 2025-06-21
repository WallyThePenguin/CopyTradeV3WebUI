import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Activity, Zap } from "lucide-react";

export default function LiveMetrics() {
  const [metrics, setMetrics] = useState({
    messagesProcessed: 0,
    signalsGenerated: 0,
    tradesExecuted: 0,
    accuracy: 0
  });

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        messagesProcessed: prev.messagesProcessed + Math.floor(Math.random() * 3),
        signalsGenerated: prev.signalsGenerated + (Math.random() > 0.7 ? 1 : 0),
        tradesExecuted: prev.tradesExecuted + (Math.random() > 0.8 ? 1 : 0),
        accuracy: Math.min(100, 65 + Math.random() * 20)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="glass border-white/20">
      <CardHeader className="border-b border-white/10 pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <Activity className="w-5 h-5" />
          Live System Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Messages Processed</span>
              <motion.span 
                key={metrics.messagesProcessed}
                initial={{ scale: 1.2, color: "#60a5fa" }}
                animate={{ scale: 1, color: "#ffffff" }}
                className="text-lg font-bold text-white"
              >
                {metrics.messagesProcessed}
              </motion.span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Signals Generated</span>
              <motion.span
                key={metrics.signalsGenerated} 
                initial={{ scale: 1.2, color: "#34d399" }}
                animate={{ scale: 1, color: "#ffffff" }}
                className="text-lg font-bold text-white"
              >
                {metrics.signalsGenerated}
              </motion.span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Trades Executed</span>
              <motion.span
                key={metrics.tradesExecuted}
                initial={{ scale: 1.2, color: "#f59e0b" }}
                animate={{ scale: 1, color: "#ffffff" }}
                className="text-lg font-bold text-white"
              >
                {metrics.tradesExecuted}
              </motion.span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">AI Accuracy</span>
              <motion.span
                key={Math.round(metrics.accuracy)}
                initial={{ scale: 1.2, color: "#8b5cf6" }}
                animate={{ scale: 1, color: "#ffffff" }}
                className="text-lg font-bold text-white"
              >
                {metrics.accuracy.toFixed(1)}%
              </motion.span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
          <Zap className="w-3 h-3" />
          <span>Updates every 2 seconds</span>
        </div>
      </CardContent>
    </Card>
  );
}