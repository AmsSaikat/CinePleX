import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
    AreaChart, Area, XAxis, Tooltip 
} from 'recharts';
import { Activity, Clock, Target, Zap, ChevronRight, ArrowLeft } from 'lucide-react';

// --- DATA MOCK ---
const squadMissionData = [
    { day: 'MON', hours: 12 }, { day: 'TUE', hours: 18 }, { day: 'WED', hours: 15 },
    { day: 'THU', hours: 25 }, { day: 'FRI', hours: 32 }, { day: 'SAT', hours: 45 }, { day: 'SUN', hours: 30 },
];

const squadAffinity = [
    { subject: 'NOIR', A: 120 }, { subject: 'ACTION', A: 98 },
    { subject: 'SCI-FI', A: 150 }, { subject: 'THRILLER', A: 110 }, { subject: 'INTEL', A: 90 },
];

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

export default function SquadIntel() {
    const navigate = useNavigate();
    const stardust = "url('https://www.transparenttextures.com/patterns/stardust.png')";

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full min-h-screen bg-[#030303] text-zinc-100 font-light selection:bg-cyan-500/50 p-8"
        >
            {/* --- GRAIN OVERLAY --- */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: stardust }} />

            <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8 relative z-10">
                
                {/* --- HEADER BLOCK --- */}
                <motion.div variants={itemVariants} className="col-span-12 mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-[1px] w-20 bg-gradient-to-r from-cyan-500 to-transparent" />
                        <span className="text-[10px] font-black tracking-[0.6em] text-cyan-500 uppercase">Squad Operations</span>
                    </div>
                    <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none">
                        The_SQUAD.<span className="text-cyan-500 opacity-50 font-light">INTEL</span>
                    </h1>

                    {/* --- BACK BUTTON INTEGRATED --- */}
                    <button
                        onClick={() => navigate('/squad')}
                        className="group relative flex items-center gap-4 mt-8 px-0 py-2 bg-transparent text-white overflow-hidden transition-all duration-500"
                    >
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-white/10 group-hover:border-cyan-500 transition-colors duration-500">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-500 text-zinc-500 group-hover:text-cyan-400" />
                            <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 rounded-full transition-all duration-500" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 group-hover:text-cyan-500 transition-colors duration-500">
                                Navigation
                            </span>
                            <span className="text-[18px] font-light uppercase tracking-[0.1em] italic text-zinc-300 group-hover:text-white transition-all">
                                Back to <span className="font-black not-italic text-cyan-500">SQUAD</span>
                            </span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-cyan-500 to-transparent group-hover:w-full transition-all duration-700 ease-in-out" />
                    </button>
                </motion.div>

                {/* --- SQUAD STATUS METRICS --- */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <StatCard icon={<Activity size={20}/>} label="Squad Pulse" value="ACTIVE" detail="12 Agents Online" />
                    <StatCard icon={<Clock size={20}/>} label="Total Field Time" value="1.2k HRS" detail="Cumulative SQUAD watching" />
                    <StatCard icon={<Target size={20}/>} label="Sync Rate" value="98.4%" detail="Ghost Screening Stability" />
                </div>

                {/* --- MISSION ACTIVITY CHART --- */}
                <motion.div 
                    variants={itemVariants}
                    className="col-span-12 lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors duration-700"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Zap size={120} className="text-cyan-400" />
                    </div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase mb-10">Aggregated Engagement Feed</p>
                    
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={squadMissionData}>
                                <defs>
                                    <linearGradient id="squadArea" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" stroke="#27272a" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#52525b'}} />
                                <Tooltip 
                                    cursor={{ stroke: '#06b6d4', strokeWidth: 1 }}
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #111', borderRadius: '12px', fontSize: '10px', textTransform: 'uppercase' }}
                                />
                                <Area type="step" dataKey="hours" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#squadArea)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* --- NEURAL MAPPING --- */}
                <motion.div 
                    variants={itemVariants}
                    className="col-span-12 lg:col-span-5 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl"
                >
                    <p className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase mb-10">Neural Genre Synergy</p>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={squadAffinity}>
                                <PolarGrid stroke="#18181b" />
                                <PolarAngleAxis dataKey="subject" stroke="#52525b" fontSize={10} />
                                <Radar
                                    name="SQUAD"
                                    dataKey="A"
                                    stroke="#06b6d4"
                                    fill="#06b6d4"
                                    fillOpacity={0.3}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* --- ACTIVE CLEARANCE --- */}
                <motion.div variants={itemVariants} className="col-span-12 lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-zinc-400">Tactical Clearance Log</h3>
                        <div className="flex gap-2">
                            <div className="w-1 h-1 rounded-full bg-cyan-500 animate-ping" />
                            <div className="w-1 h-1 rounded-full bg-cyan-500" />
                        </div>
                    </div>
                    
                    <ClearanceItem name="AGENT_BOND" role="LEAD COMMAND" status="VERIFIED" />
                    <ClearanceItem name="VESPER_INTEL" role="DATA ANALYST" status="VERIFIED" />
                    <ClearanceItem name="QUARTZ_TECH" role="ENCRYPTION" status="SECURED" />
                    <ClearanceItem name="UNKNOWN_ENTITY" role="UNAUTHORIZED" status="REJECTED" danger />
                </motion.div>
            </div>
        </motion.div>
    );
}

function StatCard({ icon, label, value, detail }) {
    return (
        <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, borderColor: 'rgba(6, 182, 212, 0.4)' }}
            className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center gap-8 transition-all duration-500"
        >
            <div className="p-5 bg-cyan-500 text-black rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-1">{label}</p>
                <h4 className="text-3xl font-black italic tracking-tighter text-white uppercase">{value}</h4>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{detail}</p>
            </div>
        </motion.div>
    );
}

function ClearanceItem({ name, role, status, danger }) {
    return (
        <div className="flex items-center justify-between p-6 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all group cursor-pointer">
            <div className="flex items-center gap-5">
                <div className={`w-1 h-10 ${danger ? 'bg-red-500' : 'bg-cyan-500'} transition-all group-hover:h-12`} />
                <div>
                    <p className="text-lg font-black tracking-tighter text-zinc-300 group-hover:text-white transition-colors uppercase italic">{name}</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{role}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className={`text-[9px] font-black tracking-[0.2em] uppercase ${danger ? 'text-red-500' : 'text-cyan-500'}`}>
                    {status}
                </span>
                <ChevronRight size={14} className="text-zinc-800 group-hover:text-cyan-500 transition-colors" />
            </div>
        </div>
    );
}