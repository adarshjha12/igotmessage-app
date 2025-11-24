"use client";
import "swiper/css";
import "swiper/css/pagination";
import {
  Download,
  MessageCircle,
  Play,
  Repeat2,
  Share2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Post } from "../post/Posts";
import axios from "axios";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { useSearchParams } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import NewLoader from "../NewLoader";
import { HeartIcon } from "@phosphor-icons/react";
import PopupWithLink from "../popups/PopupWithLink";
import Comment from "../post/Comment";

export default function ReelSlide({ reel }: { reel: Post }) {
  const [loaded, setLoaded] = useState(false);
  const params = useSearchParams();
  const myId = params.get("myId") as string;
  const myPic = params.get("myPic") as string;
  const [maxDuration, setMaxDuration] = useState(0);
  const reelRef = useRef<HTMLVideoElement | null>(null);
  const [currentlDuration, setCurrentlDuration] = useState(
    reelRef.current?.currentTime || 0
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);
  const [commentOpened, setCommentOpened] = useState(false);
  const [likeCount, setLikeCount] = useState(reel?.likes?.length ?? 0);
  const [showGuestError, setShowGuestError] = useState(false);
  const isGuest = useAppSelector((state) => state.auth.user.isGuest);
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const video = reelRef.current;
    if (!video) return;
    video.currentTime = Number(e.target.value);
  }

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}`;

  const handleLike = async () => {
    if (isGuest) {
      setShowGuestError(true);
      return;
    }
    const newLikeState = !likeClicked;
    setLikeClicked(newLikeState);
    setLikeCount((count) => count + (newLikeState ? 1 : -1));

    try {
      const res = await axios.post(
        `${url}/api/post/toggle-like`,
        { userId: myId, postId: reel._id },
        { withCredentials: true }
      );
      setLikeCount(res.data.likeCount);
    } catch (error) {
      console.error("toggle like error", error);
      // rollback in case of error
      setLikeClicked(!newLikeState);
      setLikeCount((count) => count + (newLikeState ? -1 : 1));
    }
  };

  useEffect(() => {
    if (!isGuest && reel.likes?.includes(myId)) {
      setLikeClicked(true);
    }
  }, [reel, myId]);

  function handleComment(reelId: string, myId: string) {
    if (commentOpened) {
      setCommentOpened(false);
    } else {
      setCommentOpened(true);
    }
  }

  function handlePlayPause() {
    if (!reelRef.current?.paused) {
      reelRef.current?.pause();
      setIsPlaying(false);
    } else {
      reelRef.current?.play();
      setIsPlaying(true);
    }
  }

  useEffect(() => {
    const video = reelRef.current;
    if (!video) return;

    let rafId: number;

    const handlePlaying = () => {
      setIsPlaying(true);
      // Start updating slider smoothly
      const updateProgress = () => {
        setCurrentlDuration(video.currentTime);
        rafId = requestAnimationFrame(updateProgress);
      };
      updateProgress();
    };

    const handlePause = () => {
      setIsPlaying(false);
      cancelAnimationFrame(rafId); // stop the loop when paused
    };

    const handleDuration = () => setMaxDuration(video.duration || 0);

    video.addEventListener("loadedmetadata", handleDuration);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("loadedmetadata", handleDuration);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const video = reelRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
            video.play();
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: [0.75] }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="w-full h-full bg-gray-700 flex flex-col gap-4 items-center justify-center text-gray-400">
          <div className="flex items-center animate-pulse px-2 py-6 border-2 border-white rounded-xl">
            <Play strokeWidth={1} className="w-12 h-12" />
          </div>
          <NewLoader color="white" />
        </div>
      )}

      <video
        ref={reelRef}
        src={reel?.mediaUrls?.[0]}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        playsInline
        loop
        onLoadedData={() => setLoaded(true)}
      />

      <button
        type="button"
        onClick={handlePlayPause}
        className="absolute inset-0 flex items-center justify-center"
      >
        {!isPlaying && loaded && (
          <div className="flex items-center p-4 bg-black/30 rounded-full">
            <Play strokeWidth={1.5} className="w-12 text-white h-12" />
          </div>
        )}
      </button>

      <Link
        href={`/public-profile/${reel?.user?._id}/myId/${myId}`}
        className="absolute bottom-10 left-4 flex items-center gap-3 px-3 py-2 rounded-2xl backdrop-blur-lg bg-black/10"
      >
        <img
          src={reel.user.profilePicture || reel.user.avatar}
          alt={reel.user.userName}
          width={44}
          height={44}
          className="rounded-full border border-white/50"
        />
        <div className="flex flex-col">
          <p className="text-white font-semibold text-base">
            @{reel.user.userName}
          </p>
          <span className="text-xs sm:text-xs text-white/60">
            {formatDistanceToNowStrict(new Date(reel?.createdAt ?? ""), {
              addSuffix: true,
            })}
          </span>
        </div>
      </Link>

      {/* reel duration visualization progress bar */}
      <div className="absolute bottom-4 w-full left-0 flex items-center gap-3 py-2 rounded-2xl ">
        <input
          type="range"
          value={currentlDuration}
          onChange={onChange}
          step={0.0001}
          min="0"
          max={maxDuration}
          style={{
            background: `linear-gradient(to right, white ${
              (currentlDuration / maxDuration) * 100
            }%, rgba(255,255,255,0.2) ${
              (currentlDuration / maxDuration) * 100
            }%`,
          }}
          className="
    w-full h-1 appearance-none
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:h-3
    [&::-webkit-slider-thumb]:w-3
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-white
    [&::-webkit-slider-thumb]:mt-[-4px]
    [&::-webkit-slider-runnable-track]:h-1.5
    [&::-webkit-slider-runnable-track]:rounded-full
  "
        />
      </div>

      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5">
        {/* Like Button */}
        <div
          onClick={() => handleLike()}
          className={`flex flex-col items-center px-3 py-2 rounded-xl backdrop-blur-lg hover:scale-110 transition cursor-pointer text-white`}
        >
          {likeClicked ? (
            <HeartIcon
              size={26}
              weight="fill"
              className="text-rose-500 scale-125"
            />
          ) : (
            <HeartIcon
              size={26}
              weight="regular"
              className="text-[var(--textColor)] scale-110"
            />
          )}
          <span className="text-xs mt-1">{likeCount}</span>
        </div>

        {/* Comment Button */}
        <div
          onClick={() => handleComment(reel._id, myId)}
          className="flex flex-col items-center px-3 py-2 rounded-xl backdrop-blur-lg hover:scale-110 transition cursor-pointer text-white bg-black/10"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs mt-1">{reel.comments?.length}</span>
        </div>

        {/* Save Button */}
        <div
          onClick={() => setSaveButtonClicked(!saveButtonClicked)}
          className="flex items-center justify-center p-3 rounded-full backdrop-blur-lg hover:scale-110 transition cursor-pointer text-white bg-black/10"
        >
          <Download className="w-6 h-6" />
        </div>
      </div>
      {showGuestError && (
        <PopupWithLink
          linkHref="/login"
          linkText="signup"
          type="error"
          message="Sorry, Guest users can't like"
          show={showGuestError}
          onClose={() => setShowGuestError(false)}
        />
      )}

      {commentOpened && (
        <div className="fixed inset-0 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          {/* Close button */}
          <button
            onClick={() => setCommentOpened(false)}
            className="fixed inset-0 z-10 rounded-full"
          ></button>

          <div className="relative w-full z-20 max-w-md max-h-[90vh] bg-[var(--wrapperColor)] pt-10 mb-12 rounded-2xl shadow-xl overflow-y-auto">
            {/* Comment Section */}
            <div className="p-4">
              <Comment postId={reel._id} myPic={myPic} />
            </div>
          </div>
        </div>
      )}

      {saveButtonClicked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-[90%] max-w-md bg-gradient-to-br from-[var(--wrapperColor)]/90 to-gray-800/80 rounded-2xl shadow-2xl border border-white/10 p-6 text-center animate-scaleIn">
            {/* Title */}
            <h2 className="text-white text-lg font-semibold mb-2">
              Download this video?
            </h2>
            <p className="text-gray-300 text-sm mb-6">
              Do you want to save this video to your device?
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-8">
              <button
                onClick={() => setSaveButtonClicked(false)}
                className="px-4 py-1 flex items-center rounded-xl bg-gradient-to-r from-red-400 to-red-800 hover:bg-red-600 transition text-white gap-2 font-semibold shadow-md"
              >
                <div className="p-2 rounded-full bg-black/10 flex items-center justify-center">
                  <X />
                </div>
                <span>Cancel</span>
              </button>

              <a
                href={reel.mediaUrls?.[0]} // <-- your file URL here
                download
                onClick={() => setSaveButtonClicked(false)}
                className="px-4 py-1 flex items-center rounded-xl bg-gradient-to-r from-green-400 to-green-800 hover:bg-green-600 transition text-white gap-2 font-semibold shadow-md"
              >
                <div className="p-2 rounded-full bg-black/10 flex items-center justify-center">
                  <Download />
                </div>
                <span>Download</span>
              </a>
            </div>
           
          </div>
        </div>
      )}
    </div>
  );
}
