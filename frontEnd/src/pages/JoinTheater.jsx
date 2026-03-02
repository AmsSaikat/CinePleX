import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Ticket, Users, PlayCircle, ShieldCheck, 
  ChevronRight, Cpu, Radio, Globe, ClipboardPaste, Sparkles 
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function JoinTheater() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [isPasting, setIsPasting] = useState(false);

  // Handle Input logic
  const handleChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (val.length <= 6) setCode(val);
  };

  // Auto-Paste Functionality
  const handlePaste = async () => {
    try {
      setIsPasting(true);
      const text = await navigator.clipboard.readText();
      // Clean the string: uppercase, remove spaces, limit to 6
      const cleaned = text.toUpperCase().trim().replace(/[^A-Z0-9]/g, "").slice(0, 6);
      setCode(cleaned);
      setTimeout(() => setIsPasting(false), 600);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
      setIsPasting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      <Navbar />

      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-250 h-150 bg-cyan-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-125 h-125 bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        
        {/* --- HERO SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em]">
            <Radio size={12} className="animate-pulse" /> Secure Connection Established
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
            ENTER THE <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">THEATER</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Synchronize your session. Join your squad in the private screening room.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* --- ACCESS CARD --- */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-blue-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
            <div className="relative bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
              
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">Access Code</h2>
                  <p className="text-zinc-500 text-[10px] font-black tracking-widest uppercase">Input 6-Digit Protocol</p>
                </div>
                <button 
                  onClick={handlePaste}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all text-xs font-bold"
                >
                  <ClipboardPaste size={14} className={isPasting ? "animate-bounce" : ""} />
                  {isPasting ? "PASTING..." : "SMART PASTE"}
                </button>
              </div>

              {/* SEGMENTED INPUT DISPLAY */}
              <div className="relative space-y-8">
                <div className="flex justify-between gap-2 md:gap-4">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <div 
                      key={index} 
                      className={`w-full h-16 md:h-20 rounded-2xl bg-black/40 border transition-all duration-500 flex items-center justify-center text-2xl md:text-3xl font-mono
                        ${code[index] ? "border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)] scale-105" : "border-white/5 text-zinc-800"}
                      `}
                    >
                      {code[index] || "•"}
                    </div>
                  ))}
                </div>
                
                {/* REAL HIDDEN INPUT */}
                <input 
                  type="text" 
                  value={code}
                  onChange={handleChange}
                  maxLength={6}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-text z-30"
                  autoFocus
                />

                <button 
                  onClick={() => navigate('/active-theater')}
                  disabled={code.length < 6}
                  className="w-full py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-cyan-500 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-10 disabled:grayscale group/btn overflow-hidden relative"
                >
                  <span className="relative z-10 flex items-center gap-2 uppercase tracking-tighter">
                    {code.length === 6 ? "INITIALIZE LINK" : "AWAITING PROTOCOL"}
                    <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                  {code.length === 6 && (
                    <motion.div 
                      layoutId="glow"
                      className="absolute inset-0 bg-linear-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                </button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/5 pt-8 opacity-40">
                <MiniInfo icon={<ShieldCheck size={14} />} label="ENCRYPTED" />
                <MiniInfo icon={<Globe size={14} />} label="GLOBAL" />
                <MiniInfo icon={<Sparkles size={14} />} label="SYNCED" />
              </div>
            </div>
          </motion.div>

          {/* --- RIGHT: THEATER PREVIEW TICKET --- */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-md border border-white/5 overflow-hidden shadow-2xl relative">
              {/* Ticket Top Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#020617] rounded-b-3xl border-x border-b border-white/5" />
              
              <div className="p-10 pt-14 space-y-8">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <p className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.2em]">Live Session Found</p>
                      <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-white">Interstellar</h3>
                   </div>
                   <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                      <PlayCircle size={32} />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-y-8 border-y border-white/5 py-8">
                  <Stat label="Host Operative" value="Saikat" color="text-white" />
                  <Stat label="Live Squad" value="04 / 08" color="text-green-400" />
                  <Stat label="Data Stream" value="4K UHD" color="text-purple-400" />
                  <Stat label="Sync Status" value="Perfect" color="text-cyan-400" />
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-[#0e1626] bg-zinc-800 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                      ))}
                   </div>
                   <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Waiting in lobby...</p>
                </div>
              </div>
            </div>

            {/* QUICK FEATURES HUD */}
            <div className="grid grid-cols-3 gap-3">
               <HUDItem icon={<Ticket />} text="AD FREE" />
               <HUDItem icon={<Users />} text="VOICE" />
               <HUDItem icon={<Cpu />} text="0 LATENCY" />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// UI HELPER COMPONENTS
function Stat({ label, value, color }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{label}</p>
      <p className={`text-sm font-bold uppercase tracking-tight ${color}`}>{value}</p>
    </div>
  );
}

function MiniInfo({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
       <span className="text-zinc-600">{icon}</span>
       <span className="text-[8px] font-black tracking-widest text-zinc-500">{label}</span>
    </div>
  );
}

function HUDItem({ icon, text }) {
  return (
    <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 flex flex-col items-center gap-2 group hover:border-cyan-500/30 transition-all">
      <div className="text-zinc-600 group-hover:text-cyan-400 transition-colors">{React.cloneElement(icon, { size: 16 })}</div>
      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">{text}</span>
    </div>
  );
}