import React, { useEffect, useState, useRef } from "react";
import musicData from "../../json/music.json";
import {
  CheckIcon,
  FilterIcon,
  Guitar,
  Music2,
  PauseIcon,
  Piano,
  Play,
  Plus,
  SortAsc,
  SortDesc,
  Speaker,
} from "lucide-react";
import Image from "next/image";
import AudioBars from "../AudioBar";
import { useAppDispatch } from "@/store/hooks";
import { setMusicData } from "@/features/storySlice";
import NewLoader from "../NewLoader";

interface Props {
  setMusicModal?: (value: boolean) => void;
  setChevronActive?: (value: boolean) => void;
  muteMusicOfParent?: (value: "yes" | "no") => void;
  postFeed?: boolean;
  setMusicDataForPost?: (value: any) => void;
}

function MusicComponent({
  setMusicModal,
  setChevronActive,
  muteMusicOfParent,
  postFeed,
  setMusicDataForPost,
}: Props) {
  const dispatch = useAppDispatch();

  const [showSortPopup, setShowSortPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  const [allButtonActive, setAllButtonActive] = useState(true);
  const [bollywoodButtonActive, setBollywoodButtonActive] = useState(false);
  const [rockButtonActive, setRockButtonActive] = useState(false);

  const [aToZActive, setAToZActive] = useState(true);

  const [musicSource, setMusicSource] = useState({
    playing: false,
    index: -1,
    url: "",
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlaying = () => setIsActuallyPlaying(true);
    const handleWaiting = () => setIsActuallyPlaying(false);
    const handlePause = () => setIsActuallyPlaying(false);
    const handleEnded = () => setIsActuallyPlaying(false);

    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (musicSource && audioRef.current) {
      audioRef.current.src = musicSource.url;
      audioRef.current.play().catch(() => {});
      !audioRef.current.paused &&
        setMusicSource((prev) => ({ ...prev, playing: true }));
      muteMusicOfParent && muteMusicOfParent("yes");
    }
  }, [musicSource.url]);

  const handlePlayPause = (url: string, index: number) => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setMusicSource({ index, playing: false, url });
    } else if (
      audioRef.current &&
      audioRef.current.paused &&
      url === audioRef.current.src
    ) {
      audioRef.current.play().catch(() => {});
      !audioRef.current.paused && setMusicSource({ index, playing: true, url });
      muteMusicOfParent && muteMusicOfParent("yes");
    } else {
      setMusicSource({ index, playing: false, url });
    }
  };

  return (
    <div className="flex flex-col h-full w-full rounded-2xl p-4 sm:p-2 gap-4 sm:gap-2 bg-[var(--bgColor)]/60 backdrop-blur-md text-[var(--textColor)] overflow-y-auto">
      {/* Header */}
      {!postFeed && (
        <div className="flex items-center justify-center gap-3 sm:gap-2 p-3 sm:p-2 rounded-2xl bg-[var(--bgColor)]/40 shadow-sm">
          <Music2
            size={32}
            strokeWidth={1.5}
            className="text-red-500 sm:size-6"
          />
          <p className="text-xl sm:text-sm font-semibold">
            Select your favourite music
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4 sm:gap-2 justify-center">
        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSortPopup((prev) => !prev);
              setShowFilterPopup(false);
            }}
            className="flex flex-col items-center gap-1 sm:gap-0.5 px-3 py-2 sm:px-2 sm:py-1 rounded-xl hover:bg-[var(--borderColor)]/10 transition"
          >
            <div className="flex items-center gap-2 sm:gap-1">
              {aToZActive ? (
                <SortAsc size={22} strokeWidth={1.5} className="sm:size-4" />
              ) : (
                <SortDesc size={22} strokeWidth={1.5} className="sm:size-4" />
              )}
              <p className="text-lg sm:text-xs font-medium">Sort</p>
            </div>
            <p className="px-2 text-xs sm:text-[10px] border rounded-md border-[var(--borderColor)]">
              {aToZActive ? "A-Z" : "Z-A"}
            </p>
          </button>

          {/* Sort Popup */}
          {showSortPopup && (
            <div className="fixed inset-x-0 top-[40%] z-40 mx-auto w-[280px] sm:w-[220px] p-4 sm:p-2 rounded-2xl bg-[var(--wrapperColor)] text-[var(--textColor)] shadow-lg backdrop-blur-sm flex flex-col items-center">
              <button
                onClick={() => setAToZActive(true)}
                className={`w-full flex items-center gap-2 sm:gap-1 p-2 sm:p-1 rounded-xl border border-[var(--borderColor)] mb-2 transition active:scale-95 ${
                  aToZActive
                    ? "bg-[var(--textColor)] text-[var(--bgColor)] font-semibold"
                    : ""
                }`}
              >
                <SortAsc size={22} className="sm:size-4" /> A-Z
              </button>
              <button
                onClick={() => setAToZActive(false)}
                className={`w-full flex items-center gap-2 sm:gap-1 p-2 sm:p-1 rounded-xl border border-[var(--borderColor)] mb-2 transition active:scale-95 ${
                  !aToZActive
                    ? "bg-[var(--textColor)] text-[var(--bgColor)] font-semibold"
                    : ""
                }`}
              >
                <SortDesc size={22} className="sm:size-4" /> Z-A
              </button>
              <button
                onClick={() => setShowSortPopup(false)}
                className="mt-3 sm:mt-2 px-4 sm:px-2 py-2 sm:py-1 rounded-lg bg-blue-600 text-white flex items-center gap-2 sm:gap-1 active:scale-95 text-sm sm:text-xs"
              >
                <CheckIcon size={18} className="sm:size-4" /> Done
              </button>
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowFilterPopup((prev) => !prev);
              setShowSortPopup(false);
            }}
            className="flex flex-col items-center gap-1 sm:gap-0.5 px-3 py-2 sm:px-2 sm:py-1 rounded-xl hover:bg-[var(--borderColor)]/10 transition"
          >
            <div className="flex items-center gap-2 sm:gap-1">
              <FilterIcon size={22} strokeWidth={1.5} className="sm:size-4" />
              <p className="text-lg sm:text-xs font-medium">Filter</p>
            </div>
            <p className="px-2 text-xs sm:text-[10px] border rounded-md border-[var(--borderColor)]">
              {allButtonActive
                ? "All"
                : bollywoodButtonActive
                ? "Bollywood"
                : "Rock"}
            </p>
          </button>

          {/* Filter Popup */}
          {showFilterPopup && (
            <div className="fixed inset-x-0 top-[40%] z-40 mx-auto w-[280px] sm:w-[220px] p-4 sm:p-2 rounded-2xl bg-[var(--wrapperColor)] text-[var(--textColor)] shadow-lg backdrop-blur-sm flex flex-col items-center">
              <button
                onClick={() => {
                  setAllButtonActive(true);
                  setBollywoodButtonActive(false);
                  setRockButtonActive(false);
                }}
                className={`w-full flex items-center gap-2 sm:gap-1 p-2 sm:p-1 rounded-xl border border-[var(--borderColor)] mb-2 transition active:scale-95 ${
                  allButtonActive
                    ? "bg-[var(--textColor)] text-[var(--bgColor)] font-semibold"
                    : ""
                }`}
              >
                <Piano size={22} className="sm:size-4" /> All
              </button>
              <button
                onClick={() => {
                  setBollywoodButtonActive(true);
                  setAllButtonActive(false);
                  setRockButtonActive(false);
                }}
                className={`w-full flex items-center gap-2 sm:gap-1 p-2 sm:p-1 rounded-xl border border-[var(--borderColor)] mb-2 transition active:scale-95 ${
                  bollywoodButtonActive
                    ? "bg-[var(--textColor)] text-[var(--bgColor)] font-semibold"
                    : ""
                }`}
              >
                <Speaker size={22} className="sm:size-4" /> Bollywood
              </button>
              <button
                onClick={() => {
                  setRockButtonActive(true);
                  setAllButtonActive(false);
                  setBollywoodButtonActive(false);
                }}
                className={`w-full flex items-center gap-2 sm:gap-1 p-2 sm:p-1 rounded-xl border border-[var(--borderColor)] mb-2 transition active:scale-95 ${
                  rockButtonActive
                    ? "bg-[var(--textColor)] text-[var(--bgColor)] font-semibold"
                    : ""
                }`}
              >
                <Guitar size={22} className="sm:size-4" /> Rock
              </button>
              <button
                onClick={() => setShowFilterPopup(false)}
                className="mt-3 sm:mt-2 px-4 sm:px-2 py-2 sm:py-1 rounded-lg bg-blue-600 text-white flex items-center gap-2 sm:gap-1 active:scale-95 text-sm sm:text-xs"
              >
                <CheckIcon size={18} className="sm:size-4" /> Done
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Music List */}
      <div className="flex flex-col gap-3 sm:gap-2">
        {musicData
          .filter((item) => {
            if (allButtonActive) return true;
            if (bollywoodButtonActive)
              return item.genre.startsWith("Bollywood");
            if (rockButtonActive) return item.genre.startsWith("Rock");
            return false;
          })
          .sort((a, b) =>
            aToZActive
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title)
          )
          .map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 sm:gap-2 p-3 sm:p-2 rounded-xl border border-[var(--borderColor)] bg-[var(--bgColor)]/20 shadow-sm"
            >
              {/* Left: Artwork + Play/Pause */}
              <div className="flex items-center gap-3 sm:gap-2">
                <Image
                  src={item.image}
                  alt="artist"
                  width={40}
                  height={40}
                  className="rounded-lg w-10 h-10 sm:w-8 sm:h-8"
                />
                <button
                  type="button"
                  onClick={() => handlePlayPause(item.url, index)}
                  className="p-2 sm:p-1 rounded-full hover:bg-[var(--borderColor)]/20 transition"
                >
                  {musicSource.index === index && musicSource.playing ? (
                    <PauseIcon size={22} className="sm:size-4" />
                  ) : (
                    <Play size={22} className="sm:size-4" />
                  )}
                </button>
                {musicSource.index === index &&
                  musicSource.playing &&
                  (isActuallyPlaying ? <AudioBars /> : <NewLoader color="[var(--textColor)]"/>)}
              </div>

              {/* Middle: Song Name */}
              <div className="flex-1 overflow-hidden">
                <p
                  className={`truncate text-sm sm:text-xs font-medium ${
                    musicSource.index === index && musicSource.playing
                      ? "text-blue-500"
                      : ""
                  }`}
                >
                  {item.title.split("-")[0].slice(0, 25)}
                </p>
              </div>

              {/* Right: Select */}
              <button
                onClick={() => {
                  if (postFeed) {
                    setMusicDataForPost?.(item);
                  } else {
                    setMusicModal && setMusicModal(false);
                    setChevronActive && setChevronActive(false);
                    dispatch(setMusicData(item));
                  }
                }}
                className="p-2 sm:p-1 rounded-full hover:bg-[var(--borderColor)]/20 transition"
              >
                <Plus size={22} className="sm:size-4" />
              </button>
            </div>
          ))}
      </div>

      {/* Overlay */}
      {(showSortPopup || showFilterPopup) && (
        <div
          onClick={() => {
            setShowSortPopup(false);
            setShowFilterPopup(false);
          }}
          className="fixed inset-0 z-30 bg-black/60"
        ></div>
      )}

      {/* Hidden Audio */}
      <audio ref={audioRef} hidden loop />
    </div>
  );
}

export default MusicComponent;
