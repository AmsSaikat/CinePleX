import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

export default function ScheduleSlider() {
  const scheduleContent = [
    {
      id: 1,
      img: "https://picsum.photos/seed/dune/1000/500",
      time: "Tonight • 9:30 PM",
      title: "Dune: Part Two",
      meta: "Orion Theater • 6 watching",
      status: "Starting Soon",
      color: "text-cyan-400"
    },
    {
      id: 2,
      img: "https://picsum.photos/seed/interstellar/1000/500",
      time: "Tomorrow • 8:00 PM",
      title: "Interstellar",
      meta: "Squad Night • Hosted by Saikat",
      status: "Scheduled",
      color: "text-blue-400"
    },
    {
      id: 3,
      img: "https://picsum.photos/seed/darkknight/1000/500",
      time: "Friday • 10:00 PM",
      title: "The Dark Knight",
      meta: "Gotham Theater • 9 members joined",
      status: "Invite Only",
      color: "text-purple-400"
    },
    {
      id: 4,
      img: "https://picsum.photos/seed/bladerunner/1000/500",
      time: "Saturday • 11:00 PM",
      title: "Blade Runner 2049",
      meta: "Neon Squad • Voice Chat Enabled",
      status: "Late Night Watch",
      color: "text-lime-400"
    },
    {
      id: 5,
      img: "https://picsum.photos/seed/inception/1000/500",
      time: "Last Sunday",
      title: "Inception",
      meta: "Watched with 7 squad members",
      status: "Completed",
      color: "text-gray-400"
    }
  ];

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      loop
      spaceBetween={40}
      slidesPerView={1}
      centeredSlides
    >
      {scheduleContent.map((item) => (
        <SwiperSlide key={item.id}>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl bg-[#0b1320] rounded-2xl shadow-xl overflow-hidden">
              <img src={item.img} alt={item.title} />

              <div className="p-6 space-y-2">
                <p className="text-sm text-blue-300">{item.time}</p>
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="text-blue-400">{item.meta}</p>
                <span className={`text-sm font-semibold ${item.color}`}>
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
