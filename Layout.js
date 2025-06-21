
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
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'
    }`}>
      <style>{`
        :root {
          --primary: 239 68% 68%;
          --primary-foreground: 222.2 84% 4.9%;
          --secondary: 210 40% 98%;
          --secondary-foreground: 222.2 84% 4.9%;
          --accent: 210 40% 96%;
          --accent-foreground: 222.2 84% 4.9%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --muted: 210 40% 96%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 222.2 84% 4.9%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 239 68% 68%;
          --radius: 0.75rem;
        }
        
        .dark {
          --primary: 239 68% 68%;
          --primary-foreground: 222.2 84% 4.9%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 239 68% 68%;
        }
        
        .glass {
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.7)'};
          backdrop-filter: blur(20px);
          border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
        }
        
        .glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
      `}</style>
      
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar className={`glass ${theme === 'dark' ? 'border-r border-white/20' : 'border-r border-black/10'}`}>
            <SidebarHeader className={`${theme === 'dark' ? 'border-b border-white/20' : 'border-b border-black/10'} p-6`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center glow">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>CopyTradeV2</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {connectionStatus === 'connected' ? 'Live Updates' : 'Disconnected'}
                    </p>
                  </div>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupLabel className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider px-2 py-2`}>
                  Trading
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`${theme === 'dark' ? 'hover:bg-white/10 hover:text-white' : 'hover:bg-black/5 hover:text-slate-900'} transition-all duration-200 rounded-xl mb-1 ${
                            location.pathname === item.url 
                              ? `bg-gradient-to-r from-blue-500/20 to-cyan-500/20 ${theme === 'dark' ? 'text-white' : 'text-slate-900'} border border-blue-500/30 glow` 
                              : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
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
                <SidebarGroupLabel className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider px-2 py-2`}>
                  System Status
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-4 py-3 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>AI Model</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Discord Bot</span>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Trading</span>
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        Simulation
                      </Badge>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className={`${theme === 'dark' ? 'border-t border-white/20' : 'border-t border-black/10'} p-4`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">T</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-sm truncate`}>Trader</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} truncate`}>Advanced Analytics</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className={`${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'} backdrop-blur-sm ${theme === 'dark' ? 'border-b border-white/10' : 'border-b border-black/10'} px-6 py-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 md:hidden">
                  <SidebarTrigger className={`${theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-slate-900'} p-2 rounded-lg transition-colors duration-200`} />
                  <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>CopyTradeV2</h1>
                </div>
                
                {/* Settings Dropdown */}
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className={`${theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-slate-900'}`}>
                        <Settings className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={`${theme === 'dark' ? 'bg-slate-800 border-white/20' : 'bg-white border-black/10'} min-w-48`}>
                      <DropdownMenuItem 
                        onClick={toggleTheme}
                        className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-black/5'}`}
                      >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className={theme === 'dark' ? 'bg-white/10' : 'bg-black/10'} />
                      <DropdownMenuItem className={`${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-black/5'}`}>
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

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
