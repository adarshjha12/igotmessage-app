"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import {
  ImageIcon,
  MusicIcon,
  User,
  XIcon,
  Volume2,
  VolumeX,
} from "lucide-react";
import axios from "axios";
import { Swiper as SwiperClass } from "swiper";
import { fetchOtherStories as fetchOtherStoriesAPI } from "@/utils/api";
import NewLoader from "../NewLoader";
import AudioBars from "../AudioBar";

interface StoryType {
  _id: string;
  imageUrl?: string;
  createdAt?: string;
  user?: {
    _id: string;
    userName: string;
    profilePicture: string;
    isGuest: boolean;
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
  const params = useParams();
  const userId = params.userId as string;
  const router = useRouter();

  const [storiesByUsers, setStoriesByUsers] = useState<StoryType[][]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Flattened list for Swiper
  const allStories = useMemo(() => storiesByUsers.flat(), [storiesByUsers]);

  // Map of where each user's stories start in flat list
  const userStoryStartIndices = useMemo(() => {
    const indices: number[] = [];
    let total = 0;
    for (const userStories of storiesByUsers) {
      indices.push(total);
      total += userStories.length;
    }
    return indices;
  }, [storiesByUsers]);

  const timeAgo = (dateStr: string) =>
    formatDistanceToNowStrict(new Date(dateStr), { addSuffix: true });

  // Helper: group stories by user._id
  const groupByUser = (stories: StoryType[]): StoryType[][] => {
    const grouped: { [key: string]: StoryType[] } = {};
    stories.forEach((story) => {
      if (!story.user?._id) return;
      if (!grouped[story.user._id]) {
        grouped[story.user._id] = [];
      }
      grouped[story.user._id].push(story);
    });
    return Object.values(grouped);
  };

  // Fetch my stories
  const fetchMyStories = async (): Promise<StoryType[]> => {
    const url =
      process.env.NODE_ENV === "production"
        ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/story/get-story/${userId}`
        : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/story/get-story/${userId}`;
    try {
      const res = await axios.get(url, { withCredentials: true });
      return res.data.stories || [];
    } catch (err) {
      console.error("Failed to fetch stories:", err);
      return [];
    }
  };

  // Fetch other users' stories, grouped
  const fetchOtherStories = async (): Promise<StoryType[][]> => {
    try {
      const res = await fetchOtherStoriesAPI();
      const otherStories = res?.data.otherStories || [];
      const filtered = otherStories.filter(
        (story: StoryType) => story.user?._id !== userId
      );
      return groupByUser(filtered);
    } catch (err) {
      console.error("Failed to fetch other stories:", err);
      return [];
    }
  };

  // Fetch all stories on mount
  useEffect(() => {
    if (!userId) return;

    const getStories = async () => {
      const myStories = await fetchMyStories();
      const otherUsersStories = await fetchOtherStories();

      // filter out guest users
      const filteredStories = otherUsersStories.filter(
        (userStories: StoryType[]) => !userStories[0]?.user?.isGuest
      );

      const combined = [myStories, ...filteredStories];
      setStoriesByUsers(combined);
      setCurrentUserIndex(0);
      setActiveStoryIndex(0);
      console.log(filteredStories);
    };

    getStories();
  }, [userId]);

  // Auto-slide every 30s
  useEffect(() => {
    clearTimeout(timeoutRef.current!);

    timeoutRef.current = setTimeout(() => {
      const currentUserStories = storiesByUsers[currentUserIndex] || [];

      if (activeStoryIndex + 1 < currentUserStories.length) {
        // next story in current user
        setActiveStoryIndex(activeStoryIndex + 1);
        swiperRef.current?.slideTo(
          userStoryStartIndices[currentUserIndex] + activeStoryIndex + 1
        );
      } else if (currentUserIndex + 1 < storiesByUsers.length) {
        // move to next user's first story
        setCurrentUserIndex(currentUserIndex + 1);
        setActiveStoryIndex(0);
        swiperRef.current?.slideTo(userStoryStartIndices[currentUserIndex + 1]);
      } else {
        // all stories done
        router.back();
      }
    }, 15000);

    return () => clearTimeout(timeoutRef.current!);
  }, [
    activeStoryIndex,
    currentUserIndex,
    storiesByUsers,
    userStoryStartIndices,
    router,
  ]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const url =
      storiesByUsers?.[currentUserIndex]?.[activeStoryIndex]?.musicData?.url;
    if (url) {
      audio.pause();
      audio.src = url;
      const p = audio.play();
      if (p)
        p.catch((err) => {
          if (err?.name !== "AbortError")
            console.error("audio play error:", err);
        });
    } else {
      audio.pause();
    }
  }, [activeStoryIndex, currentUserIndex, storiesByUsers]);

