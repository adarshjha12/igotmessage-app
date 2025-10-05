"use client";

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Play, Image as ImageIcon, XIcon, Video } from "lucide-react";

interface PostMediaProps {
  urls: string[];
}

export default function PostMedia({ urls }: PostMediaProps) {
  if (!urls || urls.length === 0) return null;

  // Single media
  if (urls.length === 1) {
    return (
      <div className="relative  overflow-hidden">
        <MediaItem url={urls[0]} totalMediaCount={1} mediaIndex={1} />
      </div>
    );
  }

  // Multiple media with Swiper
  return (
    <div className="h-fit   overflow-hidden">
      <Swiper className="w-full max-w-[600px] -z-20   overflow-hidden">
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
      <div className="relative flex items-center justify-center bg-[var(--bgColor)]/50 max-h-[600px] w-full overflow-hidden">
        {/* Placeholder while loading */}
        {!loaded && (
          <div className="w-full h-[300px] bg-[var(--wrapperColor)] flex items-center justify-center text-gray-400">
            <Video strokeWidth={1} className="w-18 h-18" />
          </div>
        )}

        {/* Video */}
        {loaded && (
          <video
            ref={videoRef}
            src={url}
            playsInline
            loop
            onClick={togglePlay}
            className="w-full max-w-full object-contain transition-opacity duration-300 opacity-100"
          />
        )}

        {/* Play button overlay */}
        {!playing && loaded && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute z-10 flex items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Play className="w-12 h-12 bg-black/30 text-white rounded-full p-2" />
          </button>
        )}

        {/* Media counter */}
        {totalMediaCount && totalMediaCount > 1 && (
          <div className="absolute top-2 right-2 z-30 rounded-xl bg-white/80 px-2 py-1 font-medium text-sm text-black">
            {mediaIndex}/{totalMediaCount}
          </div>
        )}

        {/* Hidden video loader */}
        {!loaded && (
          <video
            src={url}
            onLoadedData={() => setLoaded(true)}
            className="hidden"
          />
        )}
      </div>
    );
  }

  // --- IMAGE ---
  return (
    <div className="relative bg-[var(--bgColor)]/50 overflow-hidden">
      {!loaded && (
        <div className="w-full h-[300px] bg-[var(--wrapperColor)] flex items-center justify-center text-gray-400">
          <ImageIcon strokeWidth={0.5} size={100} className=" animate-pulse" />
        </div>
      )}
      <button
        type="button"
        onClick={() => setShowFullScreenImage(true)}
        className="w-full"
      >
        <img
          src={url}
          loading="lazy"
          className="w-full max-h-[800px] object-contain"
          onLoad={() => setLoaded(true)}
        />
      </button>

      {totalMediaCount && totalMediaCount > 1 && (
        <div className="absolute rounded-xl top-2 right-2 font-medium text-sm bg-white/80 text-black px-2 py-1  z-30">
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
            <XIcon color="white" size={30} />
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
