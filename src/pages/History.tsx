import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Download
} from "lucide-react";
import api from "../api/axios.ts";
import { Card } from "../components/ui/Card.tsx";
import { Input } from "../components/ui/Input.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Skeleton } from "../components/ui/Skeleton.tsx";

const History: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async (page = 1) => {
      setLoading(true);
      try {
        const res = await api.get(`/banking/history?page=${page}&limit=10`);
        if (isMounted) {
          setHistory(res.data.data.transactions);
          setPagination(res.data.data.pagination);
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory(pagination.page);
    return () => { isMounted = false; };
  }, [pagination.page]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">Transaction History</h1>
          <p className="text-white/40 font-medium">Monitor and manage your financial activity</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="secondary" size="sm">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-white/20">Transaction</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-white/20">Date</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-white/20">Status</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-white/20 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-8 py-4"><Skeleton className="h-12 w-full" /></td>
                  </tr>
                ))
              ) : history.length > 0 ? (
                history.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          tx.type === 'TRANSFER' ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
                        )}>
                          {tx.type === 'TRANSFER' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{tx.description || (tx.type === 'TRANSFER' ? `To ${tx.receiver_name}` : 'Deposit')}</p>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-white/20">{tx.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-white/40">
                      {new Date(tx.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <p className={cn("font-black", tx.type === 'TRANSFER' ? "text-white" : "text-emerald-400")}>
                        {tx.type === 'TRANSFER' ? "-" : "+"}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-white/20 font-medium italic">
                    No transaction records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
          <p className="text-xs text-white/20 font-medium">
            Showing page <span className="text-white">{pagination.page}</span> of <span className="text-white">{pagination.totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default History;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
