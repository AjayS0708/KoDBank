/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  UserPlus, 
  LogIn, 
  Wallet, 
  LogOut, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";

type View = "login" | "register" | "dashboard";

interface UserSession {
  username: string;
  role: string;
}

export default function App() {
  const [view, setView] = useState<View>("login");
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setUser(null);
      setView("login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => !user && setView("login")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Wallet className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Kodbank
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium text-white/90">{user.username}</span>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">{user.role}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setView("login")}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${view === "login" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => setView("register")}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${view === "register" ? "bg-emerald-500 text-black font-bold" : "text-white/60 hover:text-white"}`}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 backdrop-blur-xl"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 backdrop-blur-xl"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {view === "login" && (
            <LoginView 
              onSuccess={(userData) => {
                setUser(userData);
                setView("dashboard");
                setSuccess("Welcome back!");
              }}
              onError={setError}
              onSwitch={() => setView("register")}
            />
          )}
          {view === "register" && (
            <RegisterView 
              onSuccess={() => {
                setView("login");
                setSuccess("Registration successful! Please login.");
              }}
              onError={setError}
              onSwitch={() => setView("login")}
            />
          )}
          {view === "dashboard" && user && (
            <DashboardView 
              user={user}
              onError={setError}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/5 text-center">
        <p className="text-white/20 text-xs tracking-widest uppercase font-medium">
          &copy; 2024 Kodbank Secure Systems &bull; All Rights Reserved
        </p>
      </footer>
    </div>
  );
}

function LoginView({ onSuccess, onError, onSwitch }: { onSuccess: (u: UserSession) => void, onError: (m: string) => void, onSwitch: () => void }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess(data.user);
      } else {
        onError(data.error);
      }
    } catch (err) {
      onError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md p-10 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-white/40 text-sm">Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">Username</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text"
              required
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
              placeholder="Your username"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">Password</label>
          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
              placeholder="••••••••"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-white/40">
          Don't have an account?{" "}
          <button onClick={onSwitch} className="text-emerald-400 font-semibold hover:underline">Register now</button>
        </p>
      </div>
    </motion.div>
  );
}

function RegisterView({ onSuccess, onError, onSwitch }: { onSuccess: () => void, onError: (m: string) => void, onSwitch: () => void }) {
  const [formData, setFormData] = useState({
    uid: "KB-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    uname: "",
    password: "",
    email: "",
    phone: "",
    role: "customer"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess();
      } else {
        onError(data.error);
      }
    } catch (err) {
      onError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl p-10 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
        <p className="text-white/40 text-sm">Join Kodbank and start managing your wealth</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">User ID (Auto)</label>
          <input 
            type="text"
            readOnly
            value={formData.uid}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white/40 cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">Username</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text"
              required
              value={formData.uname}
              onChange={e => setFormData({ ...formData, uname: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
              placeholder="Choose username"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">Phone Number</label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="tel"
              required
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">Password</label>
          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="password"
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">Role</label>
          <select 
            disabled
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white/40 cursor-not-allowed"
          >
            <option>Customer</option>
          </select>
        </div>

        <div className="md:col-span-2 pt-4">
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Registration"}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-white/40">
          Already have an account?{" "}
          <button onClick={onSwitch} className="text-emerald-400 font-semibold hover:underline">Sign in</button>
        </p>
      </div>
    </motion.div>
  );
}

function DashboardView({ user, onError }: { user: UserSession, onError: (m: string) => void }) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const checkBalance = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/balance");
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
        
        // Party Popper Animation
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

      } else {
        onError(data.error);
      }
    } catch (err) {
      onError("Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            Hello, <span className="text-emerald-400">{user.username}</span>
          </h1>
          <p className="text-white/40 font-medium">Welcome to your secure banking dashboard.</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
          Account Status: Active
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <motion.div 
          layout
          className="md:col-span-2 p-8 rounded-[32px] bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 backdrop-blur-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-32 h-32 rotate-12" />
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Available Balance</p>
              <AnimatePresence mode="wait">
                {balance !== null ? (
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl font-black tracking-tighter"
                  >
                    ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </motion.h2>
                ) : (
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-6xl font-black tracking-tighter text-white/10"
                  >
                    $ ••••••••
                  </motion.h2>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-12">
              <button 
                onClick={checkBalance}
                disabled={loading}
                className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
                {balance !== null ? "Refresh Balance" : "Check Balance"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Info Card */}
        <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/20 mb-2">Account Type</p>
              <p className="text-lg font-bold">Premium Savings</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/20 mb-2">Member Since</p>
              <p className="text-lg font-bold">Feb 2024</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/20 mb-2">Security Level</p>
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <p className="text-sm font-bold">High (JWT Encrypted)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Area */}
      {balance !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center"
        >
          <p className="text-emerald-400 font-medium">
            Your balance is <span className="font-bold">${balance.toLocaleString()}</span>. 
            Keep saving to reach your goals! 🎉
          </p>
        </motion.div>
      )}
    </div>
  );
}
