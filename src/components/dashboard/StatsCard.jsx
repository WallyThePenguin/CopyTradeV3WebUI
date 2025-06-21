import React from 'react';
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, change, icon: Icon, trend, color = "blue" }) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-400",
    green: "from-green-500 to-emerald-400", 
    purple: "from-purple-500 to-violet-400",
    orange: "from-orange-500 to-red-400"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass border-white/20 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 mb-1">{title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-white">{value || '0'}</h3>
                {change && (
                  <span className={`text-sm font-medium ${
                    trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {change}
                  </span>
                )}
              </div>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} bg-opacity-20`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}