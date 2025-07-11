"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { ImageIcon, MusicIcon, User, XIcon } from "lucide-react";
import axios from "axios";
import { Swiper as SwiperClass } from "swiper";


interface StoryType {
  _id: string;
  imageUrl?: string;
  createdAt?: string;
  user?: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  musicData?: {
    title?: string;
    artist?: string;
    genre?: string;
    url?: string;
    image?: string;
  };
}

export default function StoryViewerPage() {

  const swiperRef = useRef<SwiperClass | null>(null);
  const params = useParams();
  const userId = params.userId as string;
  const router = useRouter();

  const [stories, setStories] = useState<StoryType[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressPercents, setProgressPercents] = useState<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const PROGRESS_DURATION = 30000; // 30s
  const PROGRESS_UPDATE_INTERVAL = 100; // every 100ms

  const timeAgo = (dateStr: string) =>
    formatDistanceToNowStrict(new Date(dateStr), { addSuffix: true });

  // Fetch stories
  useEffect(() => {
    const fetchStories = async () => {
      const url =
        process.env.NODE_ENV === "production"
          ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/story/get-story/${userId}`
          : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/story/get-story/${userId}`;
      try {
        const res = await axios.get(url, { withCredentials: true });
        setStories(res.data.stories);
        setProgressPercents(new Array(res.data.stories.length).fill(0));
      } catch (err) {
        console.error("Failed to fetch stories:", err);
      }
    };

    if (userId) fetchStories();
  }, [userId]);

  // Handle auto slide and progress
  useEffect(() => {
    if (!stories.length || !swiperRef.current) return;

    // Reset all progress
    setProgressPercents((prev) =>
      prev.map((_, idx) =>
        idx === activeIndex ? 0 : idx < activeIndex ? 100 : 0
      )
    );

    // Clear existing timers
    clearTimeout(timeoutRef.current!);
    clearInterval(intervalRef.current!);

    // Animate progress
    let progress = 0;
    intervalRef.current = setInterval(() => {
      progress += (PROGRESS_UPDATE_INTERVAL / PROGRESS_DURATION) * 100;
      setProgressPercents((prev) =>
        prev.map((val, idx) =>
          idx === activeIndex ? Math.min(progress, 100) : val
        )
      );
    }, PROGRESS_UPDATE_INTERVAL);

    // Auto move to next slide
    timeoutRef.current = setTimeout(() => {
      const nextIndex = activeIndex + 1 < stories.length ? activeIndex + 1 : 0;
      swiperRef.current?.slideTo(nextIndex); // 🔥 this moves Swiper to next
    }, PROGRESS_DURATION);

    return () => {
      clearTimeout(timeoutRef.current!);
      clearInterval(intervalRef.current!);
    };
  }, [activeIndex, stories]);

  return (
    <div className="w-full min-h-screen bg-[var(--bgColor)] text-[var(--textColor)]">
      {stories.length > 0 ? (
        <div>
          {/* Progress Bars */}
          <div className="flex gap-1 absolute top-4 left-4 right-4 z-50">
            {stories.map((_, idx) => (
              <div
                key={idx}
                className="flex-1 h-[3px] bg-white/30 overflow-hidden rounded-full"
              >
                <div
                  className="h-full bg-white transition-all"
                  style={{
                    width: `${progressPercents[idx]}%`,
                    transition: "width 100ms linear",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Story User Info */}
          {stories[activeIndex].user && (
            <div className="flex bg-black/50 py-2 px-6 w-full items-center gap-6 absolute justify-between top-8 left-0 z-50">
              <div className="flex items-center gap-4 justify-center">
                {stories[activeIndex].user.profilePicture ? (
                <img
                  src={stories[activeIndex].user.profilePicture}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User size={30} className="text-gray-500" />
                </div>
              )}

              <div className="flex flex-col">
                <p className="font-medium">
                  {stories[activeIndex].user.username ?? "User"}
                </p>
                <p className="text-xs">
                  {timeAgo(stories[activeIndex].createdAt ?? "")}
                </p>
              </div>
              </div>
              <button onClick={() => router.back()} type="button" className="p-2 active:scale-95 rounded-full cursor-pointer">
                <XIcon
                  size={24}/>
              </button >
            </div>
          )}

          {/* Swiper */}
          <Swiper
            modules={[Navigation]}
            onSwiper={(swiper) => (swiperRef.current = swiper)} 
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            navigation
            spaceBetween={0}
            slidesPerView={1}
            className="w-full custom-swiper sm:w-[30%] h-full"
          >
            {stories.map((story) => (
              <SwiperSlide
                key={story._id}
                className="w-full h-full pt-8 flex items-center justify-center flex-col gap-3"
              >
                <div className="w-full h-5/6 flex items-center justify-center">
                  {story.imageUrl ? (
                    <img
                      src={story.imageUrl}
                      alt="story"
                      className="max-h-full max-w-full object-contain rounded-xl"
                    />
                  ) : (
                    <ImageIcon size={64} />
                  )}
                </div>
                {story.musicData?.title && (
                  <div className="text-center">
                    <MusicIcon className="inline-block mr-2" />
                    <span className="text-sm italic">
                      {story.musicData.title} - {story.musicData.artist}
                    </span>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-sm opacity-70">No stories found</p>
        </div>
      )}
    </div>
  );
}
