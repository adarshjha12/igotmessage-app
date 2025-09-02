"use client";

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Play,
  Pause,
  Image as ImageIcon,
  XIcon,
  PauseCircleIcon,
  SpeakerIcon,
} from "lucide-react";
import {
  PauseIcon,
  SpeakerNoneIcon,
  SpeakerSlashIcon,
  SpeakerXIcon,
} from "@phosphor-icons/react";

interface PostMediaProps {
  urls: string[];
}

export default function PostMedia({ urls }: PostMediaProps) {
  if (!urls || urls.length === 0) return null;

  return urls.length === 1 ? (
    <MediaItem url={urls[0]} />
  ) : (
    <Swiper
      modules={[Navigation, Pagination]}
      pagination={{ clickable: true }}
      className="w-full rounded-xl overflow-hidden"
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

  // Auto play/pause when visible
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!videoRef.current) return;

        if (!entry.isIntersecting) {
          // If video is visible less than 60%, pause it
          if (!videoRef.current.paused) {
            videoRef.current.pause();
            setPlaying(false);
          }
        }
        // Do nothing when it enters — user controls play manually
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
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  if (isVideo) {
    return (
      <div className="relative flex items-center justify-center bg-black rounded-xl overflow-hidden">
        {/* Loader */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 z-10">
            <ImageIcon className="w-8 h-8 animate-pulse" />
          </div>
        )}

        {/* Video */}
        <video
          ref={videoRef}
          src={url}
          playsInline
          loop
          className="w-full max-h-[500px] object-contain"
          onLoadedData={() => setLoaded(true)}
        />

        {/* Play/Pause overlay */}
        <button
        type="button"
          onClick={togglePlay}
          className="absolute cursor-pointer inset-0 flex items-center justify-center text-white bg-black/15 hover:bg-black/50 transition z-20"
        >
          {!playing && (
            <Play className="w-12 h-12" />
          )}
        </button>

        {/* Page indicator */}
        <div className="absolute top-2 right-2 font-medium text-md bg-white/80 text-black px-2 py-1 rounded-xl z-30">
          {mediaIndex}/{totalMediaCount}
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-[var(--bgColor)]/50 cursor-pointer">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <ImageIcon className="w-8 h-8 animate-pulse" />
        </div>
      )}
      <button
        type="button"
        onClick={() => setShowFullScreenImage(true)}
        className="relative w-full backdrop-blur-lg rounded-xl overflow-hidden"
      >
        <img
          src={url}
          alt="post media"
          loading="lazy"
          className="w-full max-h-[500px] object-contain"
          onLoad={() => setLoaded(true)}
        />

        {totalMediaCount && totalMediaCount > 1 && (
          <div className="absolute top-2 right-2 font-medium text-md bg-white/80 text-black px-2 py-1 rounded-xl z-30">
            {mediaIndex}/{totalMediaCount}
          </div>
        )}
      </button>

      {showFullScreenImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
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
            loading="lazy"
            className="w-full max-h-[500px] object-contain"
            onLoad={() => setLoaded(true)}
          />
        </div>
      )}
    </div>
  );
}
