"use client";

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Play,
  Image as ImageIcon,
  XIcon,
} from "lucide-react";

interface PostMediaProps {
  urls: string[];
}

export default function PostMedia({ urls }: PostMediaProps) {
  if (!urls || urls.length === 0) return null;

  // Single media
  if (urls.length === 1) {
    return (
      <div className="relative rounded-xl overflow-hidden">
        <MediaItem url={urls[0]} totalMediaCount={1} mediaIndex={1} />
      </div>
    );
  }

  // Multiple media with Swiper
  return (
    <div className="h-fit  rounded-xl overflow-hidden">
      <Swiper
      modules={[Navigation, Pagination]}
      pagination={{ clickable: true }}
      className="w-full max-w-[600px] -z-20  rounded-xl overflow-hidden"
    >
      {urls.map((url, i) => (
        <SwiperSlide key={i}>
          <MediaItem
            totalMediaCount={urls.length}
            mediaIndex={i + 1}
            url={url}
          />
         </SwiperSlide>
      ))}
     </Swiper>
    </div>
  );
}

function MediaItem({
  url,
  totalMediaCount,
  mediaIndex,
}: {
  url: string;
  totalMediaCount?: number;
  mediaIndex?: number;
}) {
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);

  const isVideo = url.endsWith(".mp4") || url.endsWith(".webm");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Auto pause when out of view
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!videoRef.current) return;
        if (!entry.isIntersecting && !videoRef.current.paused) {
          videoRef.current.pause();
          setPlaying(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.6,
    });

    observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, [isVideo]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  // --- VIDEO ---
  if (isVideo) {
    return (
      <div className="relative flex items-center justify-center bg-[var(--bgColor)]/50 rounded-xl z-0 overflow-hidden">
        {!loaded && (
          <div className="w-full h-[400px] flex items-center justify-center text-gray-400 z-10">
            <ImageIcon className="w-8 h-8 animate-pulse" />
          </div>
        )}

        <video
          ref={videoRef}
          src={url}
          playsInline
          loop
          onClick={togglePlay}
          className="w-full z-0 max-h-[500px] max-w-full object-contain"
          onLoadedData={() => setLoaded(true)}
        />

        {!playing && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute z-20"
          >
            <Play className="w-12 h-12 bg-black/30 text-white rounded-full p-2" />
          </button>
        )}

        {totalMediaCount && (
          <div className="absolute top-2 right-2 font-medium text-sm bg-white/80 text-black px-2 py-1 rounded-xl z-30">
            {mediaIndex}/{totalMediaCount}
          </div>
        )}
      </div>
    );
  }

  // --- IMAGE ---
  return (
    <div className="relative bg-[var(--bgColor)]/50 rounded-xl overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <ImageIcon className="w-8 h-8 animate-pulse" />
        </div>
      )}
      <button
        type="button"
        onClick={() => setShowFullScreenImage(true)}
        className="w-full"
      >
        <img
          src={url}
          alt="post media"
          loading="lazy"
          className="w-full max-h-[500px] object-contain"
          onLoad={() => setLoaded(true)}
        />
      </button>

      {totalMediaCount && totalMediaCount > 1 && (
        <div className="absolute top-2 right-2 font-medium text-sm bg-white/80 text-black px-2 py-1 rounded-xl z-30">
          {mediaIndex}/{totalMediaCount}
        </div>
      )}

      {showFullScreenImage && (
        <div className="fixed backdrop-blur-lg inset-0 z-[100] flex items-center justify-center bg-black/75">
          <button
            aria-label="Close full screen image"
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10"
            onClick={() => setShowFullScreenImage(false)}
            type="button"
          >
            <XIcon size={30} />
          </button>
          <img
            src={url}
            alt="post media"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}
