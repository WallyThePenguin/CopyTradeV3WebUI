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
  Zap
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

  React.useEffect(() => {
    // Simulate connection status for demo
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.1 ? 'connected' : 'disconnected');
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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
        
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
      `}</style>
      
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar className="glass border-r border-white/20">
            <SidebarHeader className="border-b border-white/20 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center glow">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-white">CopyTradeV2</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <p className="text-xs text-gray-300">
                      {connectionStatus === 'connected' ? 'Live Updates' : 'Disconnected'}
                    </p>
                  </div>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2 py-2">
                  Trading
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-white/10 hover:text-white transition-all duration-200 rounded-xl mb-1 ${
                            location.pathname === item.url 
                              ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-500/30 glow' 
                              : 'text-gray-300'
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
                <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2 py-2">
                  System Status
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-4 py-3 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">AI Model</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Discord Bot</span>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Trading</span>
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        Simulation
                      </Badge>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-white/20 p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">T</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">Trader</p>
                  <p className="text-xs text-gray-400 truncate">Advanced Analytics</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-6 py-4 md:hidden">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-white/10 p-2 rounded-lg transition-colors duration-200 text-white" />
                <h1 className="text-xl font-semibold text-white">CopyTradeV2</h1>
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