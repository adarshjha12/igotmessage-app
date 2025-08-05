"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { ImageIcon, MusicIcon, User, XIcon } from "lucide-react";
import axios from "axios";
import { Swiper as SwiperClass } from "swiper";
import { fetchOtherStories as fetchOtherStoriesAPI } from "@/utils/api";
import SplashScreen from "../SplashScreen";
 
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
  const params = useParams();
  const userId = params.userId as string;
  const router = useRouter();

  const [storiesByUsers, setStoriesByUsers] = useState<StoryType[][]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    const grouped: { [userId: string]: StoryType[] } = {};
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
      const otherStories = res.data.otherStories || [];
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
      const combined = [myStories, ...otherUsersStories];
      setStoriesByUsers(combined);
      setCurrentUserIndex(0);
      setActiveStoryIndex(0);
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
        swiperRef.current?.slideTo(userStoryStartIndices[currentUserIndex] + activeStoryIndex + 1);
      } else if (currentUserIndex + 1 < storiesByUsers.length) {
        // move to next user's first story
        setCurrentUserIndex(currentUserIndex + 1);
        setActiveStoryIndex(0);
        swiperRef.current?.slideTo(userStoryStartIndices[currentUserIndex + 1]);
      } else {
        // all stories done
        router.back();
      }
    }, 30000);

    return () => clearTimeout(timeoutRef.current!);
  }, [activeStoryIndex, currentUserIndex, storiesByUsers, userStoryStartIndices, router]);

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
    <div className="w-full min-h-screen bg-[var(--bgColor)] text-[var(--textColor)]">
      {allStories.length > 0 ? (
        <div className="w-full h-full">
          {/* Progress Bars */}
          <div className="flex w-full gap-1 px-2 absolute top-4 left-0 right-4 z-50">
            {storiesByUsers[currentUserIndex]?.map((_, idx) => (
              <div className="w-full" key={idx}>
                <div className="w-full flex justify-start items-center bg-white/50 h-1 rounded-full overflow-hidden">
                  <div
                    className={
                      idx === activeStoryIndex
                        ? "bg-white h-1 rounded-full animate-progress"
                        : idx < activeStoryIndex
                        ? "bg-white h-1 rounded-full w-full"
                        : "bg-white h-1 rounded-full w-0"
                    }
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Story User Info */}
          {storiesByUsers[currentUserIndex]?.[activeStoryIndex]?.user && (
            <div className="flex bg-black/50 py-0 px-6 w-full items-center gap-6 absolute justify-between top-10 left-0 z-50">
              <div className="flex items-center gap-4">
                {storiesByUsers[currentUserIndex][activeStoryIndex].user?.profilePicture ? (
                  <img
                    src={storiesByUsers[currentUserIndex][activeStoryIndex].user.profilePicture}
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
                    {storiesByUsers[currentUserIndex][activeStoryIndex].user?.username ?? "User"}
                  </p>
                  <p className="text-xs">
                    {timeAgo(storiesByUsers[currentUserIndex][activeStoryIndex].createdAt ?? "")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.back()}
                type="button"
                className="p-2 active:scale-95 rounded-full cursor-pointer"
              >
                <XIcon size={24} />
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
            className="w-full flex items-center justify-center custom-swiper sm:w-[50%] h-full"
          >
            {allStories.map((story) => (
              <SwiperSlide
                key={story._id}
                className="w-full h-full pt-[100px] flex items-center justify-center flex-col gap-3"
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
                    <span className="text-sm italic">{story.musicData.title}</span>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-sm opacity-70">Loading...</p>
        </div>
      )}
    </div>
  );
}
