import React, { useState, useEffect } from 'react';
import { MarketEvent } from '@/entities/all';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, AlertTriangle, Clock, RefreshCw } from "lucide-react";
import { format, isToday, isTomorrow, addDays } from "date-fns";

export default function Market() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    setIsLoading(true);
    try {
      const data = await MarketEvent.list('-date', 50);
      setEvents(data);
    } catch (error) {
      console.error('Error loading market data:', error);
    }
    setIsLoading(false);
  };

  const getEventsByDate = () => {
    const grouped = {};
    events.forEach(event => {
      const date = event.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    
    return Object.entries(grouped).sort(([a], [b]) => new Date(a) - new Date(b));
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'HIGH': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'LOW': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'EARNINGS': return TrendingUp;
      case 'FED': return AlertTriangle;
      case 'ECONOMIC': return Calendar;
      default: return Clock;
    }
  };

  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMM d');
  };

  const groupedEvents = getEventsByDate();

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Market Calendar</h1>
          <p className="text-gray-400">Stay informed about upcoming market events and earnings</p>
        </div>
        <Button
          onClick={loadMarketData}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Market Calendar */}
      <div className="space-y-6">
        {groupedEvents.map(([date, dayEvents], dayIndex) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIndex * 0.1 }}
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white mb-2">
                {formatDateLabel(date)}
              </h2>
              <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
            </div>
            
            <div className="grid gap-4">
              {dayEvents.map((event, eventIndex) => {
                const IconComponent = getCategoryIcon(event.category);
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (dayIndex * 0.1) + (eventIndex * 0.05) }}
                  >
                    <Card className="glass border-white/20 hover:border-blue-500/30 transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${
                            event.impact === 'HIGH' ? 'bg-red-500/20' :
                            event.impact === 'MEDIUM' ? 'bg-yellow-500/20' :
                            'bg-green-500/20'
                          }`}>
                            <IconComponent className={`w-5 h-5 ${
                              event.impact === 'HIGH' ? 'text-red-400' :
                              event.impact === 'MEDIUM' ? 'text-yellow-400' :
                              'text-green-400'
                            }`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                  {event.title}
                                </h3>
                                {event.description && (
                                  <p className="text-gray-400 text-sm mb-3">
                                    {event.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-3">
                                  {event.time && (
                                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                                      <Clock className="w-3 h-3" />
                                      {event.time}
                                    </div>
                                  )}
                                  <Badge className={getImpactColor(event.impact)}>
                                    {event.impact} Impact
                                  </Badge>
                                  <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                    {event.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            {event.symbols_affected && event.symbols_affected.length > 0 && (
                              <div className="mt-4">
                                <p className="text-sm text-gray-400 mb-2">Affected Symbols:</p>
                                <div className="flex flex-wrap gap-2">
                                  {event.symbols_affected.map((symbol, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="bg-white/5 text-white border-white/20 text-xs"
                                    >
                                      {symbol}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {events.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No market events scheduled</p>
          <p className="text-gray-500 text-sm">Market calendar events will appear here</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Loading market calendar...</p>
        </div>
      )}
    </div>
  );
}