  // When Swiper slide changes → update indices
  const handleSlideChange = (swiper: SwiperClass) => {
    const flatIndex = swiper.activeIndex;

    let userIdx = 0;
    for (let i = 0; i < userStoryStartIndices.length; i++) {
      if (flatIndex >= userStoryStartIndices[i]) {
        userIdx = i;
      } else {
        break;
      }
    }

    const start = userStoryStartIndices[userIdx];
    setCurrentUserIndex(userIdx);
    setActiveStoryIndex(flatIndex - start);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white relative overflow-hidden">
      {allStories.length > 0 ? (
        <div className="w-full h-full relative">
          {/* Glassmorphic Top Bar */}
          <div className="absolute top-4 left-0 w-full px-4 z-50">
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 shadow-lg">
              {/* Progress Bars */}
              <div className="flex gap-1">
                {storiesByUsers[currentUserIndex]?.map((_, idx) => (
                  <div
                    className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"
                    key={idx}
                  >
                    <div
                      className={`
                      h-1 rounded-full transition-all duration-500
                      ${
                        idx === activeStoryIndex
                          ? "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-progress"
                          : idx < activeStoryIndex
                          ? "bg-white w-full"
                          : "bg-white w-0"
                      }
                    `}
                    />
                  </div>
                ))}
              </div>

              {/* User Info */}
              {storiesByUsers[currentUserIndex]?.[activeStoryIndex]?.user && (
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-3">
                    {storiesByUsers[currentUserIndex][activeStoryIndex].user
                      ?.profilePicture ? (
                      <img
                        src={
                          storiesByUsers[currentUserIndex][activeStoryIndex]
                            .user.profilePicture
                        }
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                        <User size={26} className="text-gray-300" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm">
                        {storiesByUsers[currentUserIndex][activeStoryIndex].user
                          ?.userName ?? "User"}
                      </p>
                      <p className="text-xs text-gray-300">
                        {timeAgo(
                          storiesByUsers[currentUserIndex][activeStoryIndex]
                            .createdAt ?? ""
                        )}
                      </p>
                    </div>
                    {storiesByUsers?.[currentUserIndex]?.[activeStoryIndex]
                      .musicData?.url && (
                      <div className="absolute scale-75 gap-2 overflow-hidden  flex items-center left-[40%]">
                        <AudioBars color="white" />
                        <div className="overflow-hidden">
                          <p className="translate-animation text-nowrap">
                            {storiesByUsers?.[currentUserIndex]?.[
                              activeStoryIndex
                            ].musicData?.title?.slice(0, 20) + "..."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => router.back()}
                    type="button"
                    className="p-2 hover:bg-white/20 rounded-full transition"
                  >
                    <XIcon size={22} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {storiesByUsers?.[currentUserIndex]?.[activeStoryIndex].musicData
            ?.url && (
            <div className="fixed top-24 z-50 right-4 scale-75 gap-2  flex items-center ">
              <button
                type="button"
                className="p-2 bg-gray-800 hover:bg-white/20 rounded-full cursor-pointer"
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (audioRef.current) {
                    audioRef.current.muted = !isMuted;
                  }
                }}
              >
                {isMuted ? (
                  <Volume2 strokeWidth={1.5} size={34} />
                ) : (
                  <VolumeX size={34} strokeWidth={1.5} />
                )}
              </button>
            </div>
          )}

          {/* Swiper */}
          <Swiper
            modules={[Navigation]}
            onSlideChange={handleSlideChange}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            navigation
            spaceBetween={0}
            slidesPerView={1}
            className="w-full h-full flex items-center justify-center"
          >
            {allStories.map((story) => (
              <SwiperSlide
                key={story._id}
                className="flex items-center justify-center flex-col gap-4 pt-28"
              >
                <div className="w-full h-[75vh] flex items-center justify-center">
                  {story.imageUrl ? (
                    <img
                      src={story.imageUrl}
                      alt="story"
                      className="max-h-full max-w-full object-contain rounded-xl shadow-lg transition-transform duration-500 hover:scale-[1.02]"
                    />
                  ) : (
                    <ImageIcon size={64} className="text-gray-500" />
                  )}
                </div>

                <audio
                  ref={audioRef}
                  autoPlay
                  controls
                  className="hidden"
                ></audio>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <NewLoader />
        </div>
      )}
    </div>
  );
}
