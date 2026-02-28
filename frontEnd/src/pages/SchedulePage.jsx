import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, History, Users, Bell, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import ScheduleSlider from "../components/ScheduleSlider";

export default function SchedulePage() {
  return (
    <div className="bg-[#020617] text-zinc-100 min-h-screen font-sans selection:bg-cyan-500/30">
      <Navbar />

      {/* --- PREMIUM HERO HEADER --- */}
      <section className="relative w-full py-32 px-6 overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15)_0%,transparent_50%)]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto text-center space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-[0.2em]">
            <Calendar size={14} /> Synchronized Scheduling
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic">
            WATCH <span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.3)]">TOGETHER</span>
            <br /> <span className="text-zinc-500">ON TIME.</span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Don't just watch—plan. Synchronize your squad for movie nights that actually happen.
          </p>
        </motion.div>
      </section>

      {/* --- UPCOMING SCREENINGS (THE MAIN EVENT) --- */}
      <section className="relative w-full py-24 bg-zinc-950/50 backdrop-blur-3xl border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">Upcoming Screenings</h2>
              <div className="h-1 w-20 bg-cyan-500 rounded-full" />
            </div>
            <button className="hidden md:flex items-center gap-2 text-cyan-400 font-bold text-sm hover:underline">
              VIEW CALENDAR <ArrowRight size={16} />
            </button>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-[2.5rem] overflow-hidden bg-[#0b1320]/40 border border-white/5 p-8 shadow-2xl"
          >
            <ScheduleSlider />
          </motion.div>
        </div>
      </section>

      {/* --- BENTO INFO GRID (The Premium Touch) --- */}
      <section className="w-full py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Your Theaters Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-10 rounded-[2.5rem] bg-linear-to-br from-zinc-900 to-black border border-white/5 group transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:bg-cyan-500 transition-colors">
              <Clock className="text-cyan-400 group-hover:text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Your Theaters</h3>
            <p className="text-zinc-500 font-light leading-relaxed mb-6">
              All watch parties you host or joined—organized, synced, and ready for launch.
            </p>
            <div className="flex -space-x-3">
               {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-800" />)}
               <div className="text-xs text-zinc-500 flex items-center ml-5">+12 Active</div>
            </div>
          </motion.div>

          {/* Squad Nights Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-10 rounded-[2.5rem] bg-linear-to-br from-zinc-900 to-black border border-white/5 group transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
              <Users className="text-purple-400 group-hover:text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Squad Nights</h3>
            <p className="text-zinc-500 font-light leading-relaxed mb-6">
              Exclusive screenings planned by your inner circle. Notifications sent automatically.
            </p>
            <button className="flex items-center gap-2 text-sm font-bold text-purple-400 group-hover:underline">
              SET REMINDERS <Bell size={14} />
            </button>
          </motion.div>

          {/* Watch History Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-10 rounded-[2.5rem] bg-linear-to-br from-zinc-900 to-black border border-white/5 group transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
              <History className="text-amber-400 group-hover:text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Watch History</h3>
            <p className="text-zinc-500 font-light leading-relaxed mb-6">
              Revisit the moments you watched together. Sync back into any previous room.
            </p>
            <div className="text-xs font-mono text-zinc-600 bg-white/5 p-2 rounded-lg inline-block">
               LAST: Interstellar (Director's Cut)
            </div>
          </motion.div>

        </div>
      </section>

      <footer className="py-12 text-center text-zinc-600 border-t border-white/5">
        &copy; 2026 BOND_PLEX • All systems synchronized.
      </footer>
    </div>
  );
}