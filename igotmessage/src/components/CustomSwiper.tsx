// components/CoverflowSwiper.tsx
'use client';

import { ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CoverflowSwiperProps {
  slides: ReactNode[];
}

export default function CoverflowSwiper({ slides }: CoverflowSwiperProps) {
  return (
    <div className="w-[700px] flex justify-center">
      <Swiper
        effect="coverflow"
        spaceBetween={0}
        grabCursor
        centeredSlides
        slidesPerView="auto"
        loop
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 2.5,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        navigation
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="coverflow-swiper w-full flex flex-wrap"
      >
        {slides.map((slideContent, index) => (
          <SwiperSlide key={index} className="!w-54 h-86">
            <div className="shadow-lg overflow-hidden flex items-center justify-center !flex-wrap text-xl font-bold">
              {slideContent}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
        <style jsx global>{`
            .swiper-button-prev,
            .swiper-button-next{
                color: red;
                width: 60px;
                // background: black;
            }
            
            .swiper-button-next::after,
            .swiper-button-prev::after {
                font-size: 70px;              /* 👈 Make arrow icon bigger */
                width: 100%;
                text-align: center;
                color: white;
            }

            .swiper-pagination-bullet {
                background: black;
                opacity: 0.9;
                margin: 0 4px;
                width: 40px;      
                height: 8px;      
                border-radius: 4px;
                transition: all 0.3s ease;
            }

            .swiper-pagination-bullet-active {
                background: white;
                transform: scale(1.2);
            }
        `}</style>

    </div>
  );
}
