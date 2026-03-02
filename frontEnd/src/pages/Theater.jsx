import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  Globe, 
  Users, 
  Radio, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Activity,
  Trophy
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Theater() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#020617] text-zinc-100 min-h-screen font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <Navbar />

      {/* --- CINEMATIC BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-250 h-250 bg-cyan-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-250 h-250 bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* --- OPERATIVE WELCOME --- */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-black tracking-[0.3em] uppercase mb-4">
            <Radio size={12} className="text-cyan-500 animate-pulse" /> Command Center Online
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
            Welcome, <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">Saikat</span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-light italic">
            Select your deployment method. Cinema is a team sport.
          </p>
        </motion.section>

        {/* --- ACTION GRID --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* CREATE CARD: THE "GHOST" HOST */}
          <motion.div 
            whileHover={{ y: -5, scale: 1.01 }}
            className="group relative bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 overflow-hidden"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-10 group-hover:rotate-90 transition-transform duration-500">
                  <PlusCircle className="text-cyan-400" size={32} />
                </div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Host<br/>Screening</h2>
                <p className="text-zinc-400 font-medium leading-relaxed mb-10 max-w-xs">
                  Generate an encrypted 6-digit protocol and lead your squad through the ultimate cinema experience.
                </p>

                <div className="space-y-4">
                   <FeatureRow icon={<Zap size={16}/>} text="Master Playback Control" />
                   <FeatureRow icon={<ShieldCheck size={16}/>} text="Invite-Only Security" />
                   <FeatureRow icon={<Users size={16}/>} text="Voice Chat Integration" />
                </div>
              </div>

              <button 
                onClick={() => navigate('/create-theater')}
                className="mt-12 w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-cyan-500 transition-all flex items-center justify-center gap-2 group/btn"
              >
                INITIALIZE THEATER <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* JOIN CARD: THE DISCOVERY HUB */}
          <motion.div 
            whileHover={{ y: -5, scale: 1.01 }}
            className="group relative bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 overflow-hidden"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                  <Globe className="text-amber-400" size={32} />
                </div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Public<br/>Theaters</h2>
                <p className="text-zinc-400 font-medium leading-relaxed mb-10 max-w-xs">
                  Don't have a code? Browse public screenings and join a worldwide community watch party.
                </p>

                {/* MINI LIVE FEED PREVIEW */}
                <div className="bg-black/40 rounded-2xl border border-white/5 p-4 space-y-3">
                  <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Live Now
                  </p>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-zinc-300">Avengers: Endgame</span>
                    <span className="text-[10px] text-zinc-500">24/50 Joined</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">Inception (Directors Cut)</span>
                    <span className="text-[10px] text-zinc-500">12 Joined</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-10">
                <button 
                  onClick={() => navigate('/join-theater')}
                  className="py-5 bg-zinc-800 text-white font-black rounded-2xl hover:bg-zinc-700 transition-all text-xs tracking-tighter"
                >
                  USE CODE
                </button>
                <button 
                  className="py-5 bg-amber-500 text-black font-black rounded-2xl hover:bg-amber-400 transition-all text-xs tracking-tighter flex items-center justify-center gap-2"
                >
                  BROWSE ALL <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>

        </section>

        {/* --- GLOBAL RANKING / STATS --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <StatBox icon={<Users />} label="Active Operatives" value="12,482" />
          <StatBox icon={<Trophy />} label="Top Squad Today" value="ALPHA_UNIT" />
          <StatBox icon={<Activity />} label="Uptime Status" value="99.9% Sync" />
        </motion.div>

      </div>
    </div>
  );
}

// UI HELPER COMPONENTS
function FeatureRow({ icon, text }) {
  return (
    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">
      <span className="text-cyan-500/50 group-hover:text-cyan-400 transition-colors">{icon}</span> {text}
    </div>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div className="space-y-2 opacity-40 hover:opacity-100 transition-opacity cursor-default group">
      <div className="text-zinc-500 group-hover:text-cyan-400 flex justify-center transition-colors">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">{label}</p>
      <p className="text-xl font-black italic tracking-tighter text-zinc-200">{value}</p>
    </div>
  );
}