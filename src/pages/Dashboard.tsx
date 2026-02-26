import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  CreditCard,
  Plus,
  ChevronRight
} from "lucide-react";
import api from "../api/axios.ts";
import { Card } from "../components/ui/Card.tsx";
import { Skeleton } from "../components/ui/Skeleton.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [balanceRes, historyRes] = await Promise.all([
          api.get("/banking/balance"),
          api.get("/banking/history?limit=5")
        ]);
        if (isMounted) {
          setBalance(balanceRes.data.data.balance);
          setHistory(historyRes.data.data.transactions);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance Card */}
        <Card variant="gradient" className="lg:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wallet className="w-48 h-48 rotate-12" />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-2">Total Balance</p>
              {loading ? (
                <Skeleton className="h-16 w-64" />
              ) : (
                <h2 className="text-6xl font-black tracking-tighter">
                  ${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h2>
              )}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Button onClick={() => window.location.href='/transfers'} className="px-8">
                <Plus className="w-5 h-5" />
                Send Money
              </Button>
              <Button variant="secondary" className="px-8">
                <CreditCard className="w-5 h-5" />
                Card Details
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/20">Monthly Income</p>
                <p className="text-lg font-bold">$12,450.00</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-white transition-all" />
          </Card>

          <Card className="flex items-center justify-between group cursor-pointer hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/20">Total Spent</p>
                <p className="text-lg font-bold">$4,230.00</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-white transition-all" />
          </Card>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight">Recent Activity</h3>
          <Link to="/history" className="text-sm font-bold text-emerald-400 hover:underline">View All</Link>
        </div>

        <div className="space-y-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : history.length > 0 ? (
            history.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      tx.type === 'TRANSFER' ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
                    )}>
                      {tx.type === 'TRANSFER' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-bold">{tx.description || (tx.type === 'TRANSFER' ? `To ${tx.receiver_name}` : 'Deposit')}</p>
                      <p className="text-xs text-white/20">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("font-black text-lg", tx.type === 'TRANSFER' ? "text-white" : "text-emerald-400")}>
                      {tx.type === 'TRANSFER' ? "-" : "+"}${tx.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-white/20">{tx.status}</p>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="py-12 text-center text-white/20 font-medium border-2 border-dashed border-white/5 rounded-[32px]">
              No transactions yet. Start by sending some money!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
