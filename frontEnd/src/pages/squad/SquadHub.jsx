import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Target, BarChart3, Loader2, Settings, UserX, LogOut, Plus, Search } from "lucide-react";
import SquadCard from "../../components/SquadCard";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";

export default function SquadHub() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [hasSquad, setHasSquad] = useState(false);
  const [squadData, setSquadData] = useState(null);

  const fetchSquadDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "squad/my-squad", {withCredentials:true});
      if (response.data.success && response.data.hasSquad) {
        setHasSquad(true);
        setSquadData(response.data.squad);
      } else {
        setHasSquad(false);
        setSquadData(null);
      }
    } catch (err) {
      console.error("Error loading squad:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSquadDetails();
  }, []);

  const handleKickMember = async (targetUserId, targetName) => {
    if (!window.confirm(`Are you sure you want to dismiss ${targetName}?`)) return;
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + "squad/remove-member", { targetUserId } , {withCredentials : true});
      if (response.data.success) fetchSquadDetails();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to dismiss member.");
    }
  };

  const handleLeaveSquad = async () => {
    if (!window.confirm("Are you sure you want to leave this squad?")) return;
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + "squad/leave");
      if (response.data.success) fetchSquadDetails();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to leave squad.");
    }
  };

  const isLeader = squadData?.leader?._id === user?._id || squadData?.leader === user?._id;
  const currentMembersCount = squadData?.members?.length || 0;
  const maxMembersCount = squadData?.maxMembers || 5;

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      <Navbar />
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 size={40} className="animate-spin text-cyan-500" />
            <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
              Synchronizing Tactical Roster...
            </p>
          </div>
        ) : !hasSquad ? (
          /* --- UNASSIGNED HUB --- */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 max-w-xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black tracking-[0.3em] uppercase">
              <Shield size={14} className="animate-pulse" /> Unit Unassigned
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">
              NO ACTIVE <span className="text-cyan-500">SQUAD</span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base font-light leading-relaxed">
              You are operating as a free agent. Commission a new elite squad or scan open channels for an existing operational squad.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate("/squad/create")}
                className="w-full sm:w-auto px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-[0_0_25px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus size={16} /> INITIALIZE NEW SQUAD
              </button>
              <button
                onClick={() => navigate("/squad/join")}
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search size={16} /> BROWSE SQUADS
              </button>
            </div>
          </motion.div>
        ) : (
          /* --- ACTIVE SQUAD HUB --- */
          <>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black tracking-[0.3em] uppercase mb-2">
                <Target size={14} className="animate-pulse" /> [{squadData?.tag || "TF141"}] Mission Control
              </div>
              <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase">{squadData?.name}</h1>
              <p className="text-zinc-500 text-lg max-w-xl mx-auto font-light leading-relaxed">
                "{squadData?.motto}" <br />
                <span className="text-zinc-400 font-medium tracking-widest text-sm">ONE MISSION. ZERO LATENCY.</span>
              </p>

              <div className="flex justify-center items-center gap-8 pt-6">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-white">0{currentMembersCount} <span className="text-xs font-mono text-zinc-600">/ 0{maxMembersCount}</span></span>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Active Operatives</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <button onClick={() => navigate("/intel")} className="group flex flex-col items-center cursor-pointer">
                  <div className="p-3 mb-1 rounded-full border border-cyan-500/20 group-hover:border-cyan-500 group-hover:bg-cyan-500/10 transition-all">
                    <BarChart3 size={20} className="text-cyan-500" />
                  </div>
                  <span className="text-[10px] text-cyan-500/60 group-hover:text-cyan-400 uppercase tracking-[0.3em] font-black">Intel</span>
                </button>
              </div>
            </motion.div>

            {/* SQUAD MEMBER GRID */}
            <div className="flex flex-wrap justify-center gap-10">
              {squadData?.members?.map((memberObj, index) => {
                const member = memberObj.user || memberObj;
                const roleTitle = memberObj.role === "LEADER" ? "Leader / Strategist" : (member.role || "Operative");
                return (
                  <div key={member._id || index} className="relative group">
                    <SquadCard
                      name={member.name}
                      role={roleTitle}
                      bio={member.bio || "Executes tactical operations."}
                      lastActive={member.status || "Online now"}
                      signatureMove={member.signatureMove || "Silent Execution"}
                      photo={member.photo || `https://i.pravatar.cc/150?img=${index + 3}`}
                    />
                    {isLeader && member._id !== squadData.leader._id && (
                      <button
                        onClick={() => handleKickMember(member._id, member.name)}
                        className="absolute top-2 right-2 p-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <UserX size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ACTION FOOTER BAR */}
            <div className="mt-20 flex justify-center items-center gap-4">
              <button onClick={() => navigate("/squad/new-operative")} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-white hover:bg-cyan-500 hover:border-cyan-500 transition-all cursor-pointer">
                + ADD OPERATIVE
              </button>

              {isLeader ? (
                <button onClick={() => navigate("/squad/settings")} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center gap-2">
                  <Settings size={14} /> SETTINGS
                </button>
              ) : (
                <button onClick={handleLeaveSquad} className="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer flex items-center gap-2">
                  <LogOut size={14} /> LEAVE SQUAD
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}