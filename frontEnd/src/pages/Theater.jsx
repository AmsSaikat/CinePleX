import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Hash, Users, Radio, ShieldCheck, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Theater() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#02040a] text-zinc-100 min-h-screen font-sans selection:bg-cyan-500/30 overflow-hidden">
      <Navbar />

      {/* --- AMBIENT BACKGROUND GLOW --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-amber-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20">
        
        {/* --- PERSONALIZED WELCOME --- */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-bold tracking-widest uppercase mb-4">
            <Radio size={14} className="text-red-500 animate-pulse" /> Live Lobby
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            Welcome back, 
            <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent ml-3">
              Saikat
            </span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-light">
            Your private cinema is prepped. Ready to sync with the squad?
          </p>
        </motion.section>

        {/* --- ACTION GRID: THE BATTLE CARDS --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          
          {/* CREATE CARD */}
          <motion.div 
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden p-px rounded-[2.5rem] bg-linear-to-b from-cyan-500/50 to-transparent"
          >
            <div className="h-full bg-[#0b101a] rounded-[2.4rem] p-10 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <PlusCircle className="text-cyan-400" size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-4">Your Theater</h2>
                <p className="text-zinc-400 leading-relaxed mb-8">
                  Host a private screening. You control the playback, the guest list, and the vibe.
                </p>

                <div className="space-y-4">
                   {[
                     { icon: <Zap size={16}/>, text: "Ultra-Low Latency Sync" },
                     { icon: <ShieldCheck size={16}/>, text: "Private Encrypted Room" },
                     { icon: <Users size={16}/>, text: "Up to 50 Friends" }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-3 text-sm text-zinc-500">
                        <span className="text-cyan-500">{item.icon}</span> {item.text}
                     </div>
                   ))}
                </div>
              </div>

              <button 
                onClick={() => navigate('/create-theater')}
                className="mt-12 w-full py-5 bg-cyan-500 text-black font-black rounded-2xl hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2"
              >
                CREATE NEW SESSION
              </button>
            </div>
          </motion.div>

          {/* JOIN CARD */}
          <motion.div 
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden p-px rounded-[2.5rem] bg-linear-to-b from-amber-500/50 to-transparent"
          >
            <div className="h-full bg-[#0b101a] rounded-[2.4rem] p-10 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Hash className="text-amber-400" size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-4">Join Friends</h2>
                <p className="text-zinc-400 leading-relaxed mb-8">
                  Got a code? Drop it below to jump straight into the action with your crew.
                </p>

                <div className="relative group/input">
                  <input 
                    type="text" 
                    placeholder="ENTER ROOM CODE..."
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-amber-500/50 transition-all font-mono tracking-widest text-amber-400"
                  />
                </div>
              </div>

              <button 
                onClick={() => navigate('/join-theater')}
                className="mt-12 w-full py-5 bg-amber-500 text-black font-black rounded-2xl hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all"
              >
                JOIN THEATER
              </button>
            </div>
          </motion.div>

        </section>

        {/* --- RECENT ACTIVITY FOOTER --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 border-t border-white/5 pt-10 text-center"
        >
          <p className="text-zinc-600 text-sm uppercase tracking-widest font-bold">
            Recent Activity: <span className="text-zinc-400 font-normal ml-2">Watched "Interstellar" with 4 friends — 2 hours ago</span>
          </p>
        </motion.div>

      </div>
    </div>
  );
}