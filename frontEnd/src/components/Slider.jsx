import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { CheckCircle2, Monitor, MessageSquare, Zap, Shield, Heart } from 'lucide-react';

export default function Slider() {
  const features = [
    {
      id: 1,
      title: "Covered All Your Needs",
      description: "A complete ecosystem for the ultimate digital hangout.",
      points: ["Group Streaming", "Live Chat Box", "Crystal Clear Voice", "Reactions & Comments"],
      icon: <Monitor className="text-cyan-400" size={48} />,
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957&auto=format&fit=crop", // Cinema setup
    },
    {
      id: 2,
      title: "Real-Time Watch Parties",
      description: "Zero latency. Perfect sync. No more '3, 2, 1... GO!'",
      points: ["Sync Playback", "Live Emojis", "Joint Pause/Play", "Public & Private Rooms"],
      icon: <Zap className="text-amber-400" size={48} />,
      image: "https://images.unsplash.com/photo-1552064084-24632e582863?q=80&w=2070&auto=format&fit=crop", // Social connection
    },
    {
      id: 3,
      title: "Personalized Experience",
      description: "Your theater, your rules, your unique style.",
      points: ["Custom Avatars", "Smart Recommendations", "Watch History", "Curated Theaters"],
      icon: <Heart className="text-red-400" size={48} />,
      image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=2070&auto=format&fit=crop", // UI/UX vibes
    },
  ];

  return (
    <div className='w-full max-w-7xl mx-auto px-6'>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={true}
        loop={true}
        autoplay={{ delay: 6000 }}
        pagination={{ clickable: true }}
        spaceBetween={50}
        slidesPerView={1}
        className="premium-swiper pb-16"
      >
        {features.map((f) => (
          <SwiperSlide key={f.id}>
            <div className='flex flex-col md:flex-row items-center gap-12 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-16 overflow-hidden'>
              
              {/* CONTENT SIDE */}
              <div className='w-full md:w-1/2 space-y-8'>
                <div className="p-4 bg-white/5 rounded-3xl w-fit inline-block">
                  {f.icon}
                </div>
                
                <div className="space-y-4">
                  <h2 className='text-4xl md:text-5xl font-black tracking-tight italic bg-linear-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase'>
                    {f.title}
                  </h2>
                  <p className='text-zinc-400 text-lg font-light'>
                    {f.description}
                  </p>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {f.points.map((point, index) => (
                    <div key={index} className='flex items-center gap-3 text-zinc-300 group'>
                      <CheckCircle2 size={18} className="text-cyan-500 group-hover:scale-125 transition-transform" />
                      <span className="font-medium tracking-wide">{point}</span>
                    </div>
                  ))}
                </div>

                <button className="mt-4 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95">
                  LEARN MORE
                </button>
              </div>

              {/* IMAGE SIDE */}
              <div className='w-full md:w-1/2 relative h-75 md:h-112.5 group'>
                <div className="absolute inset-0 bg-cyan-500/20 blur-[80px] group-hover:blur-[100px] transition-all opacity-50" />
                <img 
                  src={f.image} 
                  alt={f.title}
                  className="relative z-10 w-full h-full object-cover rounded-4xl border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                />
                {/* Floating Decorative Card */}
                <div className="absolute -bottom-6 -left-6 z-20 bg-zinc-900/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl hidden md:block">
                  <p className="text-cyan-400 font-black text-xs uppercase tracking-widest">Active Status</p>
                  <p className="text-white text-sm">System Fully Synced</p>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .premium-swiper .swiper-button-next, 
        .premium-swiper .swiper-button-prev {
          color: white !important;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .premium-swiper .swiper-button-next:after, 
        .premium-swiper .swiper-button-prev:after {
          font-size: 20px !important;
          font-weight: bold;
        }
        .premium-swiper .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.2;
        }
        .premium-swiper .swiper-pagination-bullet-active {
          background: #22d3ee !important;
          opacity: 1;
          width: 30px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}