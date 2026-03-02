import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Calendar, Users, PlayCircle, Info } from "lucide-react";

export default function ScheduleSlider() {
  const scheduleContent = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop", // Dune-esque
      time: "Tonight • 9:30 PM",
      title: "Dune: Part Two",
      meta: "Orion Theater • 6 watching",
      status: "Starting Soon",
      accent: "#22d3ee", // Cyan
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop", // Space
      time: "Tomorrow • 8:00 PM",
      title: "Interstellar",
      meta: "Squad Night • Hosted by Saikat",
      status: "Scheduled",
      accent: "#3b82f6", // Blue
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop", // Dark Cinema
      time: "Friday • 10:00 PM",
      title: "The Dark Knight",
      meta: "Gotham Theater • 9 members joined",
      status: "Invite Only",
      accent: "#a855f7", // Purple
    }
  ];

  return (
    <div className="relative group px-4">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 5000 }}
        loop
        spaceBetween={30}
        slidesPerView={1}
        className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5"
      >
        {scheduleContent.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative h-125 w-full group overflow-hidden">
              {/* Background Image with Parallax-like effect */}
              <img 
                src={item.img} 
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                alt={item.title} 
              />
              
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-[#020617]/40 to-transparent z-10" />
              <div className="absolute inset-0 bg-linear-to-r from-[#020617] via-transparent to-transparent z-10" />

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-10 md:p-16 z-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span 
                      className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 backdrop-blur-md border border-white/10"
                      style={{ color: item.accent }}
                    >
                      {item.status}
                    </span>
                    <span className="text-zinc-400 text-sm font-medium flex items-center gap-1">
                      <Calendar size={14} /> {item.time}
                    </span>
                  </div>

                  <h3 className="text-5xl md:text-6xl font-black tracking-tighter italic text-white leading-none">
                    {item.title.toUpperCase()}
                  </h3>

                  <p className="text-zinc-300 text-lg flex items-center gap-2">
                    <Users size={18} className="text-cyan-500" /> {item.meta}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-cyan-400 transition-all hover:scale-105">
                    <PlayCircle size={20} /> JOIN ROOM
                  </button>
                  <button className="p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/20 transition-all">
                    <Info size={24} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons (Visible on Hover) */}
        <button className="swiper-button-prev-custom absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-cyan-500 hover:text-black">
          ←
        </button>
        <button className="swiper-button-next-custom absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-cyan-500 hover:text-black">
          →
        </button>
      </Swiper>

      <style>{`
        .swiper-pagination-bullet { background: white !important; opacity: 0.3; }
        .swiper-pagination-bullet-active { background: #22d3ee !important; opacity: 1; width: 24px !important; border-radius: 4px !important; transition: all 0.3s !important; }
      `}</style>
    </div>
  );
}