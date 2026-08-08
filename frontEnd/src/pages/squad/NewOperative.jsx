import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Shield, Zap, Target, UserCheck, ArrowLeft, Radio, Lock, Hash,  User,  AlertCircle,  Loader2,  CheckCircle2 } from "lucide-react";
import Navbar from "../../components/Navbar";

export default function NewOperative() {
  const navigate = useNavigate();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState("name"); // "name" or "uid"
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOperative, setSelectedOperative] = useState(null);
  const [searchError, setSearchError] = useState("");

  // Commissioning state
  const [isCommissioning, setIsCommissioning] = useState(false);
  const [commissionSuccess, setCommissionSuccess] = useState(false);

  // Debounce search input & query backend via POST using Axios
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError("");
      return;
    }

    setIsSearching(true);
    setSearchError("");

    // Create AbortController to cancel pending Axios requests during rapid typing
    const controller = new AbortController();

    const handler = setTimeout(async () => {
      try {
        const response = await axios.post(
          import.meta.env.VITE_API_URL + "squad/search-operatives",
          {
            query: searchQuery.trim(),
            searchType: searchMode // "name" or "uid"
          },
          {
            signal: controller.signal,
            withCredentials : true
          },
        );

        setSearchResults(response.data.operatives || []);
      } catch (error) {
        // Ignore errors caused by aborted requests
        if (!axios.isCancel(error)) {
          console.error("Error querying operative backend:", error);
          const message = error.response?.data?.message || "Network error while searching.";
          setSearchError(message);
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [searchQuery, searchMode]);

  // Handle final assignment to squad using Axios
  const handleCommission = async () => {
    if (!selectedOperative) return;
    setIsCommissioning(true);

    try {
      await axios.post(import.meta.env.VITE_API_URL + "squad/add", {
        uid: selectedOperative.uid
      },{withCredentials : true});

      setIsCommissioning(false);
      setCommissionSuccess(true);
      
      setTimeout(() => {
        navigate("/squad");
      }, 1200);
    } catch (err) {
      console.error("Commissioning error:", err);
      setIsCommissioning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden selection:bg-cyan-500/30">
      <Navbar />

      {/* --- TACTICAL BACKGROUND GRID OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20">
        
        {/* --- TOP BACK BUTTON --- */}
        <button
          onClick={() => navigate('/squad')}
          className="group relative flex items-center gap-4 mt-8 px-0 py-2 bg-transparent text-white overflow-hidden transition-all duration-500 cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-white/10 group-hover:border-cyan-500 transition-colors duration-500">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-500 text-zinc-500 group-hover:text-cyan-400" />
            <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 rounded-full transition-all duration-500" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 group-hover:text-cyan-500 transition-colors duration-500">
              Navigation
            </span>
            <span className="text-[18px] font-light uppercase tracking-widest italic text-zinc-300 group-hover:text-white transition-all">
              Back to <span className="font-black not-italic">Squad</span>
            </span>
          </div>
          <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-cyan-500 to-transparent group-hover:w-full transition-all duration-700 ease-in-out" />
        </button>

        {/* --- PAGE HEADER --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black tracking-[0.3em] uppercase">
            <Radio size={14} className="animate-pulse" /> Personnel Query Terminal
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none uppercase">
            LOCATE <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">OPERATIVE</span>
          </h1>

          <p className="text-zinc-500 text-sm md:text-base max-w-md mx-auto font-light leading-relaxed">
            Query classified personnel database via <span className="text-cyan-400 font-mono">UID</span> or <span className="text-cyan-400 font-mono">CODENAME</span>.
          </p>
        </motion.div>

        {/* --- SEARCH CONTROLLER CARD --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative bg-zinc-950/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 mb-8 overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          
          {/* SEARCH MODE TOGGLE & QUERY TYPE */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Lock size={14} className="text-cyan-500" />
              <span>DATABASE_SEARCH_PROTOCOL</span>
            </div>

            {/* TOGGLE BUTTONS */}
            <div className="flex p-1 bg-white/[0.03] border border-white/10 rounded-xl text-xs font-mono">
              <button
                type="button"
                onClick={() => setSearchMode("name")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  searchMode === "name" 
                    ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <User size={13} /> BY CODENAME
              </button>
              <button
                type="button"
                onClick={() => setSearchMode("uid")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  searchMode === "uid" 
                    ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Hash size={13} /> BY OPERATIVE UID
              </button>
            </div>
          </div>

          {/* INPUT BAR */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-500">
              {isSearching ? (
                <Loader2 size={18} className="animate-spin text-cyan-500" />
              ) : (
                <Search size={18} className="text-zinc-400" />
              )}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchMode === "uid" ? "Enter Operative UID (e.g. 84920193)..." : "Enter Codename (e.g. Ghost, Viper)..."}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 focus:bg-cyan-500/[0.02] transition-all"
            />
          </div>
        </motion.div>

        {/* --- RESULTS MATRIX & SELECTION AREA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: RESULTS LIST (SPAN 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center px-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              <span>Query Output</span>
              <span>{searchResults.length} Match(es) Found</span>
            </div>

            {/* EMPTY STATE */}
            {!searchQuery.trim() && (
              <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
                <Target size={32} className="mx-auto text-zinc-700 mb-3" />
                <p className="text-xs font-mono text-zinc-500">INPUT CRITERIA TO INITIALIZE SCAN</p>
              </div>
            )}

            {/* NO RESULTS OR ERROR */}
            {searchQuery.trim() && searchResults.length === 0 && !isSearching && (
              <div className="p-12 text-center rounded-3xl border border-white/5 bg-red-500/[0.02]">
                <AlertCircle size={32} className="mx-auto text-red-500/50 mb-3" />
                <p className="text-xs font-mono text-zinc-400">
                  {searchError ? searchError.toUpperCase() : "NO OPERATIVE MATCHES FOUND IN DATABASE"}
                </p>
              </div>
            )}

            {/* RESULTS CARDS */}
            <AnimatePresence>
              {searchResults.map((op) => {
                const isSelected = selectedOperative?.uid === op.uid || selectedOperative?._id === op._id;
                return (
                  <motion.div
                    key={op.uid || op._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setSelectedOperative(op)}
                    className={`group cursor-pointer p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                      isSelected
                        ? "bg-cyan-500/10 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                        : "bg-zinc-950/40 border-white/5 hover:border-white/20 hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* AVATAR */}
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-zinc-900 flex items-center justify-center">
                        {op.photo ? (
                          <img src={op.photo} alt={op.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={24} className="text-zinc-600" />
                        )}
                        <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay" />
                      </div>

                      {/* OPERATIVE DATA */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-cyan-400 font-bold">{op.uid || "N/A"}</span>
                          <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 font-mono">
                            {op.clearance || "LEVEL_1"}
                          </span>
                        </div>
                        <h3 className="text-lg font-black uppercase text-white truncate tracking-wide">
                          {op.name}
                        </h3>
                        <p className="text-xs text-zinc-400 truncate">{op.role || op.email || "Operative"}</p>
                      </div>

                      {/* SELECTION INDICATOR */}
                      <div className="shrink-0">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? "bg-cyan-500 border-cyan-500 text-black" : "border-white/20 text-transparent"
                        }`}>
                          <UserCheck size={14} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* RIGHT: DOSSIER PREVIEW & COMMISSION PANEL (SPAN 5) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  Target Dossier
                </span>
                {selectedOperative && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    STATUS: {selectedOperative.status || "ACTIVE"}
                  </span>
                )}
              </div>

              {selectedOperative ? (
                <div className="space-y-6">
                  {/* FULL PROFILE HEADER */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)] bg-zinc-900 flex items-center justify-center">
                      {selectedOperative.photo ? (
                        <img src={selectedOperative.photo} alt={selectedOperative.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={36} className="text-zinc-600" />
                      )}
                    </div>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{selectedOperative.uid || "N/A"}</span>
                    <h2 className="text-2xl font-black italic uppercase text-white tracking-tight">
                      {selectedOperative.name}
                    </h2>
                    <p className="text-xs text-zinc-400">{selectedOperative.role || selectedOperative.email}</p>
                  </div>

                  {/* SPECS GRID */}
                  <div className="space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 flex items-center gap-1">
                        <Zap size={12} className="text-cyan-500" /> Signature Maneuver
                      </span>
                      <span className="text-zinc-200 font-semibold">{selectedOperative.signatureMove || "Standard Protocol"}</span>
                    </div>
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 flex items-center gap-1">
                        <Shield size={12} className="text-cyan-500" /> Clearance Level
                      </span>
                      <span className="text-zinc-200 font-semibold">{selectedOperative.clearance || "LEVEL_1"}</span>
                    </div>
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Dossier Brief</span>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        {selectedOperative.bio || "No tactical brief recorded for this personnel profile."}
                      </p>
                    </div>
                  </div>

                  {/* COMMISSION ACTION BUTTON */}
                  <button
                    onClick={handleCommission}
                    disabled={isCommissioning || commissionSuccess}
                    className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-900/50 text-black font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 text-xs cursor-pointer"
                  >
                    {isCommissioning ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>RECRUITING_AGENT...</span>
                      </>
                    ) : commissionSuccess ? (
                      <>
                        <CheckCircle2 size={16} />
                        <span>ASSIGNED_TO_SQUAD</span>
                      </>
                    ) : (
                      <>
                        <UserCheck size={16} />
                        <span>COMMISSION TO SQUAD</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <Shield size={36} className="mx-auto text-zinc-800" />
                  <p className="text-xs font-mono text-zinc-600">
                    SELECT AN OPERATIVE FROM THE MATRIX TO REVIEW DOSSIER
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}