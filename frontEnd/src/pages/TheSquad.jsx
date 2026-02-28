import React from "react";
import { motion } from "framer-motion";
import { Users, Shield, Target, Zap } from "lucide-react";
import SquadCard from "../components/SquadCard";
import Navbar from "../components/Navbar";

export default function TheSquad() {
  const squad = [
    {
      name: "X",
      role: "Leader / Strategist",
      bio: "Runs the show. Cold mind, clean execution.",
      lastActive: "Online now",
      signatureMove: "Master Plan",
      photo: "https://i.pravatar.cc/150?img=3",
    },
    {
      name: "Y",
      role: "Tech Guy",
      bio: "Breaks systems before they break us.",
      lastActive: "5 mins ago",
      signatureMove: "Zero-Day Strike",
      photo: "https://i.pravatar.cc/150?img=5",
    },
    {
      name: "Z",
      role: "Operations",
      bio: "Gets things done. No questions asked.",
      lastActive: "1 hour ago",
      signatureMove: "Silent Execution",
      photo: "https://i.pravatar.cc/150?img=8",
    },
    {
      name: "W",
      role: "Recon",
      bio: "Sees everything before it happens.",
      lastActive: "Yesterday",
      signatureMove: "Ghost Walk",
      photo: "https://i.pravatar.cc/150?img=11",
    },
  ];

  // Animation variants for the grid
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden">
      <Navbar />

      {/* --- TACTICAL BACKGROUND OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* --- PAGE HEADER --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black tracking-[0.3em] uppercase mb-4">
            <Target size={14} className="animate-pulse" /> Mission Control
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none uppercase">
            THE <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">SQUAD</span>
          </h1>

          <p className="text-zinc-500 text-lg max-w-xl mx-auto font-light leading-relaxed">
            Not just a team. A high-performance unit. <br />
            <span className="text-zinc-400 font-medium tracking-widest">ONE MISSION. ZERO LATENCY.</span>
          </p>

          <div className="flex justify-center gap-8 pt-6">
             <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-white">04</span>
                <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Active</span>
             </div>
             <div className="h-10 w-px bg-white/10" />
             <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-cyan-500">100%</span>
                <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Ready</span>
             </div>
          </div>
        </motion.div>

        {/* --- SQUAD GRID --- */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap justify-center gap-10 md:gap-14"
        >
          {squad.map((member, index) => (
            <motion.div key={index} variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}>
              <SquadCard {...member} />
            </motion.div>
          ))}
        </motion.div>

        {/* --- FOOTER ACTION --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-24 text-center"
        >
          <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-white hover:bg-cyan-500 hover:border-cyan-500 transition-all shadow-xl">
             + ADD NEW OPERATIVE
          </button>
        </motion.div>
      </main>
    </div>
  );
}