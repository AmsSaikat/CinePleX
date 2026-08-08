import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Radio, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar";

export default function CreateSquad() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tag: "",
    motto: "Honor through execution.",
    maxMembers: 5,
    isPrivate: false,
    minClearanceLevel: "LEVEL_1",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + "squad/create", formData , {withCredentials : true});
      if (response.data.success) {
        navigate("/squad");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create squad.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 pt-32 pb-20">
        <button onClick={() => navigate("/squad")} className="flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-mono uppercase tracking-widest mb-8 cursor-pointer">
          <ArrowLeft size={16} /> Abort & Return
        </button>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-950 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-6 pb-4 border-b border-white/10">
            <Radio size={16} /> INITIALIZE_NEW_SQUAD_TERMINAL
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">Squad Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Task Force 141"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">Callsign / Tag (Max 5 Chars)</label>
              <input
                type="text"
                required
                maxLength={5}
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value.toUpperCase() })}
                placeholder="e.g. TF141"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white uppercase focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">Motto / Mission Statement</label>
              <input
                type="text"
                value={formData.motto}
                onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">Max Capacity</label>
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">Min Clearance</label>
                <select
                  value={formData.minClearanceLevel}
                  onChange={(e) => setFormData({ ...formData, minClearanceLevel: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="LEVEL_1">LEVEL 1</option>
                  <option value="LEVEL_2">LEVEL 2</option>
                  <option value="LEVEL_3">LEVEL 3</option>
                  <option value="CLASSIFIED">CLASSIFIED</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "CONFIRM INITIALIZATION"}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}