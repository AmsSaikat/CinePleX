import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Send, Users, Clock, Monitor, ChevronRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Slider from '../components/Slider.jsx';

export default function HomePage() {
  const [request, setRequest] = useState("");
  const [status, setStatus] = useState('idle'); // idle | loading | success

  // Premium CRUD: Create Movie Request with Feedback
  const handleRequest = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      setRequest("");
    }, 3000);
  };

  return (
    <div className='bg-[#020408] text-zinc-100 min-h-screen font-sans selection:bg-cyan-500/40 selection:text-white'>
      <Navbar />

      {/* --- CINEMATIC HERO SECTION --- */}
      <section className='relative w-full min-h-[95vh] flex items-center justify-center px-6 overflow-hidden'>
        {/* Dynamic Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(8,20,40,1)_0%,rgba(2,4,8,1)_100%)]" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-175 h-175 bg-cyan-900/20 rounded-full blur-[150px]" 
        />
        
        <div className='relative z-10 max-w-6xl text-center'>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles size={14} className="animate-pulse" /> The Future of Social Cinema
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className='text-7xl md:text-[110px] font-black tracking-tighter leading-[0.85] mb-8 italic'
          >
            BOND<span className='text-cyan-500 text-glow'>_</span>PLEX
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className='text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed mb-12'
          >
            Sync movies. Chat live. <span className="text-white border-b-2 border-cyan-500/50">Experience everything</span> with your inner circle.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className='flex flex-col sm:flex-row justify-center gap-5'
          >
            <button className='group relative px-10 py-5 bg-cyan-500 text-black font-black rounded-2xl transition-all hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2'>
              <Play fill="black" size={20} /> START WATCHING
            </button>
            <button className='px-10 py-5 bg-white/5 border border-white/10 backdrop-blur-xl text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2'>
              BROWSE LIBRARY <ChevronRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* --- STATS: BENTO BOX STYLE --- */}
      <section className='max-w-7xl mx-auto px-6 py-24'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='md:col-span-2 p-10 rounded-4xl bg-linear-to-br from-zinc-900 to-black border border-white/5'>
             <Users className="text-cyan-500 mb-4" size={32} />
             <h3 className="text-4xl font-bold">72k+</h3>
             <p className="text-zinc-500">Global Streamers</p>
          </div>
          <div className='p-10 rounded-4xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm'>
             <Clock className="text-purple-500 mb-4" size={32} />
             <h3 className="text-3xl font-bold italic">2.4h</h3>
             <p className="text-zinc-500">Avg Party</p>
          </div>
          <div className='p-10 rounded-4xl bg-cyan-500 text-black'>
             <Monitor className="mb-4" size={32} />
             <h3 className="text-3xl font-bold tracking-tighter leading-none">ULTRA HD SYNC</h3>
          </div>
        </div>
      </section>

      {/* --- SLIDER: FULL WIDTH PREMIUM --- */}
      <section className='w-full py-24 bg-linear-to-b from-[#020408] to-[#080c14]'>
        <div className="max-w-7xl mx-auto px-6 mb-12 flex items-center justify-between">
            <h2 className='text-5xl font-black italic tracking-tighter'>ELITE FEATURES</h2>
            <div className="h-0.5 flex-1 bg-linear-to-r from-cyan-500/50 to-transparent ml-10" />
        </div>
        <Slider />
      </section>

      {/* --- REQUEST MODAL/INPUT: INTERACTIVE CRUD --- */}
      <section className='w-full py-40 flex justify-center px-6'>
        <div className='relative w-full max-w-4xl p-0.5 rounded-[3rem] bg-linear-to-r from-cyan-500 via-blue-500 to-purple-600 overflow-hidden group'>
          <div className='bg-[#020408] rounded-[2.9rem] p-12 md:p-20 flex flex-col items-center text-center'>
            <h2 className='text-5xl font-black mb-6'>MISSING A TITLE?</h2>
            <p className='text-zinc-400 mb-10 text-lg'>Request any movie or anime. Our automated encoders will have it ready in <span className="text-white font-bold">Record Time</span>.</p>

            <form onSubmit={handleRequest} className='w-full max-w-xl relative'>
              <input
                type='text'
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder='What do you want to watch?'
                className='w-full bg-white/5 border border-white/10 p-6 pr-40 rounded-3xl outline-none focus:border-cyan-500 focus:bg-white/10 transition-all text-xl'
                required
              />
              <button 
                type="submit"
                disabled={status !== 'idle'}
                className='absolute right-2 top-2 bottom-2 px-8 bg-cyan-500 text-black font-black rounded-2xl hover:scale-95 transition-transform disabled:bg-zinc-700'
              >
                {status === 'loading' ? (
                  <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
                ) : status === 'success' ? (
                  <CheckCircle2 size={24} />
                ) : (
                  "SEND REQUEST"
                )}
              </button>
            </form>
            
            <AnimatePresence>
              {status === 'success' && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-cyan-400 font-bold"
                >
                  Request logged! Check your notifications soon.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <style jsx>{`
        .text-glow {
          text-shadow: 0 0 30px rgba(6, 182, 212, 0.6);
        }
      `}</style>
    </div>
  );
}