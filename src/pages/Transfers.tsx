import React, { useState } from "react";
import { motion } from "motion/react";
import { Send, User, DollarSign, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios.ts";
import { Card } from "../components/ui/Card.tsx";
import { Input } from "../components/ui/Input.tsx";
import { Button } from "../components/ui/Button.tsx";

const Transfers: React.FC = () => {
  const [formData, setFormData] = useState({
    receiverUsername: "",
    amount: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.receiverUsername || !formData.amount) return;

    setLoading(true);

    if (localStorage.getItem("demo_mode") === "true") {
      setTimeout(() => {
        toast.success("Demo Transfer completed successfully!");
        setFormData({ receiverUsername: "", amount: "", description: "" });
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      await api.post("/banking/transfer", {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      toast.success("Transfer completed successfully!");
      setFormData({ receiverUsername: "", amount: "", description: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tighter mb-2">Send Money</h1>
        <p className="text-white/40 font-medium">Transfer funds instantly to any Kodbank user</p>
      </div>

      <Card variant="glass">
        <form onSubmit={handleTransfer} className="space-y-8">
          <Input
            label="Recipient Username"
            placeholder="Enter username"
            icon={<User className="w-5 h-5" />}
            value={formData.receiverUsername}
            onChange={(e) => setFormData({ ...formData, receiverUsername: e.target.value })}
            required
          />

          <Input
            label="Amount to Send"
            type="number"
            step="0.01"
            placeholder="0.00"
            icon={<DollarSign className="w-5 h-5" />}
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />

          <Input
            label="Description (Optional)"
            placeholder="What's this for?"
            icon={<MessageSquare className="w-5 h-5" />}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="pt-4">
            <Button type="submit" className="w-full py-4" isLoading={loading}>
              <Send className="w-5 h-5" />
              Confirm Transfer
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-10 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
          <Send className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold mb-1">Secure Transfers</p>
          <p className="text-xs text-white/40 leading-relaxed">
            All transfers are processed instantly and protected by our multi-layer security system. 
            Please double-check the recipient's username before confirming.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Transfers;
