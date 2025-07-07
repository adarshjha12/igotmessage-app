"use client"; // Needed in Next.js 13/14 for client-side components

import { ArrowLeftIcon, PlusIcon, RefreshCcwIcon, SwitchCamera } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { PlusSquareIcon } from "@phosphor-icons/react";
import { useAppDispatch } from "@/store/hooks";
import { setStoryImage, setStoryTextBg } from "@/features/activitySlice";

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
    <div className="flex bg-black/50 w-screen h-full backdrop-blur-md fixed inset-0 z-40 overflow-y-auto  justify-start items-center flex-col">
      <div className="flex w-full pt-6 flex-col py-2 justify-center items-center  relative">
        <video
          className={`transform ${
            photo ? "hidden" : "rounded-xl"
          } h-full w-[90%] sm:w-[50%] -scale-x-100`}
          ref={videoRef}
          autoPlay
          playsInline
          muted
        />

        <div className="flex w-full py-2 right-slide sm:bg-transparent rounded-xl sm:-bottom-18 absolute bottom-0 justify-center items-center bg-black/30">
          <button
            className={`w-[60px] cursor-pointer  rounded-full h-[60px] grid place-content-center border-2 ${
              photo ? "hidden" : ""
            }`}
            onClick={capture}
          >
            <div className="w-[50px] h-[50px] rounded-full bg-white"></div>
          </button>

          <button
            onClick={handleCameraMode}
            className={`ml-3 cursor-pointer active:scale-75 active:bg-white/30 ${
              photo ? "hidden" : ""
            }`}
            type="button"
          >
            <SwitchCamera />
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {photo && (
        <div className=" w-full font-exo2 pt-4 mt-4 flex flex-col justify-start gap-8 items-center">
          <img
            src={photo}
            className={`rounded-xl w-[90%] sm:w-[50%] -scale-x-100`}
            alt="Captured"
          />
        </div>
      )}
      {photo && (
        <div className="flex w-fit justify-center py-8 items-center flex-col gap-8">
          <div>
            <button
              className="bg-[var(--wrapperColor)] border-2 border-[var(--borderColor)] cursor-pointer rounded-2xl p-3"
              type="button"
              onClick={() => setPhoto(null)}
            >
              <RefreshCcwIcon />
            </button>
          </div>
          <div className="flex items-center justify-center gap-10">
            {clickedFromStory && (
              <button
                type="button"
                className=" text-xl flex justify-center items-center bg-[var(--textColor)] text-[var(--bgColor)] rounded-xl font-medium active:scale-90 cursor-pointer py-2 px-3"
                onClick={() => {
                  setCameraOpen && setCameraOpen(false);
                  dispatch(setStoryImage(photo));
                  dispatch(setStoryTextBg(photo));
                  router.push("/create-story");
                }}
              >
                <PlusSquareIcon weight="light" size={40} />
                Add to Story
              </button>
            )}

            {clickedFromHome && (
              <button
                className=" text-xl flex justify-center items-center bg-[var(--textColor)] text-[var(--bgColor)] rounded-xl font-medium active:scale-90 cursor-pointer py-2 px-3"
                type="button"
              >
                <PlusIcon strokeWidth={1} size={40} />
                Add Post
              </button>
            )}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setCameraOpen && setCameraOpen(false)}
        className="fixed top-2 z-50 left-2 active:scale-90 rounded-full  text-red-500 cursor-pointer"
      >
        <ArrowLeftIcon
          className="text-[var(--textColor)] hover:text-green-700"
          strokeWidth={2}
          size={35}
        />
      </button>
    </div>
  );
}
