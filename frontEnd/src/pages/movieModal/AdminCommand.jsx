import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, UploadCloud, ShieldCheck, Activity, ChevronRight, Zap } from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function AdminCommand() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6 select-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                
                {/* --- ACCESS POINT: MOVIE ARCHIVE --- */}
                <CommandTile 
                    title="Archive_Registry"
                    subtitle="Database Management"
                    description="Access full movie directory, edit metadata, and manage active deployments."
                    icon={<Database size={24} />}
                    count="42 Assets"
                    color="cyan"
                    onClick={() => navigate('/shows-list')}
                />

                {/* --- ACCESS POINT: UPLOAD MODULE --- */}
                <CommandTile 
                    title="Initialize_Upload"
                    subtitle="Asset Deployment"
                    description="Securely upload new cinematic assets to the Cloudinary / CiNEPLeX relay."
                    icon={<UploadCloud size={24} />}
                    count="Ready"
                    color="indigo"
                    onClick={() => navigate('/upload-movie')}
                />

            </div>
        </div>
    );
}

function CommandTile({ title, subtitle, description, icon, count, color, onClick }) {
    const isCyan = color === 'cyan';
    
    return (
        <motion.div 
            onClick={onClick}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative cursor-pointer"
        >
            {/* --- GLOW BACKDROP --- */}
            <div className={`absolute inset-0 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${isCyan ? 'bg-cyan-500' : 'bg-indigo-500'}`} />

            {/* --- MAIN CARD --- */}
            <div className="relative h-full bg-zinc-950/40 backdrop-blur-3xl border border-white/5 group-hover:border-white/20 rounded-[2.5rem] p-10 overflow-hidden transition-all duration-500">
                
                {/* TACTICAL GRID OVERLAY (Internal) */}
                <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                {/* TOP ROW: ICON & STATUS */}
                <div className="flex justify-between items-start mb-12">
                    <div className={`p-4 rounded-2xl ${isCyan ? 'bg-cyan-500/10 text-cyan-400' : 'bg-indigo-500/10 text-indigo-400'} border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                        {icon}
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isCyan ? 'bg-cyan-500' : 'bg-indigo-500'}`} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">System_Live</span>
                        </div>
                        <span className="text-xs font-mono text-zinc-700 tracking-tighter">V4.02 // CPX</span>
                    </div>
                </div>

                {/* MIDDLE ROW: TEXT */}
                <div className="space-y-4 relative z-10">
                    <div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-1 ${isCyan ? 'text-cyan-500/60' : 'text-indigo-500/60'}`}>
                            {subtitle}
                        </p>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white group-hover:italic transition-all">
                            {title.split('_')[0]}_<span className={isCyan ? 'text-cyan-500' : 'text-indigo-500'}>{title.split('_')[1]}</span>
                        </h2>
                    </div>
                    <p className="text-sm text-zinc-500 font-light leading-relaxed max-w-[280px]">
                        {description}
                    </p>
                </div>

                {/* BOTTOM ROW: STATS & ACTION */}
                <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Clearance</span>
                            <span className="text-xs font-bold text-zinc-300">ADMIN_LVEL_0</span>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Status</span>
                            <span className={`text-xs font-bold ${isCyan ? 'text-cyan-400' : 'text-indigo-400'}`}>{count}</span>
                        </div>
                    </div>
                    
                    <div className={`p-3 rounded-full border border-white/10 group-hover:border-white/40 transition-all ${isCyan ? 'group-hover:text-cyan-400' : 'group-hover:text-indigo-400'}`}>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                {/* INTERACTIVE SCANNER (Hover effect) */}
                <div className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-700 ease-in-out group-hover:w-full ${isCyan ? 'bg-cyan-500' : 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]'}`} />
            </div>
        </motion.div>
    );
}