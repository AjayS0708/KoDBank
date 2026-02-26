import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  History, 
  Settings, 
  LogOut, 
  Wallet,
  Menu,
  X,
  User,
  Bell
} from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { cn } from "../utils/cn.ts";

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Transfers", path: "/transfers", icon: ArrowRightLeft },
    { name: "History", path: "/history", icon: History },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Kodbank</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group",
                location.pathname === item.path
                  ? "bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/10"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-black" : "text-white/20 group-hover:text-emerald-400")} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a0a] border-r border-white/5 transform transition-transform duration-300 lg:hidden",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile Sidebar Content (similar to desktop) */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet className="text-emerald-500 w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight">Kodbank</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-white/40 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="px-4 py-8 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all",
                location.pathname === item.path
                  ? "bg-emerald-500 text-black font-bold"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 lg:px-10">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-white/40 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden lg:block">
            <h2 className="text-xl font-bold tracking-tight">
              {navItems.find(i => i.path === location.pathname)?.name || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-white/40 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-white/5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{user?.username}</p>
                <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                <User className="w-6 h-6 text-white/20" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
