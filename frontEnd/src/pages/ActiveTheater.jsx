import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Share2, Users, Activity, 
  Settings, Upload, Info, Radio 
} from "lucide-react";
import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import UploadMovieModal from "../pages/movieModal/UploadMovieModal";
import TheaterPlayer from "../components/TheaterPlayer";
import { useDispatch, useSelector } from "react-redux";
import { setTheater } from "../redux/slices/theaterSlice";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminModeratorPanel from "../components/AdminModeratorPannel";
import TheaterShowtimes from "./movieModal/TheaterShowTimes";
import UploadMoviePage from "./movieModal/UploadMoviePage";
import AdminCommand from "./movieModal/AdminCommand";

const DEMO_HLS = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

export default function ActiveTheater() {
  const [showUpload, setShowUpload] = useState(false);
  const [movieLoaded, setMovieLoaded] = useState(false);
  const [movieUrl, setMovieUrl] = useState(null);
  const [waitingUser, setWaitingUser] = useState(null);
  const { code } = useParams();
  const dispatch = useDispatch();

  const {theater} = useSelector((state)=>state.theater)
  const {user}=useSelector((state)=>state.auth)
  console.log("Theater:", theater)
  console.log("User:", user)

  useEffect(() => {
    const fetchTheater = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}theater/get-theater/code/${code}`,
          { withCredentials: true }
        );

        dispatch(setTheater(res.data.data));
      } catch (error) {
        console.log("Failed to fetch theater",error.response?.data || error.message);
      }
    };

    if (code) fetchTheater();
  }, [code, dispatch]);


  const handleMovieUploaded = (url) => {
    setMovieUrl(url);
    setMovieLoaded(true);
    setShowUpload(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      <Navbar />

      <main className="max-w-450 mx-auto px-6 pt-24 pb-10">
        
        {/* --- THEATER HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                <Radio size={12} /> Live Theater
              </span>
              <span className="text-zinc-600 text-xs font-mono uppercase tracking-tighter">Room ID: {theater?.code}</span>
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              {movieLoaded ? "Interstellar (2014)" : "Waiting for Broadcast..."}
            </h1>
            <p className="text-zinc-500 text-sm flex items-center gap-2 font-light">
              Secured by <span className="text-cyan-400 font-bold uppercase tracking-widest text-xs">Host: {theater?.owner?.name} </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-black rounded-2xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Upload size={18} /> UPLOAD CORE
            </button>
            <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
              <Share2 size={20} className="text-zinc-400" />
            </button>
          </div>
        </div>

        {/* --- PRIMARY GRID --- */}
        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Player & Interaction (Column 8) */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* CINEMATIC PLAYER CONTAINER */}
            <div className="relative aspect-video rounded-[2.5rem] bg-black border border-white/5 overflow-hidden shadow-2xl group">
               {!movieLoaded ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_center,#111827_0%,#020617_100%)]">
                  <div className="w-20 h-20 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                  <span className="text-zinc-500 font-black tracking-[0.3em] text-xs uppercase italic">Awaiting Media Feed...</span>
                </div>
              ) : (
                <TheaterPlayer 
                  src={movieUrl || DEMO_HLS} 
                  onBufferStart={() => setWaitingUser("A viewer")}
                  onBufferEnd={() => setWaitingUser(null)}
                />
              )}
              <AdminModeratorPanel theater={theater} user={user} />
              
              {/* Buffer Warning HUD */}
              <AnimatePresence>
                {waitingUser && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-10 left-10 z-50 px-4 py-2 bg-amber-500/20 border border-amber-500/50 backdrop-blur-xl rounded-xl flex items-center gap-3"
                  >
                    <Activity size={16} className="text-amber-500 animate-pulse" />
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Syncing: {waitingUser} is buffering...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* REACTION BAR */}
            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-4xl backdrop-blur-md">
                <div className="flex items-center gap-6">
                   <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Quick React</h4>
                   <div className="flex gap-4 text-2xl">
                     {["😂", "🔥", "💀", "❤️", "😮", "👏"].map(emoji => (
                       <button key={emoji} className="hover:scale-150 active:scale-90 transition-transform duration-300 filter grayscale hover:grayscale-0">
                         {emoji}
                       </button>
                     ))}
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <Users size={16} className="text-cyan-500" />
                   <span className="text-xs font-mono text-zinc-400">{theater?.audience?.length || 0} Connected</span>
                </div>
            </div>
          </div>

          {/* RIGHT: Chat & Squad Data (Column 4) */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            
            {/* CHAT HUB */}
            <div className="rounded-[2.5rem] bg-zinc-900/30 border border-white/5 p-2 h-125 flex flex-col shadow-xl">
              <ChatBox />
            </div>

            {/* TACTICAL INFO HUD */}
            <div className="rounded-[2.5rem] bg-linear-to-br from-zinc-900/80 to-[#020617] border border-white/10 p-8 space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">System Metrics</h3>
                 <Settings size={16} className="text-zinc-600 cursor-pointer hover:rotate-90 transition-transform" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <MetricBox label="Sync Status" value="Locked" color="text-green-400" icon={<Shield size={12}/>}/>
                <MetricBox label="Latency" value="14ms" color="text-cyan-400" icon={<Activity size={12}/>}/>
                <MetricBox label="Privacy" value="Squad-Only" color="text-purple-400" icon={<Users size={12}/>}/>
                <MetricBox label="Quality" value="Auto-4K" color="text-amber-400" icon={<Info size={12}/>}/>
              </div>

              {/* WATCHERS MINI-LIST */}
              <div className="pt-4 space-y-3 border-t border-white/5">
                 {[theater?.owner, ...(theater?.moderators || [])].map((user) => (
                   <div key={user?._id} className="flex items-center gap-3 group">
                     <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[10px] font-black text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                       {user?.name?.charAt(0) || "?"}
                     </div>
                     <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">
                        {user === theater?.owner ? "Owner" : "Moderator"} {user?.name}
                     </span>
                     <div className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
                   </div>
                  ))}
              </div>
            </div>

          </div>
        </div>

        <div>
              <AdminCommand />
        </div>
      </main>

      <UploadMovieModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={handleMovieUploaded}
      />
    </div>
  );
}

// Helper Mini-Component
function MetricBox({ label, value, color, icon }) {
  return (
    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
      <div className="flex items-center gap-1.5 text-zinc-600">
        {icon} <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className={`text-sm font-mono font-bold ${color}`}>{value}</div>
    </div>
  );
}