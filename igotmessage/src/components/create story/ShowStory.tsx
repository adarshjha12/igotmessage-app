import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { fetchMyStories, fetchOtherStories } from "@/utils/api";
import { useAppDispatch } from "@/store/hooks";

function ShowStory() {
  interface StoryType {
    _id: string;
    imageUrl?: string;
    createdAt?: string;
    user?: {
      _id: string;
      userName: string;
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

  const param = useParams();
  const userId = param.userId as string;
  const dispatch = useAppDispatch();
  const [userStories, setUserStories] = useState<StoryType[][] | undefined>([]);
  const flatStories = userStories?.flat();
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const groupByUser = (stories: StoryType[]): StoryType[][] => {
    const grouped: { [key: string]: StoryType[] } = {};
    stories.forEach((story) => {
      if (!story.user?._id) return;
      if (!grouped[story.user?._id]) {
        grouped[story.user?._id] = [];
      }
      grouped[story.user?._id].push(story);
    });

    return Object.values(grouped);
  };

  const fetchStory = async () => {
    try {
      const [paramStories, otherStories] = await Promise.all([
        fetchMyStories(userId),
        fetchOtherStories(),
      ]);

      const filteredStories = otherStories?.data.otherStories.filter((story: StoryType) => story.user?._id !== userId)

      const combined = [
        ...paramStories?.data?.myStories,
        ...filteredStories
      ];

      return groupByUser(combined);
    } catch (err) {
      console.error("Failed to fetch stories:", err);
    }
  };

  useEffect(() => {
    const getStories = async () => {
      const stories = await fetchStory();
      setUserStories(stories);
    };

    getStories();
  }, [userId]);

  useEffect(() => {
    console.log(flatStories);
  }, [userStories]);

  return (
    <div className="w-full flex flex-col gap-3 min-h-screen bg-[var(--bgColor)] text-[var(--textColor)]">
      {/* {userStories && userStories.map((_, index) => (

      ))} */}

      <Swiper
        modules={[Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        className="w-full flex items-center justify-center custom-swiper sm:w-[50%] h-full"
      >
        {flatStories && flatStories.length > 0 &&
          flatStories.map((story) => (
            <SwiperSlide key={story._id}>
              <div className="w-full relative h-full object-contain">
                {story.imageUrl && <img src={story.imageUrl} />}
                <p className="absolute top-4 left-[30%] bg-red-700 text-3xl">{story.user?.userName}</p>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}

export default ShowStory;
