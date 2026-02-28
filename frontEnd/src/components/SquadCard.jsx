import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Activity, Award } from "lucide-react";

export default function SquadCard({
  photo,
  name,
  role,
  bio,
  lastActive,
  signatureMove,
}) {
  return (
    <motion.div 
      whileHover={{ y: -12, scale: 1.02 }}
      className="relative group w-80"
    >
      {/* --- CINEMATIC GLOW (Background) --- */}
      <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 to-purple-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* --- THE MAIN CARD --- */}
      <div className="relative overflow-hidden bg-[#0a0f1a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl transition-all duration-500 group-hover:border-cyan-500/30">
        
        {/* TOP SECTION: Avatar & Status */}
        <div className="relative flex justify-center mb-6">
          <div className="relative">
            {/* Animated Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/50 animate-ping opacity-20" />
            
            <img
              src={photo}
              alt={name}
              className="relative z-10 w-28 h-28 rounded-[2.5rem] object-cover border-2 border-white/10 group-hover:border-cyan-400 transition-colors duration-500"
            />
            
            {/* Live Indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0a0f1a] rounded-full flex items-center justify-center border border-white/10 z-20">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
            </div>
          </div>
        </div>

        {/* IDENTITY SECTION */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black tracking-tighter italic text-white group-hover:text-cyan-400 transition-colors">
            {name.toUpperCase()}
          </h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            <ShieldCheck size={12} className="text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{role}</span>
          </div>
        </div>

        {/* BIO SECTION */}
        <p className="mt-6 text-sm text-zinc-400 leading-relaxed text-center font-light italic">
          "{bio}"
        </p>

        {/* DATA GRID (Premium CRUD Reading) */}
        <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-between group/stat">
            <div className="flex items-center gap-2 text-zinc-500">
              <Activity size={14} className="group-hover/stat:text-green-400 transition-colors" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Status</span>
            </div>
            <span className="text-[11px] font-mono text-green-400">{lastActive}</span>
          </div>

          <div className="flex items-center justify-between group/stat">
            <div className="flex items-center gap-2 text-zinc-500">
              <Zap size={14} className="group-hover/stat:text-yellow-400 transition-colors" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Signature</span>
            </div>
            <span className="text-[11px] font-mono text-yellow-400">{signatureMove}</span>
          </div>
        </div>

        {/* HOVER ACTION BUTTON */}
        <button className="mt-8 w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-white hover:text-black transition-all">
          View Watch History
        </button>

      </div>
    </motion.div>
  );
}