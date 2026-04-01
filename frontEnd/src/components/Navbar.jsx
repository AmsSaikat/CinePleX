import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Clapperboard, Calendar, Users, Home, ChevronRight, Star } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const {user}=useSelector(state=>state.auth)

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
        ? 'h-20 bg-[#020617]/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl' 
        : 'h-24 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6 md:px-10">
        
        {/* --- LOGO --- */}
        <div className="relative flex items-center cursor-pointer group" onClick={() => navigate('/')}>
          <div className="absolute -inset-4 bg-cyan-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <h2 className="relative text-2xl font-black tracking-tighter text-white transition-transform group-hover:scale-105">
            BOND<span className="text-cyan-500 italic">_PLEX</span>
          </h2>
        </div>

        {/* --- DESKTOP CONTENT --- */}
        <div className="hidden md:flex items-center gap-4">
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

          <button 
            onClick={() => navigate('/squad')}
            className="group relative px-6 py-2.5 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden transition-all hover:border-cyan-500/50"
          >
            <span className="relative z-10 text-[11px] font-black text-cyan-400 tracking-tighter flex items-center gap-2">
              <Users size={14} /> #TheSQUAD
            </span>
          </button>

          {/* --- PROFILE AVATAR WITH PREVIEW --- */}
          <div 
            className="relative"
            onMouseEnter={() => setIsProfileHovered(true)}
            onMouseLeave={() => setIsProfileHovered(false)}
          >
            <div 
              onClick={() => navigate('/profile')} 
              className="relative cursor-pointer group ml-2"
            >
              <div className="absolute -inset-1 bg-linear-to-tr from-cyan-500 to-blue-600 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-cyan-500 transition-colors">
                <img 
                  src={user.avatar} 
                  className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  alt="Profile"
                />
              </div>
            </div>

            {/* PREVIEW CARD */}
            <AnimatePresence>
              {isProfileHovered && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-72 bg-[#0b1220]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                  {/* Decorative Gradient Background */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-cyan-500 to-blue-600" />
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                      <Star size={24} fill="currentColor" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-sm tracking-tight">{user.name}</h4>
                      <p className="text-[10px] font-bold text-cyan-500 tracking-[0.2em] uppercase">Elite Member</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>Squad Points</span>
                      <span className="text-white">2.4K XP</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '70%' }}
                        className="h-full bg-cyan-500" 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/profile')}
                    className="w-full py-3 bg-white/5 hover:bg-white text-white hover:text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    View Dossier <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button className="md:hidden p-3 bg-white/5 rounded-xl text-cyan-500" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-90 bg-[#020617] p-10 flex flex-col pt-32 gap-6 md:hidden"
          >
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                onClick={() => { navigate(link.path); setMobileOpen(false); }}
                className="text-5xl font-black italic tracking-tighter text-zinc-800 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                {link.name.toUpperCase()}
              </div>
            ))}
            <div 
              onClick={() => { navigate('/profile'); setMobileOpen(false); }}
              className="text-5xl font-black italic tracking-tighter text-zinc-800 hover:text-white transition-colors cursor-pointer"
            >
              PROFILE
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}