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
import { useEffect, useRef, useState } from "react";
import { Post } from "../post/Posts";
import axios from "axios";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { useSearchParams } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";

function ReelSlide({ reel }: { reel: Post }) {
  const [loaded, setLoaded] = useState(false);
  const params = useSearchParams();
  const userId = params.get("userId") as string;
  const [maxDuration, setMaxDuration] = useState(0);
  const reelRef = useRef<HTMLVideoElement | null>(null);
  const [currentlDuration, setCurrentlDuration] = useState(
    reelRef.current?.currentTime || 0
  );
  const [isPlaying, setIsPlaying] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const video = reelRef.current;
    if (!video) return;
    video.currentTime = Number(e.target.value);
  }

  function handlePlayPause() {
    if (!reelRef.current?.paused) {
      reelRef.current?.pause();
      setIsPlaying(false);
    } else {
      reelRef.current?.play();
      setIsPlaying(true);
    }
  }

  useEffect(() => {
    const video = reelRef.current;
    if (!video) return;

    let rafId: number;

    const handlePlaying = () => {
      setIsPlaying(true);
      // Start updating slider smoothly
      const updateProgress = () => {
        setCurrentlDuration(video.currentTime);
        rafId = requestAnimationFrame(updateProgress);
      };
      updateProgress();
    };

    const handlePause = () => {
      setIsPlaying(false);
      cancelAnimationFrame(rafId); // stop the loop when paused
    };

    const handleDuration = () => setMaxDuration(video.duration || 0);

    video.addEventListener("loadedmetadata", handleDuration);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("loadedmetadata", handleDuration);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const video = reelRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0.75] }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, []);

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
        ref={reelRef}
        src={reel?.mediaUrls?.[0]}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        playsInline
        loop
        muted
        onLoadedData={() => setLoaded(true)}
      />

      <button
        type="button"
        onClick={handlePlayPause}
        className="absolute inset-0 flex items-center justify-center"
      >
        {!isPlaying && (
          <div className="flex items-center p-4 bg-black/30 rounded-full">
            <Play strokeWidth={1.5} className="w-12 text-white h-12" />
          </div>
        )}
      </button>

      <Link
        href={`/public-profile/${reel?.user?._id}/myId/${userId}`}
        className="absolute bottom-10 left-4 flex items-center gap-3 px-3 py-2 rounded-2xl backdrop-blur-lg bg-black/10"
      >
        <img
          src={reel.user.profilePicture || reel.user.avatar}
          alt={reel.user.userName}
          width={44}
          height={44}
          className="rounded-full border border-white/50"
        />
        <div className="flex flex-col">
          <p className="text-white font-semibold text-base">
            @{reel.user.userName}
          </p>
          <span className="text-xs sm:text-xs text-[var(--textColor)]/60">
            {formatDistanceToNowStrict(new Date(reel?.createdAt ?? ""), {
              addSuffix: true,
            })}
          </span>
        </div>
      </Link>

      {/* reel duration visualization line */}
      <div className="absolute bottom-4 w-full left-0 flex items-center gap-3 py-2 rounded-2xl ">
        <input
          type="range"
          value={currentlDuration}
          onChange={onChange}
          step={0.0001}
          min="0"
          max={maxDuration}
          style={{
            background: `linear-gradient(to right, white ${
              (currentlDuration / maxDuration) * 100
            }%, rgba(255,255,255,0.2) ${
              (currentlDuration / maxDuration) * 100
            }%`,
          }}
          className="
    w-full h-1 appearance-none
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:h-3
    [&::-webkit-slider-thumb]:w-3
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-white
    [&::-webkit-slider-thumb]:mt-[-4px]
    [&::-webkit-slider-runnable-track]:h-1.5
    [&::-webkit-slider-runnable-track]:rounded-full
  "
        />
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
