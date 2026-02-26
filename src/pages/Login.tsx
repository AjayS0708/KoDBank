import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { User, ShieldCheck, Eye, EyeOff, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.tsx";
import api from "../api/axios.ts";
import { Button } from "../components/ui/Button.tsx";
import { Input } from "../components/ui/Input.tsx";
import { Card } from "../components/ui/Card.tsx";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", formData);
      login(res.data.data.user);
      toast.success("Welcome back to Kodbank!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-6">
            <Wallet className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">Welcome Back</h1>
          <p className="text-white/40 text-sm font-medium">Access your secure banking portal</p>
        </div>

        <Card variant="glass">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              placeholder="Enter your username"
              icon={<User className="w-5 h-5" />}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={<ShieldCheck className="w-5 h-5" />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-white/20 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button type="submit" className="w-full py-4" isLoading={loading}>
              Sign In to Account
            </Button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-white/40">
              New to Kodbank?{" "}
              <Link to="/register" className="text-emerald-400 font-bold hover:underline">
                Create an account
              </Link>
            </p>
            <div className="pt-4 border-t border-white/5">
              <button 
                onClick={() => {
                  localStorage.setItem("demo_mode", "true");
                  localStorage.setItem("user", JSON.stringify({ username: "demo_user", role: "customer", balance: 125450.00 }));
                  window.location.href = "/";
                }}
                className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20 hover:text-emerald-400 transition-colors"
              >
                — Try Demo Mode —
              </button>
            </div>
          </div>
        </Card>

        <p className="mt-10 text-center text-[10px] uppercase tracking-[0.3em] text-white/10 font-black">
          Enterprise Grade Security &bull; AES-256 Encrypted
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
