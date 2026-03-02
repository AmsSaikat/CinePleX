import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { User, Mail, Lock, Loader2, ShieldCheck, ChevronRight } from 'lucide-react';
import Input from '../components/Input';

export default function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  
  const { handleSubmit, register, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError("");
    try {
      const result = await axios.post(
        import.meta.env.VITE_API_URL + 'auth/signup', 
        data, 
        { withCredentials: true }
      );

      if (result.status === 201) {
        // You could use a toast library here, but let's stick to a premium UI flow
        navigate('/login');
      }
    } catch (error) {
      setServerError(error.response?.data?.message || "Connection to Command Center failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* LOGO AREA */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-3xl border border-white/10 mb-6 shadow-2xl">
            <ShieldCheck size={40} className="text-cyan-500" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
            Join the <span className="text-cyan-500">Squad</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium tracking-widest uppercase">
            Initialize your Operative Profile
          </p>
        </div>

        {/* --- THE FORM CARD --- */}
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-8 md:p-12 rounded-[3rem] shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            
            {serverError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-widest text-center">
                {serverError}
              </div>
            )}

            <Input
              type="text"
              field="name"
              placeholder="Full Name"
              icon={User}
              register={register}
              errors={errors}
              validations={{ required: "Name is required" }}
            />

            <Input
              type="email"
              field="email"
              placeholder="Email Address"
              icon={Mail}
              register={register}
              errors={errors}
              validations={{ 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }}
            />

            <Input
              type="password"
              field="password"
              placeholder="Secure Password"
              icon={Lock}
              register={register}
              errors={errors}
              validations={{
                required: "Password is required",
                minLength: { value: 8, message: "Security clearance requires 8+ characters" }
              }}
            />

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-6 py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>INITIATE ACCOUNT <ChevronRight size={20} /></>
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-zinc-500 text-sm font-medium">
              Already an operative? 
              <Link to="/login" className="ml-2 text-white hover:text-cyan-400 underline decoration-cyan-500/30 underline-offset-4 transition-colors">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}