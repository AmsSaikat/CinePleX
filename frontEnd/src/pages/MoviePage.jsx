import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Star, Clock, Globe, ChevronRight, Info, Shield } from "lucide-react";
import Navbar from "../components/Navbar";

export default function MoviePage() {
  const [activeCategory, setActiveCategory] = useState("Trending");

  const featuredMovie = {
    title: "Oppenheimer",
    year: "2023",
    rating: "8.9",
    duration: "3h 01m",
    quality: "4K Ultra HD",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    tags: ["Biographical", "Drama", "History"],
    bgImage: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070&auto=format&fit=crop"
  };

  const movieLibrary = [
    { id: 1, title: "Inception", img: "https://picsum.photos/seed/incp/400/600", score: "8.8" },
    { id: 2, title: "The Batman", img: "https://picsum.photos/seed/btm/400/600", score: "7.9" },
    { id: 3, title: "Spider-Man", img: "https://picsum.photos/seed/spd/400/600", score: "8.3" },
    { id: 4, title: "Interstellar", img: "https://picsum.photos/seed/int/400/600", score: "8.7" },
    { id: 5, title: "Tenet", img: "https://picsum.photos/seed/ten/400/600", score: "7.4" },
    { id: 6, title: "The Joker", img: "https://picsum.photos/seed/jok/400/600", score: "8.4" },
  ];

  const categories = ["Trending", "Action", "Sci-Fi", "Squad Favorites", "History"];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      <Navbar />

      {/* --- HERO SECTION: FEATURED MOVIE --- */}
      <section className="relative w-full h-[90vh] flex items-center px-6 md:px-16 overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0">
          <img 
            src={featuredMovie.bgImage} 
            className="w-full h-full object-cover scale-110 blur-[2px]" 
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#020617] via-[#020617]/60 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 max-w-3xl space-y-6"
        >
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-cyan-500 text-black text-[10px] font-black rounded-md uppercase tracking-widest">Featured</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={16} fill="currentColor" />
              <span className="text-sm font-bold">{featuredMovie.rating} IMDb</span>
            </div>
          </div>

          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter leading-none uppercase drop-shadow-2xl">
            {featuredMovie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-zinc-400 font-medium">
            <span className="flex items-center gap-1"><Clock size={16}/> {featuredMovie.duration}</span>
            <span className="flex items-center gap-1"><Globe size={16}/> {featuredMovie.year}</span>
            <span className="px-2 py-0.5 border border-zinc-700 rounded text-xs">{featuredMovie.quality}</span>
          </div>

          <p className="text-lg text-zinc-300 max-w-xl leading-relaxed font-light italic">
            "{featuredMovie.description}"
          </p>

          <div className="flex items-center gap-4 pt-4">
            <button className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <Play size={20} fill="black" /> START THEATER
            </button>
            <button className="p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/20 transition-all">
              <Plus size={24} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* --- BROWSE SECTION --- */}
      <section className="relative z-20 -mt-20 px-6 md:px-16 pb-20">
        
        {/* Category Pills */}
        <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border
                ${activeCategory === cat 
                  ? "bg-cyan-500 border-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]" 
                  : "bg-zinc-900 border-white/5 text-zinc-500 hover:border-zinc-700"}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Movie Grid */}
        <div className="space-y-12">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Continue <span className="text-cyan-500">Watching</span></h2>
            <button className="flex items-center gap-1 text-zinc-500 hover:text-white text-xs font-bold tracking-widest transition-colors uppercase">
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {movieLibrary.map((movie, idx) => (
              <motion.div 
                key={movie.id}
                whileHover={{ y: -10 }}
                className="group relative cursor-pointer"
              >
                {/* Poster Image */}
                <div className="aspect-2/3 rounded-4xl overflow-hidden border border-white/5 relative shadow-xl">
                  <img src={movie.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={movie.title} />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mb-3">
                      <Play size={20} fill="black" className="ml-1" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Join Room</span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4 px-2">
                  <h3 className="font-bold text-sm truncate uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{movie.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Star size={12} className="text-amber-500" fill="currentColor" />
                    <span className="text-[10px] font-mono text-zinc-500">{movie.score}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tactical Info Section */}
        <div className="mt-32 p-12 bg-linear-to-br from-zinc-900/50 to-black/50 border border-white/5 rounded-[3rem] flex flex-col md:flex-row items-center gap-12">
           <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center border border-cyan-500/20 shrink-0">
              <Shield className="text-cyan-400" size={40} />
           </div>
           <div className="space-y-2">
              <h3 className="text-2xl font-black italic tracking-tighter uppercase">Squad Protection Enabled</h3>
              <p className="text-zinc-500 font-light max-w-2xl leading-relaxed">
                All streams are synchronized via our <strong>BOND_PLEX Quantum Link</strong>. 
                Host migrations are seamless, and your chat logs are encrypted. Watch with the squad, worry-free.
              </p>
           </div>
           <button className="md:ml-auto px-8 py-4 bg-zinc-800 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Room Settings
           </button>
        </div>
      </section>
    </div>
  );
}