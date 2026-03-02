import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Clapperboard, Calendar, Users, Home } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={16} /> },
    { name: 'Movies', path: '/movies', icon: <Clapperboard size={16} /> },
    { name: 'Theaters', path: '/theater', icon: <Zap size={16} /> },
    { name: 'Schedule', path: '/schedule', icon: <Calendar size={16} /> },
  ];

  return (
    <nav className={`fixed top-0 z-100 w-full transition-all duration-500 ${
      isScrolled 
        ? 'h-20 bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
        : 'h-24 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6 md:px-10">
        
        {/* --- LOGO SECTION --- */}
        <div 
          className="relative flex items-center cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <div className="absolute -inset-4 bg-cyan-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <h2 className="relative text-2xl font-black tracking-tighter text-white transition-transform group-hover:scale-105 group-active:scale-95">
            BOND<span className="text-cyan-500 italic">_PLEX</span>
          </h2>
        </div>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden md:flex items-center gap-2">
          <ul className="flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li 
                  key={link.name}
                  onClick={() => navigate(link.path)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer text-[11px] font-black uppercase tracking-widest transition-all
                    ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'}
                  `}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-glow"
                      className="absolute inset-0 bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {link.icon} {link.name}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="h-8 w-px bg-white/10 mx-4" />

          {/* SQUAD BUTTON */}
          <button 
            onClick={() => navigate('/squad')}
            className="group relative px-6 py-2.5 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden transition-all hover:border-cyan-500/50"
          >
            <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 text-[11px] font-black text-cyan-400 tracking-tighter flex items-center gap-2">
              <Users size={14} /> #TheSQUAD
            </span>
          </button>
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button 
          className="md:hidden p-3 bg-white/5 rounded-xl border border-white/10 text-cyan-500"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-90 bg-[#020617] p-10 flex flex-col pt-32 gap-8 md:hidden"
          >
             {navLinks.map((link) => (
               <div 
                key={link.name}
                onClick={() => { navigate(link.path); setMobileOpen(false); }}
                className="text-4xl font-black italic tracking-tighter text-zinc-600 hover:text-cyan-400 transition-colors"
               >
                 {link.name.toUpperCase()}
               </div>
             ))}
             <button 
              onClick={() => { navigate('/squad'); setMobileOpen(false); }}
              className="mt-10 py-5 bg-cyan-500 text-black font-black rounded-2xl italic text-2xl tracking-tighter"
             >
               #THE_SQUAD
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}