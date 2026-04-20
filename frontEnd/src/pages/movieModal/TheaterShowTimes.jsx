import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clapperboard, MapPin, Search, CalendarDays, Ticket, Sparkles, ChevronLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';

// --- DATA MOCK (Sync with your Redux/API later) ---
const theaterData = {
    name: "GRAND_CiNEPLeX",
    location: "MISSION SECTOR 7",
    id: "CPX_G7",
    currentlyShowing: [
        { id: 'M001', title: 'PROJECT_GHOST', poster: 'https://images.unsplash.com/photo-1598897652870-8260751a87e5?q=80&w=600', year: '2026', clearance: 'LVEL_4' },
        { id: 'M002', title: 'SILENT_EXECUTION', poster: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600', year: '2026', clearance: 'LVEL_4' },
        { id: 'M003', title: 'ZERO_DAY_STRIKE', poster: 'https://images.unsplash.com/photo-1587329310686-914152f45280?q=80&w=600', year: '2026', clearance: 'LVEL_3' },
        { id: 'M004', title: 'NEURAL_PURGE', poster: 'https://images.unsplash.com/photo-1592188657297-c6473609e988?q=80&w=600', year: '2025', clearance: 'LVEL_5' },
        { id: 'M005', title: 'BLACK_OUT_PROTOCOL', poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=600', year: '2025', clearance: 'LVEL_3' },
    ]
};

// --- ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
    visible: { 
        y: 0, 
        opacity: 1, 
        filter: 'blur(0px)',
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
};

export default function TheaterShowtimes() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [hoveredMovie, setHoveredMovie] = useState(theaterData.currentlyShowing[0]); // Default to first movie

    const filteredMovies = theaterData.currentlyShowing.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stardust = "url('https://www.transparenttextures.com/patterns/stardust.png')";

    return (
        <div className="min-h-screen w-full bg-[#030303] text-zinc-100 font-light selection:bg-cyan-500/50 overflow-x-hidden">
            
            {/* --- GRAIN OVERLAY --- */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: stardust }} />
            
            <Navbar />

            <main className="relative z-10 max-w-[1500px] mx-auto px-8 pt-32 pb-20 grid grid-cols-12 gap-16">
                
                {/* --- LEFT NAVIGATION & DATA FEED --- */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="col-span-12 lg:col-span-7 space-y-12"
                >
                    {/* Header Block */}
                    <motion.div variants={itemVariants}>
                        <button onClick={() => navigate('/theaters')} className="group flex items-center gap-3 mb-8 text-zinc-600 hover:text-cyan-400 transition-colors">
                            <ChevronLeft size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Back to Theaters</span>
                        </button>
                        
                        <div className="flex items-center gap-4 mb-3 text-cyan-500">
                            <Clapperboard size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">{theaterData.id} Deployment</span>
                        </div>
                        <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none mb-4">{theaterData.name}</h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                            <MapPin size={12} className="text-zinc-800"/> {theaterData.location}
                        </p>
                    </motion.div>

                    {/* Active Surveillance Feed (Search) */}
                    <motion.div variants={itemVariants} className="relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center text-zinc-700 group-hover:text-cyan-500 transition-colors">
                            <Search size={18} />
                        </div>
                        <input 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Initialize asset search_..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl h-16 pl-16 pr-6 focus:outline-none focus:border-cyan-500/50 transition-all text-zinc-300 placeholder:text-zinc-800 uppercase text-xs font-bold tracking-widest"
                        />
                        <div className="absolute top-1/2 right-6 -translate-y-1/2 text-zinc-800 text-[9px] font-mono group-hover:text-cyan-500 transition-colors">CPX_v4.1</div>
                    </motion.div>

                    {/* Active Listing */}
                    <div className="space-y-4">
                        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8 px-6 text-zinc-700 font-bold uppercase tracking-widest text-[10px]">
                            <span>Asset Identifier</span>
                            <div className="flex gap-16 pr-12">
                                <span>Deployment</span>
                                <span>Security</span>
                            </div>
                        </motion.div>
                        
                        {filteredMovies.map((movie) => (
                            <MovieListItem 
                                key={movie.id} 
                                {...movie} 
                                onHover={() => setHoveredMovie(movie)}
                                isActive={hoveredMovie.id === movie.id}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* --- RIGHT: HIGH-RES SURVEILLANCE POSTER --- */}
                <div className="hidden lg:col-span-5 lg:block h-fit sticky top-32">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={hoveredMovie.id} 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full aspect-[2/3] bg-zinc-950 border border-white/5 p-2 rounded-[2.5rem] relative overflow-hidden group shadow-2xl"
                        >
                            {/* Glass overlay */}
                            <div className="absolute inset-2 bg-zinc-950 rounded-[2rem] overflow-hidden z-10 border border-white/5">
                                <img src={hoveredMovie.poster} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Poster" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                
                                {/* Scanning line effect */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent animate-scan z-20" />
                                
                                {/* Bottom Data Block */}
                                <div className="absolute bottom-10 left-10 right-10 z-20 space-y-3">
                                    <h3 className="text-3xl font-black italic text-white leading-none uppercase tracking-tighter shadow-lg">{hoveredMovie.title}</h3>
                                    <div className="flex items-center gap-6">
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-2"><CalendarDays size={12}/> {hoveredMovie.year}</p>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-2"><Ticket size={12}/> CPX Access</p>
                                        <Sparkles size={14} className="text-cyan-500 opacity-50"/>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

function MovieListItem({ title, year, clearance, onHover, isActive }) {
    return (
        <motion.div 
            variants={itemVariants}
            onMouseEnter={onHover}
            whileHover={{ scale: 1.01 }}
            className={`group relative flex items-center justify-between p-7 rounded-2xl border transition-all duration-500 cursor-pointer ${isActive ? 'bg-cyan-500 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-cyan-500/50'}`}
        >
            <div className="flex items-center gap-6">
                <div className={`w-1 h-12 ${isActive ? 'bg-black' : 'bg-zinc-800'}`} />
                <div>
                    <p className={`text-xl font-black tracking-tighter leading-none mb-1 uppercase ${isActive ? 'text-black' : 'text-zinc-200 group-hover:text-cyan-400'}`}>{title}</p>
                    <p className={`text-[10px] uppercase font-bold tracking-widest ${isActive ? 'text-cyan-950' : 'text-zinc-600'}`}>CiNEPLeX Deployment Protocol</p>
                </div>
            </div>

            <div className="flex items-center gap-16 pr-6">
                <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-cyan-950' : 'text-zinc-500'}`}>{year}</span>
                <span className={`text-[9px] font-black tracking-widest px-3 py-1 rounded-sm border ${isActive ? 'border-cyan-950 text-cyan-950' : 'border-cyan-500/20 text-cyan-500'}`}>
                    {clearance}
                </span>
            </div>
        </motion.div>
    );
}