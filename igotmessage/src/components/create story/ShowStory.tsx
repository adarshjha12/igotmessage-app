'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ImageIcon, MusicIcon } from 'lucide-react';

interface StoryType {
  _id: string;
  imageUrl?: string;
  musicData?: {
    title?: string;
    artist?: string;
  };
}

export default function StoryViewerPage() {
  const { id } = useParams(); // userId from route
  const [stories, setStories] = useState<StoryType[]>([]);

  useEffect(() => {
    // TODO: replace with actual API call
    const fetchStories = async () => {
      try {
        // Example: GET /api/story/user/:id
        const res = await fetch(`/api/story/user/${id}`, { cache: 'no-store' });
        const data = await res.json();
        setStories(data.stories);
      } catch (err) {
        console.error("Failed to fetch stories:", err);
      }
    };

    if (id) fetchStories();
  }, [id]);

  return (
    <div className="w-full h-screen bg-[var(--bgColor)] text-[var(--textColor)]">
      {stories.length > 0 ? (
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          className="w-full h-full"
        >
          {stories.map((story) => (
            <SwiperSlide
              key={story._id}
              className="w-full h-full flex items-center justify-center flex-col gap-3"
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
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-sm opacity-70">No stories found</p>
        </div>
      )}
    </div>
  );
}
