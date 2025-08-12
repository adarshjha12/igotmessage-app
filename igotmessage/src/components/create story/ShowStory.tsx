import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { fetchOtherStories } from "@/utils/api";
import { useAppDispatch } from "@/store/hooks";

function ShowStory() {
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
  const param = useParams();
  const userId = param.userId;
  const dispatch = useAppDispatch();
  const [userStories, setUserStories] = useState<StoryType[][]>([]);
  const flatStories = userStories.flat();
  const [currentUserIndex, setCurrentUserIndex] = useState(0)
  const [activeStoryIndex, setActiveStoryIndex] = useState(0)
  

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
    const story = await fetchOtherStories();
    return groupByUser(story?.data.otherStories);
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
        {flatStories.length > 0 && flatStories.map((story) => (
          <SwiperSlide key={story._id}>
            <div className="w-full h-full object-contain">
              {story.imageUrl && <img src={story.imageUrl} />}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ShowStory;
