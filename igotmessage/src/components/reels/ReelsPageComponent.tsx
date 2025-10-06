"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Mousewheel } from "swiper/modules";
import {
  ChevronLeftIcon,
  Heart,
  MessageCircle,
  Play,
  Repeat2,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Post } from "../post/Posts";
import axios from "axios";

function ReelSlide({ reel }: { reel: Post }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="w-full h-full bg-[var(--wrapperColor)] flex items-center justify-center text-gray-400">
          <div className="flex items-center animate-pulse px-2 py-6 border-2 border-[var(--borderColor)] rounded-xl">
            <Play strokeWidth={1} className="w-12 h-12" />
          </div>
        </div>
      )}

      <video
        src={reel?.mediaUrls?.[0]}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        loop
        muted
        onLoadedData={() => setLoaded(true)}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      <div className="absolute bottom-6 left-4 flex items-center gap-3 px-3 py-2 rounded-2xl backdrop-blur-lg bg-black/10">
        <img
          src={reel.user.profilePicture || reel.user.avatar}
          alt={reel.user.userName}
          width={44}
          height={44}
          className="rounded-full border border-white/50"
        />
        <p className="text-white font-semibold text-base">
          @{reel.user.userName}
        </p>
      </div>

      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5">
        {[
          { icon: <Heart className="text-white w-6 h-6" />, count: reel.likes },
          {
            icon: <MessageCircle className="text-white w-6 h-6" />,
            count: reel.comments,
          },
          {
            icon: <Repeat2 className="text-white w-6 h-6" />,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center px-3 py-2 rounded-xl backdrop-blur-lg bg-black/10 hover:scale-110 transition"
          >
            {item.icon}
            <span className="text-xs text-white mt-1">{item.count}</span>
          </div>
        ))}
        <div className="flex items-center justify-center p-3 rounded-full backdrop-blur-lg bg-black/10 hover:scale-110 transition">
          <Share2 className="text-white w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

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
    <div className="h-screen w-full flex justify-center bg-black/80">
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
          pagination={{ clickable: true }}
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
