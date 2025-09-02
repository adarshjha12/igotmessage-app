"use client";

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Play, Pause, Image as ImageIcon } from "lucide-react";

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
      navigation
      pagination={{ clickable: true }}
      className="w-full rounded-xl overflow-hidden"
    >
      {urls.map((url, i) => (
        <SwiperSlide key={i}>
          <MediaItem url={url} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function MediaItem({ url }: { url: string }) {
  const isVideo = url.endsWith(".mp4") || url.endsWith(".webm");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Auto play/pause when visible
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play();
              setPlaying(true);
            } else {
              videoRef.current.pause();
              setPlaying(false);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

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
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <ImageIcon className="w-8 h-8 animate-pulse" />
          </div>
        )}
        <video
          ref={videoRef}
          src={url}
          playsInline
          muted
          loop
          className="w-full max-h-[500px] object-contain"
          onLoadedData={() => setLoaded(true)}
        />
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center text-white bg-black/30 hover:bg-black/50 transition"
        >
          {playing ? (
            <Pause className="w-12 h-12" />
          ) : (
            <Play className="w-12 h-12" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="relative  rounded-xl overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <ImageIcon className="w-8 h-8 animate-pulse" />
        </div>
      )}
      <img
        src={url}
        alt="post media"
        loading="lazy"
        className="w-full max-h-[500px] object-contain"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
