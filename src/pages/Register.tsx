import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { User, Mail, Phone, ShieldCheck, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios.ts";
import { Button } from "../components/ui/Button.tsx";
import { Input } from "../components/ui/Input.tsx";
import { Card } from "../components/ui/Card.tsx";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[120px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-6">
            <Wallet className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">Join Kodbank</h1>
          <p className="text-white/40 text-sm font-medium">The future of digital banking starts here</p>
        </div>

        <Card variant="glass">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Username"
              placeholder="johndoe"
              icon={<User className="w-5 h-5" />}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              icon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              icon={<Phone className="w-5 h-5" />}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<ShieldCheck className="w-5 h-5" />}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <div className="md:col-span-2 pt-4">
              <Button type="submit" className="w-full py-4" isLoading={loading}>
                Create Secure Account
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/40">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-400 font-bold hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
