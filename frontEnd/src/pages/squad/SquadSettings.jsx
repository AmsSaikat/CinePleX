import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Settings, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar";

export default function SquadSettings() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    motto: "",
    maxMembers: 5,
    isPrivate: false,
    minClearanceLevel: "LEVEL_1",
  });

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + "squad/my-squad" , {withCredentials : true}).then((res) => {
      if (res.data.hasSquad) {
        const sq = res.data.squad;
        setFormData({
          name: sq.name || "",
          motto: sq.motto || "",
          maxMembers: sq.maxMembers || 5,
          isPrivate: sq.isPrivate || false,
          minClearanceLevel: sq.minClearanceLevel || "LEVEL_1",
        });
      }
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.put(import.meta.env.VITE_API_URL + "squad/settings", formData , {withCredentials : true});
      if (response.data.success) navigate("/squad");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisband = async () => {
    if (!window.confirm("WARNING: This action is permanent. Disband squad?")) return;
    try {
      const response = await axios.delete(import.meta.env.VITE_API_URL + "squad/disband");
      if (response.data.success) navigate("/squad");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to disband squad.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      <main className="max-w-xl mx-auto px-6 pt-32 pb-20">
        <button onClick={() => navigate("/squad")} className="flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-mono uppercase tracking-widest mb-8 cursor-pointer">
          <ArrowLeft size={16} /> Return to Mission Control
        </button>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-950 border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase pb-4 border-b border-white/10">
            <Settings size={16} /> RECONFIGURE_SQUAD_SETTINGS
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">Squad Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-cyan-500" />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">Motto</label>
              <input type="text" value={formData.motto} onChange={(e) => setFormData({ ...formData, motto: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-cyan-500" />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button type="button" onClick={handleDisband} className="px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer">
                <Trash2 size={14} /> DISBAND SQUAD
              </button>

              <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all cursor-pointer">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "SAVE CONFIGURATION"}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}