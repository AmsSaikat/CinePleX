import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ShieldCheck, Users, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar";

export default function JoinSquad() {
  const navigate = useNavigate();
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPublicSquads = async () => {
    setLoading(true);
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "squad/public");
      if (response.data.success) {
        setSquads(response.data.squads || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicSquads();
  }, []);

  const handleJoinSquad = async (squadId) => {
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + "squad/join", { squadId } , {withCredentials: true});
      if (response.data.success) {
        navigate("/squad");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join squad.");
    }
  };

  const filteredSquads = squads.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.tag.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <button onClick={() => navigate("/squad")} className="flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-mono uppercase tracking-widest mb-8 cursor-pointer">
          <ArrowLeft size={16} /> Back to Hub
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-wider">AVAILABLE SQUADS</h1>
            <p className="text-xs text-zinc-400 font-mono">Request commissioning into existing active units.</p>
          </div>

          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by tag or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-cyan-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSquads.map((sq) => (
              <motion.div key={sq._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-950 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-cyan-400 font-mono font-black text-xs">[ {sq.tag} ]</span>
                    <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                      <Users size={12} /> {sq.members?.length || 0} / {sq.maxMembers}
                    </span>
                  </div>
                  <h3 className="text-xl font-black uppercase italic">{sq.name}</h3>
                  <p className="text-xs text-zinc-400 font-light mt-1">"{sq.motto}"</p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">{sq.minClearanceLevel}</span>
                  <button
                    onClick={() => handleJoinSquad(sq._id)}
                    className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black font-mono font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <ShieldCheck size={14} /> REQUEST JOIN
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}