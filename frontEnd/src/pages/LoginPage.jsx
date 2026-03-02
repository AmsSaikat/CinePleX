import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, Loader2, Fingerprint, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../components/Input";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";

export default function LoginPage() {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "auth/login",
        data,
        { withCredentials: true }
      );

      dispatch(setUser(res.data.user));
      navigate("/");
    } catch (error) {
      setServerError(error.response?.data?.message || "Authentication failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* --- AMBIENT BACKGROUND GLOW --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* TOP INTERFACE HEADER */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center p-5 bg-zinc-900/50 rounded-3xl border border-white/10 mb-6 group overflow-hidden">
            {/* The "Biometric Scan" Laser Line */}
            <motion.div 
              animate={{ top: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-0.5 bg-cyan-500 blur-[2px] z-20"
            />
            <Fingerprint size={48} className="text-cyan-500 group-hover:scale-110 transition-transform duration-500" />
          </div>
          
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
            Access <span className="text-cyan-500">Terminal</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black tracking-[0.3em] uppercase mt-2">
            Verification Required
          </p>
        </div>

        {/* --- MAIN LOGIN CARD --- */}
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[3rem] shadow-2xl relative">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <AnimatePresence>
              {serverError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[11px] font-bold uppercase tracking-wider text-center"
                >
                  {serverError}
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              icon={Mail}
              type="email"
              field="email"
              placeholder="OPERATIVE EMAIL"
              register={register}
              errors={errors}
              validations={{ required: "Identification email required" }}
            />

            <Input
              icon={Lock}
              type="password"
              field="password"
              placeholder="ENCRYPTED PASSWORD"
              register={register}
              errors={errors}
              validations={{ required: "Security key required" }}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-5 bg-cyan-500 text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-[0_10px_30px_rgba(6,182,212,0.2)]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>AUTHORIZE ACCESS <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          {/* SIGNUP LINK */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-zinc-500 text-sm font-medium">
              New to the unit? 
              <Link to="/signup" className="ml-2 text-white hover:text-cyan-400 underline decoration-cyan-500/30 underline-offset-4 transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* FOOTER METADATA */}
        <p className="text-center mt-8 text-[9px] text-zinc-700 font-mono uppercase tracking-[0.5em]">
          BOND_PLEX Secure Authentication Protocol v3.0.4
        </p>
      </motion.div>
    </div>
  );
}