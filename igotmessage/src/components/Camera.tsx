"use client"; // Needed in Next.js 13/14 for client-side components

import { ArrowLeftIcon, PlusIcon, RefreshCcwIcon, SwitchCamera } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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

  navigator.mediaDevices;
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
        console.log(dataURL);
      }
    }
  };

  useEffect(() => {
    if (clickedFromStory) {
      pathname !== "/create-story" && setCameraOpen && setCameraOpen(false);
    } else if (clickedFromHome) {
      pathname !== "/dash/feed" && setCameraOpen && setCameraOpen(false);
    }
    return () => {};
  }, [pathname]);

  return (
  <div className="fixed inset-0 z-40 w-full h-full flex flex-col items-center justify-start overflow-y-auto bg-black/50 backdrop-blur-md">
    
    {/* Video / Camera Feed */}
    <div className="relative w-full flex flex-col items-center pt-6">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-[90%] sm:w-[50%] h-full rounded-xl transform -scale-x-100 ${
          photo ? "hidden" : ""
        }`}
      />

      {/* Camera Bottom Controls */}
      <div className={`absolute bottom-0 w-full py-3 flex items-center justify-center bg-black/30 sm:bg-transparent rounded-xl ${photo ? "hidden" : ""}`}>
        <button
          onClick={capture}
          className="w-[60px] h-[60px] rounded-full border-2 grid place-content-center cursor-pointer active:scale-90 transition-all"
        >
          <div className="w-[50px] h-[50px] rounded-full bg-white"></div>
        </button>

        <button
          onClick={handleCameraMode}
          className="ml-4 p-2 rounded-full active:scale-90 hover:bg-white/10 transition"
          type="button"
        >
          <SwitchCamera className="text-[var(--textColor)]" />
        </button>
      </div>
    </div>

    {/* Canvas (Hidden) */}
    <canvas ref={canvasRef} style={{ display: "none" }} />

    {/* Captured Photo Preview */}
    {photo && (
      <div className="w-full mt-6 flex flex-col items-center gap-6">
        <img
          src={photo}
          alt="Captured"
          className="rounded-xl w-[90%] sm:w-[50%] transform -scale-x-100"
        />
      </div>
    )}

    {/* Action Buttons After Photo */}
    {photo && (
      <div className="flex flex-col gap-6 mt-8 items-center">
        <button
          onClick={() => setPhoto(null)}
          className="bg-[var(--wrapperColor)] border-2 border-[var(--borderColor)] rounded-2xl p-3 cursor-pointer hover:scale-95 transition"
        >
          <RefreshCcwIcon className="text-[var(--textColor)]" />
        </button>

        <div className="flex items-center gap-6">
          {clickedFromStory && (
            <button
              type="button"
              className="flex items-center gap-2 text-lg bg-[var(--textColor)] text-[var(--bgColor)] font-semibold py-2 px-4 rounded-xl cursor-pointer hover:scale-95 transition"
              onClick={() => {
                setCameraOpen && setCameraOpen(false);
                dispatch(setStoryImage(photo));
                dispatch(setStoryTextBg(photo));
                router.push("/create-story");
              }}
            >
              <PlusSquareIcon weight="light" size={30} />
              Add to Story
            </button>
          )}

          {clickedFromHome && (
            <button
              className="flex items-center gap-2 text-lg bg-[var(--textColor)] text-[var(--bgColor)] font-semibold py-2 px-4 rounded-xl cursor-pointer hover:scale-95 transition"
              type="button"
            >
              <PlusIcon strokeWidth={1} size={30} />
              Add Post
            </button>
          )}
        </div>
      </div>
    )}

    {/* Close Button */}
    <button
      onClick={() => setCameraOpen && setCameraOpen(false)}
      className="absolute top-3 left-3 rounded-full p-2 active:scale-90 hover:bg-white/10 transition"
      type="button"
    >
      <ArrowLeftIcon className="text-[var(--textColor)]" strokeWidth={2} size={30} />
    </button>
  </div>
);

}
