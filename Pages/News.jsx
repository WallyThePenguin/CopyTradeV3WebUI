import React, { useState, useEffect } from 'react';
import { NewsArticle } from '@/entities/all';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, TrendingUp, TrendingDown, Search, Filter, ExternalLink, Clock, RefreshCw } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, categoryFilter, sentimentFilter, activeTab]);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const data = await NewsArticle.list('-published_date', 50);
      setArticles(data || []);
    } catch (error) {
      console.error('Error loading news:', error);
      setArticles([]);
    }
    setIsLoading(false);
  };

  const filterArticles = () => {
    let filtered = articles;

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(article => article.category === activeTab.toUpperCase());
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article => 
        (article.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.summary || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.symbols_mentioned || []).some(symbol => 
          symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(article => article.category === categoryFilter);
    }

    // Filter by sentiment
    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(article => article.sentiment === sentimentFilter);
    }

    setFilteredArticles(filtered);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'NEGATIVE': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'NEUTRAL': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'HIGH': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'LOW': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'MARKET': return TrendingUp;
      case 'EARNINGS': return TrendingDown;
      default: return Newspaper;
    }
  };

  const getTabCounts = () => {
    return {
      all: articles.length,
      market: articles.filter(a => a.category === 'MARKET').length,
      earnings: articles.filter(a => a.category === 'EARNINGS').length,
      economic: articles.filter(a => a.category === 'ECONOMIC').length,
      crypto: articles.filter(a => a.category === 'CRYPTO').length
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Market News</h1>
          <p className="text-gray-400">Stay updated with latest market developments and trading opportunities</p>
        </div>
        <Button
          onClick={loadNews}
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
                placeholder="Search news, symbols..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="MARKET">Market</SelectItem>
                <SelectItem value="EARNINGS">Earnings</SelectItem>
                <SelectItem value="ECONOMIC">Economic</SelectItem>
                <SelectItem value="CRYPTO">Crypto</SelectItem>
                <SelectItem value="TECHNOLOGY">Technology</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="All Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiment</SelectItem>
                <SelectItem value="POSITIVE">Positive</SelectItem>
                <SelectItem value="NEGATIVE">Negative</SelectItem>
                <SelectItem value="NEUTRAL">Neutral</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-400 flex items-center">
              {filteredArticles.length} of {articles.length} articles
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/10 border border-white/20">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-blue-600 text-white"
          >
            All ({tabCounts.all})
          </TabsTrigger>
          <TabsTrigger 
            value="market" 
            className="data-[state=active]:bg-blue-600 text-white"
          >
            Market ({tabCounts.market})
          </TabsTrigger>
          <TabsTrigger 
            value="earnings" 
            className="data-[state=active]:bg-blue-600 text-white"
          >
            Earnings ({tabCounts.earnings})
          </TabsTrigger>
          <TabsTrigger 
            value="economic" 
            className="data-[state=active]:bg-blue-600 text-white"
          >
            Economic ({tabCounts.economic})
          </TabsTrigger>
          <TabsTrigger 
            value="crypto" 
            className="data-[state=active]:bg-blue-600 text-white"
          >
            Crypto ({tabCounts.crypto})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* News Articles */}
          <div className="space-y-4">
            {filteredArticles.map((article, index) => {
              const IconComponent = getCategoryIcon(article.category);
              
              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass border-white/20 hover:border-blue-500/30 transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {article.image_url && (
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={article.image_url} 
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white mb-2">
                                {article.title}
                              </h3>
                              {article.summary && (
                                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                  {article.summary}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={getImportanceColor(article.importance)}>
                                {article.importance} Impact
                              </Badge>
                              <Badge className={getSentimentColor(article.sentiment)}>
                                {article.sentiment}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-gray-400">{article.source}</span>
                              </div>
                              
                              <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <Clock className="w-3 h-3" />
                                {article.published_date 
                                  ? formatDistanceToNow(new Date(article.published_date), { addSuffix: true })
                                  : 'Unknown time'
                                }
                              </div>
                              
                              <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                {article.category}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {article.symbols_mentioned && article.symbols_mentioned.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-400">Symbols:</span>
                                  <div className="flex gap-1">
                                    {article.symbols_mentioned.slice(0, 3).map((symbol, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className="bg-white/5 text-white border-white/20 text-xs"
                                      >
                                        {symbol}
                                      </Badge>
                                    ))}
                                    {article.symbols_mentioned.length > 3 && (
                                      <Badge
                                        variant="outline"
                                        className="bg-white/5 text-white border-white/20 text-xs"
                                      >
                                        +{article.symbols_mentioned.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {article.url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                                >
                                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          {filteredArticles.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Newspaper className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No news articles found</p>
              <p className="text-gray-500 text-sm">Try adjusting your filters or refresh the data</p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-400">Loading news...</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}