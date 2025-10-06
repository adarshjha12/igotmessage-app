"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Mousewheel } from "swiper/modules";
import {
  ChevronLeftIcon,
 
} from "lucide-react";
import { useEffect, useState } from "react";
import { Post } from "../post/Posts";
import axios from "axios";
import ReelSlide from "./reelSlide";

export default function Reels() {
  const [reels, setReels] = useState<Post[]>([]);
  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}`;

  const fetchReels = async () => {
    try {
      const res = await axios.get(`${url}/api/post/get-reels`);
      const data = await res.data;

      const parsedReels =
        typeof data.reels === "string" ? JSON.parse(data.reels) : data.reels;

      setReels((prev) => {
        const merged = [...prev, ...parsedReels];
        const uniqueReels = Array.from(
          new Map(merged.map((reel) => [reel._id, reel])).values()
        );
        return uniqueReels;
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  useEffect(() => {
    console.log(reels);

    return () => {};
  }, [reels]);

  return (
    <div className="h-[100dvh] w-full flex justify-center bg-black/80">
      <div className="h-full relative w-full sm:w-[80%] md:w-[70%] lg:w-[50%]">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="absolute top-4 p-2 rounded-full bg-black/10 backdrop-blur-md left-2 z-20"
        >
          <ChevronLeftIcon className="w-10 h-10 text-white" />
        </button>

        <Swiper
          direction="vertical"
          slidesPerView={1}
          spaceBetween={0}
          mousewheel
          modules={[Pagination, Mousewheel]}
          className="h-full"
        >
          {reels.map((reel) => (
            <SwiperSlide
              key={reel._id}
              className="h-full flex items-center justify-center bg-black"
            >
              <ReelSlide reel={reel} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
