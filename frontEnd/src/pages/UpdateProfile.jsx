import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Shield, User, Fingerprint, Lock, ChevronRight, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function UpdateProfile() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('identity');
    const [isUpdating, setIsUpdating] = useState(false);
    const [notification, setNotification] = useState(null);
    const [image, setImage] = useState(null)

    const { user } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        username: user?.name || "AGENT_UNKNOWN",
        bio: user?.bio || "No mission bio available.",
        email: user?.email || "",
        avatar: user?.avatar || " "
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                username: user.name,
                email: user.email,
                bio: user.bio || prev.bio
            }));
        }
    }, [user]);

    const showToast = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
        setImage(file);
    } else {
        alert("Only image files allowed");
    }
};

const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsUpdating(true);

    try {
        let imageUrl = null;
        let public_id = null;

        // ✅ Upload image if selected
        if (image) {
            const cloudData = new FormData();
            cloudData.append("file", image);
            cloudData.append("upload_preset", "CiNEPLeX");

            const cloudRes = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
                cloudData,
                {
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setNotification({
                            message: `Uploading ${percent}%`,
                            type: "info",
                        });
                    },
                }
            );

            imageUrl = cloudRes.data.secure_url;
            public_id = cloudRes.data.public_id;
        }

        // ✅ ALWAYS send request (image or not)
        const payload = {
            ...formData,
        };

        if (imageUrl && public_id) {
            payload.avatar = imageUrl;     // ✅ correct key
            payload.public_id = public_id;
        }

        const response = await axios.post(
            import.meta.env.VITE_API_URL + "user/update-profile",
            payload,
            { withCredentials: true }
        );

        if (response.data.success) {
            showToast("DOSSIER SYNCHRONIZED", "success");
        }

    } catch (error) {
        showToast(
            error.response?.data?.message || "UPDATE FAILED",
            "error"
        );
    } finally {
        setIsUpdating(false);
    }
};

    const tabs = [
        { id: 'identity', label: 'Identity', icon: <User size={18} /> },
        { id: 'security', label: 'Security', icon: <Fingerprint size={18} /> },
        { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
    ];

    return (
        <div className="min-h-screen w-full bg-[#030303] text-zinc-100 font-light selection:bg-cyan-500/50 overflow-x-hidden">

            {/* --- PREMIUM TOAST NOTIFIER --- */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                        className="fixed top-12 right-12 z-100 flex items-center gap-4 p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-red-500/20 text-red-400'}`}>
                            {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-50">System Message</span>
                            <span className="text-xs font-bold tracking-widest uppercase italic">{notification.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
            <div className="fixed top-0 left-1/4 w-125 h-125 bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none" />

            <Navbar />

            <main className="max-w-350 mx-auto px-8 pt-32 pb-20 grid grid-cols-12 gap-16">

                {/* --- LEFT NAVIGATION --- */}
                <div className="col-span-12 lg:col-span-3 space-y-12">
                    <div>
                        <h1 className="text-6xl font-black tracking-tighter italic opacity-20 mb-4">SETUP.</h1>

                        {/* --- RESTORED PREMIUM BACK BUTTON --- */}
                        <button
                            onClick={() => navigate('/profile')}
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
                                <span className="text-[18px] font-light uppercase tracking-widest italic text-zinc-300 group-hover:text-white transition-all">
                                    Back to <span className="font-black not-italic">Profile</span>
                                </span>
                            </div>
                            <div className="absolute bottom-0 left-0 w-0 h-px bg-linear-to-r from-cyan-500 to-transparent group-hover:w-full transition-all duration-700 ease-in-out" />
                        </button>
                    </div>

                    <nav className="space-y-4">
                        {tabs.map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="group w-full flex items-center justify-between text-left transition-all duration-500">
                                <div className="flex items-center gap-4">
                                    <span className={`p-3 rounded-full transition-all duration-500 ${activeTab === tab.id ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-zinc-500 group-hover:bg-white/10'}`}>
                                        {tab.icon}
                                    </span>
                                    <span className={`text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                                        {tab.label}
                                    </span>
                                </div>
                                {activeTab === tab.id && <ChevronRight size={14} className="text-cyan-500" />}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* --- CENTER: THE DATA CORE --- */}
                <div className="col-span-12 lg:col-span-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            {activeTab === 'identity' && (
                                <>
                                    <div className="relative group w-fit">
                                        <div className="w-48 h-64 bg-zinc-900 rounded-4xl overflow-hidden border border-white/10 transition-all duration-700 group-hover:rounded-lg shadow-2xl">
                                            <img src={image ? URL.createObjectURL(image) : user?.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Avatar" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity backdrop-blur-sm gap-4">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleChange}
                                                    className="hidden"
                                                    id="fileInput"
                                                />

                                                <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-2">
                                                    <Camera className="text-white" size={32} />
                                                    <span className="text-white text-sm">Upload Photo</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <EditableInput
                                            label="AGENT ALIAS"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        />
                                        <EditableInput
                                            label="CODEX EMAIL"
                                            value={formData.email}
                                            readOnly={true}
                                            className="opacity-40 pointer-events-none select-none grayscale"
                                        />
                                        <div className="group border-b border-white/10 py-4 hover:border-cyan-500 focus-within:border-cyan-500 transition-all duration-500">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-cyan-500 group-focus-within:text-cyan-500 transition-colors">MISSION BIO</label>
                                            <textarea
                                                value={formData.bio}
                                                rows="1"
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                className="w-full bg-transparent py-4 text-xl font-light italic outline-none transition-all resize-none placeholder:text-zinc-800"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-20 flex items-center gap-8">
                        <button
                            disabled={isUpdating}
                            onClick={handleSubmit}
                            className="relative px-12 py-5 bg-cyan-500 text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-full hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-500 disabled:opacity-50"
                        >
                            <span className={isUpdating ? 'opacity-0' : 'opacity-100'}>Update Dossier</span>
                            {isUpdating && <div className="absolute inset-0 flex items-center justify-center"><Loader2 size={18} className="animate-spin" /></div>}
                        </button>
                        <span className="text-[10px] font-bold text-zinc-700 tracking-widest uppercase">
                            {isUpdating ? 'Syncing...' : 'v4.0.2 Stable'}
                        </span>
                    </div>
                </div>

                {/* --- RIGHT: REAL-TIME FEED --- */}
                <div className="hidden lg:col-span-3 lg:block">
                    <div className="sticky top-32 space-y-8">
                        <div className="relative p-1 border border-white/10 rounded-2xl overflow-hidden group">
                            <div className="bg-[#0b0b0b] p-8 rounded-xl relative z-10">
                                <p className="text-[9px] font-bold text-cyan-500 tracking-[0.4em] uppercase mb-6">Real-time Feed</p>
                                <div className="space-y-4 font-mono text-[10px] text-zinc-500">
                                    <p className="flex justify-between"><span>ALIAS:</span> <span className="text-white uppercase">{formData.username}</span></p>
                                    <p className="flex justify-between"><span>STATUS:</span> <span className={isUpdating ? 'text-cyan-400 animate-pulse' : 'text-white'}>{isUpdating ? 'UPLOADING' : 'STABLE'}</span></p>
                                    <p className="flex justify-between"><span>SECURE:</span> <span className="text-white">TRUE</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function EditableInput({ label, value, readOnly, className, onChange }) {
    return (
        <div className={`group border-b border-white/10 py-4 hover:border-cyan-500 transition-all duration-500 ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black tracking-[0.4em] text-zinc-600 group-hover:text-cyan-500 transition-colors uppercase">{label}</p>
                {readOnly && <Lock size={12} className="text-zinc-700" />}
            </div>
            <input
                type="text"
                readOnly={readOnly}
                value={value}
                onChange={onChange}
                className="w-full bg-transparent text-3xl font-black tracking-tighter uppercase outline-none"
            />
        </div>
    );
}