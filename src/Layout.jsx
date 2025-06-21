// src/Layout.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  BarChart3,
  TrendingUp,
  Briefcase,
  Radio,
  Calendar,
  Settings,
  Activity,
  Zap,
  Moon,
  Sun
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    title: "Trades",
    url: createPageUrl("Trades"),
    icon: TrendingUp,
  },
  {
    title: "Positions",
    url: createPageUrl("Positions"),
    icon: Briefcase,
  },
  {
    title: "Channels",
    url: createPageUrl("Channels"),
    icon: Radio,
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: Activity,
  },
  {
    title: "News",
    url: createPageUrl("News"),
    icon: Calendar,
  },
  {
    title: "Market",
    url: createPageUrl("Market"),
    icon: Calendar,
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [connectionStatus, setConnectionStatus] = React.useState('connected');
  const [theme, setTheme] = React.useState('dark');

  React.useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  React.useEffect(() => {
    // Simulate connection status for demo
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.1 ? 'connected' : 'disconnected');
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className={`min-h-screen bg-background text-foreground`}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar className={`glass border-r border-border`}>
            <SidebarHeader className={`border-b border-border p-6`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center glow">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`font-bold text-xl text-foreground`}>CopyTradeV2</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                    <p className={`text-xs text-muted-foreground`}>
                      {connectionStatus === 'connected' ? 'Live Updates' : 'Disconnected'}
                    </p>
                  </div>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupLabel className={`text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-2`}>
                  Trading
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-xl mb-1 ${location.pathname === item.url
                              ? `bg-primary/10 text-primary-foreground border border-primary/20 glow`
                              : `text-muted-foreground`
                            }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup className="mt-8">
                <SidebarGroupLabel className={`text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-2`}>
                  System Status
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-4 py-3 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`text-muted-foreground`}>AI Model</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`text-muted-foreground`}>Discord Bot</span>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`text-muted-foreground`}>Trading</span>
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        Simulation
                      </Badge>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className={`border-t border-border p-4`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">T</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-foreground text-sm truncate`}>Trader</p>
                  <p className={`text-xs text-muted-foreground truncate`}>Advanced Analytics</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className={`bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 md:hidden">
                  <SidebarTrigger className={`hover:bg-accent text-foreground p-2 rounded-lg transition-colors duration-200`} />
                  <h1 className={`text-xl font-semibold text-foreground`}>CopyTradeV2</h1>
                </div>

                {/* Settings Dropdown */}
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className={`hover:bg-accent text-foreground`}>
                        <Settings className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={`bg-card border-border min-w-48`}>
                      <DropdownMenuItem
                        onClick={toggleTheme}
                        className={`flex items-center gap-2 text-card-foreground hover:bg-accent`}
                      >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className={`bg-border`} />
                      <DropdownMenuItem className={`text-card-foreground hover:bg-accent`}>
                        <Link to={createPageUrl("Settings")} className="flex items-center gap-2 w-full">
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}