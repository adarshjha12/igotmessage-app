"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Mousewheel } from "swiper/modules";
import { ChevronLeftIcon, Heart, MessageCircle, Repeat2, Share2 } from "lucide-react";
import Image from "next/image";

export default function Reels() {
  const reels = [
    {
      id: 1,
      video: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.mp4",
      username: "john_doe",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      likes: 123,
      comments: 45,
      reposts: 12,
    },
    {
      id: 2,
      video: "https://media.giphy.com/media/2A75RyXVzzSI2bx4Gj/giphy.mp4",
      username: "sarah_w",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      likes: 89,
      comments: 30,
      reposts: 6,
    },
  ];

  return (
    <div className="h-screen w-full flex justify-center  bg-black/80">
      <div className="h-full relative w-full sm:w-[80%] md:w-[70%] lg:w-[50%] ">
        <button type="button" onClick={() => window.history.back()} className="absolute top-4 p-2 rounded-full bg-white/10 backdrop-blur-md left-4 z-20"><ChevronLeftIcon className="w-10 h-10 text-white" /></button>
        <Swiper 
          direction="vertical"
          slidesPerView={1}
          spaceBetween={0}
          mousewheel
          pagination={{ clickable: true }}
          modules={[Pagination, Mousewheel]}
          className="h-full"
        >
          {reels.map((reel) => (
            <SwiperSlide key={reel.id}>
              <div className="relative w-full h-full">
                {/* Video */}
                <video
                  src={reel.video}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                />

                {/* Gradient overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Bottom left - User info with blur */}
                <div className="absolute bottom-6 left-4 flex items-center gap-3 px-3 py-2 rounded-2xl backdrop-blur-lg bg-white/10">
                  <Image
                    src={reel.avatar}
                    alt={reel.username}
                    width={44}
                    height={44}
                    className="rounded-full border border-white/50"
                  />
                  <p className="text-white font-semibold text-base">
                    @{reel.username}
                  </p>
                </div>

                {/* Right side actions with blur buttons */}
                <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5">
                  <div className="flex flex-col items-center px-3 py-2 rounded-xl backdrop-blur-lg bg-white/10">
                    <Heart className="text-white w-6 h-6 cursor-pointer hover:scale-110 transition" />
                    <span className="text-xs text-white mt-1">
                      {reel.likes}
                    </span>
                  </div>
                  <div className="flex flex-col items-center px-3 py-2 rounded-xl backdrop-blur-lg bg-white/10">
                    <MessageCircle className="text-white w-6 h-6 cursor-pointer hover:scale-110 transition" />
                    <span className="text-xs text-white mt-1">
                      {reel.comments}
                    </span>
                  </div>
                  <div className="flex flex-col items-center px-3 py-2 rounded-xl backdrop-blur-lg bg-white/10">
                    <Repeat2 className="text-white w-6 h-6 cursor-pointer hover:scale-110 transition" />
                    <span className="text-xs text-white mt-1">
                      {reel.reposts}
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-3 rounded-full backdrop-blur-lg bg-white/10">
                    <Share2 className="text-white w-6 h-6 cursor-pointer hover:scale-110 transition" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
