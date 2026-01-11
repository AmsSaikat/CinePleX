import React from 'react'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation, Pagination} from 'swiper/modules';





export default function Slider() {

  // slideData.js
const slideData = [
  {
    id: 1,
    content: (
      <div className='w-1/2 flex justify-center mx-100 mb-10'>
        <div className='w-1/2 shadow-2xl border-2 rounded-2xl m-3'>
          <h1 className='text-xl font-bold text-center mt-3'>
            Covered all your needs
          </h1>
          <ul className='list-disc list-inside p-4 space-y-1'>
            <li>Group streaming</li>
            <li>Chat box</li>
            <li>Voice chat</li>
            <li>React & comment</li>
            <li>Personalized theater for all</li>
          </ul>
        </div>

        <div className='w-1/2 border-2 rounded-2xl m-3 flex items-center justify-center'>
          {/* image later */}
        </div>
      </div>
    ),
  },

  {
    id: 2,
    content: (
      <div className='w-1/2 flex justify-center mx-100 mb-10'>
        <div className='w-1/2 shadow-2xl border-2 rounded-2xl m-3'>
          <h1 className='text-xl font-bold text-center mt-3'>
            Real-Time Watch Parties
          </h1>
          <ul className='list-disc list-inside p-4 space-y-1'>
            <li>Sync playback with friends</li>
            <li>Live reactions & emojis</li>
            <li>Pause & play together</li>
            <li>Create private or public rooms</li>
            <li>Notifications for chat & voice</li>
          </ul>
        </div>

        <div className='w-1/2 border-2 rounded-2xl m-3 flex items-center justify-center'>
          {/* image later */}
        </div>
      </div>
    ),
  },

  {
    id: 3,
    content: (
      <div className='w-1/2 flex justify-center mx-100 mb-10'>
        <div className='w-1/2 shadow-2xl border-2 rounded-2xl m-3'>
          <h1 className='text-xl font-bold text-center mt-3'>
            Personalized Experience
          </h1>
          <ul className='list-disc list-inside p-4 space-y-1'>
            <li>Custom avatars & profiles</li>
            <li>Movie recommendations</li>
            <li>Track watch history</li>
            <li>Save favorite scenes</li>
            <li>Create curated theaters</li>
          </ul>
        </div>

        <div className='w-1/2 border-2 rounded-2xl m-3 flex items-center justify-center'>
          {/* image later */}
        </div>
      </div>
    ),
  },
];



  return (
    <div className='w-full'>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={true}
        loop={true}
        pagination={{ clickable: true}}
        spaceBetween={40}
        slidesPerView={1}
        centeredSlides={true}
      
      >
        {slideData.map((slide) => (
          <SwiperSlide key={slide.id}>
            {slide.content}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}