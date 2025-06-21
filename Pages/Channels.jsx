import React, { useState, useEffect } from 'react';
import { Channel } from '@/entities/all';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Radio, Plus, RefreshCw } from "lucide-react";
import ChannelCard from "../Components/channels/ChannelCard";
import WinRateConfig from "../Components/channels/WinRateConfig";

export default function Channels() {
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [configuring, setConfiguring] = useState(null);
  const [configuringType, setConfiguringType] = useState(null);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    setIsLoading(true);
    try {
      const data = await Channel.list('-created_date');
      setChannels(data || []);
    } catch (error) {
      console.error('Error loading channels:', error);
      setChannels([]);
    }
    setIsLoading(false);
  };

  const toggleChannelStatus = async (channel) => {
    try {
      await Channel.update(channel.id, { is_active: !channel.is_active });
      loadChannels();
    } catch (error) {
      console.error('Error updating channel:', error);
    }
  };

  const handleWinRateConfigSave = async (channelId, config) => {
    try {
      await Channel.update(channelId, {
        ...config,
        last_evaluation: new Date().toISOString()
      });

      // Check if channel should be auto-disabled
      const channel = channels.find(c => c.id === channelId);
      if (config.auto_disable_enabled && channel) {
        const hasEnoughTrades = (channel.total_trades || 0) >= config.min_trades_for_evaluation;
        const winRate = channel.win_rate || 0;

        if (hasEnoughTrades && winRate < config.win_rate_threshold) {
          await Channel.update(channelId, {
            is_active: false,
            disabled_reason: `Auto-disabled: Win rate ${winRate.toFixed(1)}% below ${config.win_rate_threshold}% threshold`
          });
        }
      }

      loadChannels();
      setConfiguring(null);
      setConfiguringType(null);
    } catch (error) {
      console.error('Error saving win rate configuration:', error);
    }
  };

  const handleConfigureWinRate = (channel) => {
    setConfiguring(channel);
    setConfiguringType('winrate');
  };

  const handleConfigureGeneral = (channel) => {
    setConfiguring(channel);
    setConfiguringType('general');
  };

  const cancelConfiguration = () => {
    setConfiguring(null);
    setConfiguringType(null);
  };

  if (configuringType === 'winrate' && configuring) {
    return (
      <div className="p-6">
        <WinRateConfig
          channel={configuring}
          onSave={handleWinRateConfigSave}
          onCancel={cancelConfiguration}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Discord Channels</h1>
          <p className="text-gray-400">Monitor and configure trading signal sources with performance-based controls</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={loadChannels}
            disabled={isLoading}
            variant="outline"
            className="border-white/20 hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Channel
          </Button>
        </div>
      </motion.div>

      {/* Channels Grid */}
      <div className="grid gap-6">
        {channels.map((channel, index) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            index={index}
            onToggleStatus={toggleChannelStatus}
            onConfigureWinRate={handleConfigureWinRate}
            onConfigureGeneral={handleConfigureGeneral}
          />
        ))}
      </div>

      {channels.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Radio className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No channels configured</p>
          <p className="text-gray-500 text-sm mb-4">Add Discord channels to start monitoring trading signals</p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Channel
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Loading channels...</p>
        </div>
      )}
    </div>
  );
}