import React from 'react';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate()
  const {user}=useSelector((state)=>state.auth)
  const [firstname,...rest]=user.name.split(" ")
  const lastName=rest.join(" ")
  
  return (
    <div className="min-h-screen w-full bg-[#020617] pt-5 text-[#e0e0e0] font-light selection:bg-indigo-500/40">
      {/* Background Texture & Ambient Glow */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('[https://www.transparenttextures.com/patterns/stardust.png]')]"></div>
      <div className="fixed top-[-20%] right-[-10%] w-150 h-150 bg-indigo-900/20 blur-[150px] rounded-full"></div>
      
      <Navbar />

      <div className="max-w-350 mx-auto px-8 pt-20 pb-32">
        
        {/* --- HERO SECTION --- */}
        <section className="relative flex flex-col md:flex-row items-start justify-between gap-12 border-b border-white/5 pb-20">
          
          <div className="relative group">
            {/* The "Aesthetic" Portrait */}
            <div className="relative w-64 h-80 overflow-hidden rounded-4xl transition-all duration-700 group-hover:rounded-lg shadow-2xl">
              <img 
                src={user.avatar}
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                alt="Profile"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 bg-white text-black px-6 py-2 rounded-full font-bold text-[10px] tracking-[0.2em] uppercase shadow-xl">
              Verified_Member
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter leading-[0.8] opacity-10 absolute -top-10 left-40 select-none pointer-events-none">
              BOND
            </h1>
            <div className="relative z-10">
              <h2 className="text-6xl font-extralight tracking-tight mb-4 text-white">{firstname} <span className="font-black italic">{lastName}.</span></h2>
              <p className="max-w-md text-gray-400 text-lg leading-relaxed font-serif italic">
                {user.bio}
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={()=>navigate('/update-profile')} className="px-8 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-white border border-white transition-all duration-500">
                Edit Persona
              </button>
              <button className="px-8 py-3 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                Settings
              </button>
            </div>
          </div>
        </section>

        {/* --- THE MASONRY STATS --- */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-0 border-b border-white/5">
          <StatBox label="Curated Theaters" value="012" />
          <StatBox label="Collective Points" value="2.4K" />
          <StatBox label="Cinephile Rank" value="Elite" />
          <StatBox label="Active Since" value="2025" />
        </section>

        {/* --- THE EDITORIAL FEED --- */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8">
            <h3 className="text-[10px] font-bold tracking-[0.5em] uppercase text-indigo-500 mb-12">Recently Witnessed</h3>
            
            <div className="space-y-24">
              <FilmCard 
                title="BLADE RUNNER 2049" 
                director="DENIS VILLENEUVE" 
                year="2017" 
                img="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop"
              />
              <FilmCard 
                title="THE GODFATHER" 
                director="FRANCIS FORD COPPOLA" 
                year="1972" 
                img="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop"
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-12">
             <div className="sticky top-32">
                <h3 className="text-[10px] font-bold tracking-[0.5em] uppercase text-indigo-500 mb-8">The Squad</h3>
                <div className="space-y-6">
                  {['Felix', 'Vesper', 'M', 'Q'].map((name, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-white/5 pb-4">
                      <span className="text-xl font-light group-hover:pl-4 transition-all duration-500">{name}</span>
                      <span className="text-[10px] text-gray-500 group-hover:text-indigo-500">VIEW DOSSIER</span>
                    </div>
                  ))}
                </div>
                <div className="mt-12 p-8 bg-indigo-600/5 rounded-4xl border border-indigo-500/10 backdrop-blur-3xl text-center">
                  <p className="text-xs tracking-widest text-indigo-400 font-bold uppercase mb-4">New Recruitment</p>
                  <button className="text-3xl font-thin hover:scale-110 transition-transform">+</button>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* AESTHETIC HELPERS */

function StatBox({ label, value }) {
  return (
    <div className="p-10 border-r border-white/5 last:border-r-0 hover:bg-white/2 transition-colors group">
      <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 mb-2 group-hover:text-indigo-400 transition-colors">{label}</p>
      <p className="text-4xl font-light tracking-tighter">{value}</p>
    </div>
  );
}

function FilmCard({ title, director, year, img }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative w-full h-125 overflow-hidden rounded-xl mb-6">
        <img 
          src={img} 
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
          alt={title} 
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-700"></div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-4xl font-black tracking-tighter italic uppercase leading-none group-hover:text-indigo-500 transition-colors">{title}</h4>
          <p className="text-xs tracking-[0.3em] text-gray-500 mt-2">{director} — {year}</p>
        </div>
        <div className="h-12 w-12 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
           <span className="text-xl">→</span>
        </div>
      </div>
    </div>
  );
}