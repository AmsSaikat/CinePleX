import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function Input({ icon: Icon, field, register, errors, validations, ...props }) {
  const hasError = !!errors[field];

  return (
    <div className='relative mb-8 w-full group'>
      {/* --- FLOATING LABEL (Optional Premium Touch) --- */}
      <label className={`text-[10px] uppercase tracking-[0.2em] font-black mb-2 block transition-colors duration-300 ${hasError ? 'text-red-400' : 'text-zinc-500 group-focus-within:text-cyan-400'}`}>
        {props.placeholder || field}
      </label>

      <div className="relative">
        {/* --- ICON WRAPPER --- */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-20">
            <Icon 
              className={`h-5 w-5 transition-all duration-300 ${
                hasError ? 'text-red-500' : 'text-zinc-500 group-focus-within:text-cyan-400 group-focus-within:scale-110'
              }`} 
            />
          </div>
        )}

        {/* --- THE INPUT BOX --- */}
        <input
          {...register(field, validations)}
          {...props}
          className={`
            w-full pl-12 pr-4 py-4 
            bg-zinc-900/40 backdrop-blur-xl
            rounded-2xl border transition-all duration-500 outline-none
            text-white placeholder-zinc-600 font-medium
            ${hasError 
              ? 'border-red-500/50 focus:border-red-500 ring-4 ring-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
              : 'border-white/5 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 focus:bg-zinc-800/60 shadow-xl'
            }
          `}
        />

        {/* --- FOCUS GLOW (Hidden line that expands) --- */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-cyan-500 transition-all duration-500 rounded-full ${hasError ? 'w-0' : 'w-0 group-focus-within:w-[80%]'} blur-[1px] shadow-[0_0_15px_#22d3ee]`} />
      </div>

      {/* --- ANIMATED ERROR MESSAGE --- */}
      <AnimatePresence>
        {hasError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-6 left-2 flex items-center gap-1.5"
          >
            <AlertCircle size={12} className="text-red-500" />
            <p className="text-[11px] font-bold text-red-500 uppercase tracking-tighter">
              {errors[field].message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}