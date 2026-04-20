import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Upload, Film, FileText, CheckCircle2, AlertCircle, X, Image as ImageIcon } from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function UploadMoviePage() {
    const [message, setMessage] = useState(null);
    const [thumbImg, setThumbImg] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({ title: '', description: '', thumbNail: '', public_id: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbImg(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const validate = () => {
        const err = {};
        if (!form.title.trim()) err.title = "IDENTIFIER REQUIRED";
        if (!form.description.trim()) err.description = "MANIFEST DATA REQUIRED";
        return err;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsUploading(true);
        try {
            let imageUrl = '';
            let public_id = '';

            if (thumbImg) {
                const cloudData = new FormData();
                cloudData.append('file', thumbImg);
                cloudData.append("upload_preset", "CiNEPLeX");

                const cloudRes = await axios.post(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
                    cloudData
                );
                imageUrl = cloudRes.data.secure_url;
                public_id = cloudRes.data.public_id;
            }

            const payload = { ...form, thumbNail: imageUrl, public_id: public_id };
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}movie/upload-movie`,
                payload,
                { withCredentials: true }
            );

            setMessage({ text: res.data.message, type: 'success' });
            setForm({ title: '', description: '', thumbNail: '', public_id: '' });
            setThumbImg(null);
            setPreviewUrl(null);
        } catch (error) {
            setMessage({ text: "CRITICAL UPLOAD FAILURE", type: 'error' });
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
            <Navbar />
            
            {/* --- BACKGROUND ELEMENTS --- */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-2 text-cyan-500">
                        <Upload size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Asset Deployment</span>
                    </div>
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase">Initialize_<span className="text-cyan-500">Uploader</span></h1>
                </motion.div>

                <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
                    
                    {/* --- LEFT: THUMBNAIL UPLOAD --- */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="col-span-12 lg:col-span-5"
                    >
                        <div className="group relative w-full aspect-[2/3] rounded-[2rem] border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center overflow-hidden transition-all hover:border-cyan-500/50">
                            {previewUrl ? (
                                <>
                                    <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" alt="Preview" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                                    <button 
                                        type="button"
                                        onClick={() => {setThumbImg(null); setPreviewUrl(null);}}
                                        className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white/50 hover:text-red-400 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </>
                            ) : (
                                <div className="text-center p-8">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="text-zinc-600 group-hover:text-cyan-500" size={32} />
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">Drop Visual Asset</p>
                                    <p className="text-[9px] text-zinc-700 mt-2">JPG, PNG or WEBP (Max 5MB)</p>
                                </div>
                            )}
                            <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>
                    </motion.div>

                    {/* --- RIGHT: FORM DATA --- */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="col-span-12 lg:col-span-7 space-y-8"
                    >
                        <InputField 
                            label="Movie Identifier" 
                            name="title" 
                            value={form.title} 
                            onChange={handleChange} 
                            icon={<Film size={18}/>} 
                            error={errors.title}
                            placeholder="e.g. PROJECT_GHOST"
                        />

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                                <FileText size={14} /> Manifest Description
                            </label>
                            <textarea 
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Enter mission parameters..."
                                className={`w-full bg-white/[0.03] border ${errors.description ? 'border-red-500/50' : 'border-white/10'} rounded-2xl p-6 h-40 focus:outline-none focus:border-cyan-500/50 transition-all text-zinc-300 placeholder:text-zinc-700 resize-none`}
                            />
                            {errors.description && <span className="text-[9px] font-bold text-red-500 tracking-widest">{errors.description}</span>}
                        </div>

                        <button 
                            disabled={isUploading}
                            className="w-full relative group h-16 rounded-2xl bg-cyan-500 overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10 text-black font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                                {isUploading ? 'SYNCHRONIZING...' : 'EXECUTE UPLOAD'}
                            </span>
                        </button>
                    </motion.div>
                </form>

                {/* --- FEEDBACK TOAST --- */}
                <AnimatePresence>
                    {message && (
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className={`fixed bottom-10 right-10 flex items-center gap-4 p-6 rounded-2xl backdrop-blur-2xl border ${message.type === 'success' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                        >
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="text-xs font-black uppercase tracking-widest">{message.text}</span>
                            <X size={16} className="ml-4 cursor-pointer" onClick={() => setMessage(null)} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function InputField({ label, name, value, onChange, icon, error, placeholder }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                {icon} {label}
            </label>
            <div className="relative">
                <input 
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full bg-white/[0.03] border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-6 h-14 focus:outline-none focus:border-cyan-500/50 transition-all text-zinc-300 placeholder:text-zinc-700`}
                />
            </div>
            {error && <span className="text-[9px] font-bold text-red-500 tracking-widest uppercase">{error}</span>}
        </div>
    );
}