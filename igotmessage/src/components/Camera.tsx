"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  RefreshCcwIcon,
  SwitchCamera,
  PlusIcon,
} from "lucide-react";
import { PlusSquareIcon } from "@phosphor-icons/react";
import { useAppDispatch } from "@/store/hooks";
import { setStoryImage, setStoryTextBg } from "@/features/storySlice";

interface Props {
  setCameraOpen?: (value: boolean) => void;
  clickedFromStory?: boolean;
  clickedFromHome?: boolean;
}

export default function CameraCapture({
  setCameraOpen,
  clickedFromHome,
  clickedFromStory,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState<null | string>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (navigator.mediaDevices?.getUserMedia && videoRef.current) {
      let stream: MediaStream;
      async function enableVideo(mode: "user" | "environment") {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: mode },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.log(error);
        }
      }
      enableVideo(facingMode);
      return () => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [facingMode]);

  function handleCameraMode() {
    setFacingMode(facingMode === "user" ? "environment" : "user");
  }

  const capture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/png");
        setPhoto(dataURL);
      }
    }
  };

  useEffect(() => {
    if (clickedFromStory) {
      pathname !== "/create-story" && setCameraOpen?.(false);
    } else if (clickedFromHome) {
      pathname !== "/dash/feed" && setCameraOpen?.(false);
    }
  }, [pathname]);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-black">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover ${
          facingMode === "user" ? "-scale-x-100" : ""
        } ${photo ? "hidden" : ""}`}
      />

      {/* Captured Photo Preview */}
      <AnimatePresence>
        {photo && (
          <motion.img
            key="photo"
            src={photo}
            alt="Captured"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
        {/* Top Controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCameraOpen?.(false)}
            className="pointer-events-auto p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition"
          >
            <ArrowLeftIcon className="text-white" />
          </button>
        </div>

        {/* Bottom Controls */}
        {!photo ? (
          <div className="flex flex-col items-center gap-6 pointer-events-auto">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={capture}
              className="w-[80px] h-[80px] rounded-full border-4 border-white/80 flex items-center justify-center bg-white/90 shadow-lg"
            />
            <button
              onClick={handleCameraMode}
              className="p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition"
            >
              <SwitchCamera className="text-white" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 pointer-events-auto">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setPhoto(null)}
              className="p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition"
            >
              <RefreshCcwIcon className="text-white" />
            </motion.button>

            <div className="flex gap-4">
              {clickedFromStory && (
                <button
                  onClick={() => {
                    setCameraOpen?.(false);
                    dispatch(setStoryImage(photo));
                    dispatch(setStoryTextBg(photo));
                    router.push("/create-story");
                  }}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-black font-semibold shadow-lg hover:scale-95 transition"
                >
                  <PlusSquareIcon weight="light" size={26} />
                  Add to Story
                </button>
              )}
              {clickedFromHome && (
                <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-black font-semibold shadow-lg hover:scale-95 transition">
                  <PlusIcon strokeWidth={1} size={26} />
                  Add Post
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
