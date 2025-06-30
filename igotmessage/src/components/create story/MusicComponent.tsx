import React, { useEffect, useState } from "react";
import musicData from "../../json/music.json";
import {
  CheckIcon,
  DrumIcon,
  FilterIcon,
  Guitar,
  LucidePause,
  Music2,
  PauseCircle,
  PauseIcon,
  PauseOctagon,
  Piano,
  Play,
  PlayCircle,
  PlayIcon,
  Plus,
  SortAsc,
  SortAscIcon,
  SortDesc,
  SortDescIcon,
  Speaker,
} from "lucide-react";
import Image from "next/image";
import { PauseCircleIcon, PlusIcon } from "@phosphor-icons/react";
import { number } from "zod";
import { useRef } from "react";
import AudioBars from "../AudioBar";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { setMusicData } from "@/features/activitySlice";
import NewLoader from "../NewLoader";
import { useRouter } from "next/navigation";

interface Props {
  setMusicModal?: (value: boolean) => void;
  setChevronActive?: (value: boolean) => void;
  muteMusicOfParent?: (value: "yes" | "no") => void;
}
function MusicComponent({
  setMusicModal,
  setChevronActive,
  muteMusicOfParent,
}: Props) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [showSortPopup, setShowSortPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [allButtonActive, setAllButtonActive] = useState(true);
  const [bollywoodButtonActive, setBollywoodButtonActive] = useState(false);
  const [rockButtonActive, setRockButtonActive] = useState(false);

  const [aToZActive, setAToZActive] = useState(true);
  const [zToAActive, setZToAActive] = useState(false);
  const [doneClick, setDoneClick] = useState(false);

  const [musicSource, setMusicSource] = useState({
    playing: false,
    index: -1,
    url: "",
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  console.log(audioRef);

  useEffect(() => {
    if (musicSource && audioRef.current) {
      audioRef.current.src = musicSource.url;
      audioRef.current.play().catch((err) => {
        console.warn("Play was interrupted:", err);
      });
      !audioRef.current.paused && setMusicSource({ ...musicSource, playing: true });
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
      audioRef.current.play().catch((err) => {
        console.warn("Play was interrupted:", err);
      });
      !audioRef.current.paused && setMusicSource({ index, playing: true, url });
    } else {
      setMusicSource({ index, playing: false, url });
    }
  };

  return (
    <div className="flex scroll-smooth h-full overflow-y-auto rounded-2xl w-full sm:w-full border-1 py-2 flex-col items-center px-2 sm:px-4 justify-start  bg-[var(--bgColor)]/50 backdrop-blur-md  text-[var(--text-color)] gap-2">
      <div className="flex flex-col justify-center items-center">
        <p className="flex text-xl text-center bg-[var(--bgColor)]/50 rounded-2xl px-2 font-semibold items-center py-2 mb-4 justify-center">
          <Music2 size={40} strokeWidth={1.5} /> Select your favourite music
        </p>
        <div className="flex gap-2 w-full justify-evenly items-start">
          <div className="relative">
            <button
              onClick={() => {
                setShowSortPopup((prev) => !prev);
                setShowFilterPopup(false);
              }}
              className="flex flex-col cursor-pointer p-2 active:scale-75 gap-1 justify-center items-center"
            >
              {" "}
              <div className="flex gap-2 justify-center items-center">
                {aToZActive ? (
                  <SortAsc size={30} strokeWidth={1} />
                ) : (
                  <SortDesc size={25} strokeWidth={1} />
                )}
                <p className="text-2xl">Sort</p>
              </div>
              <p className="border-1 px-2 text-[12px] border-[var(--borderColor)] rounded-md">
                {aToZActive ? "A-Z" : "Z-A"}
              </p>
            </button>
            {showSortPopup && (
              <div className="fixed w-full z-40 py-6 px-12 rounded-2xl top-[40%] left-0 bg-[var(--wrapperColor)] text-[var(--textColor)] backdrop-blur-sm flex flex-col justify-center items-center">
                <button
                  onClick={() => {
                    setAToZActive(true);
                    setZToAActive(false);
                  }}
                  className={`mb-2 w-[200px] flex justify-center items-center gap-2 border border-[var(--borderColor)] py-2 rounded-xl cursor-pointer active:scale-90 transition-all duration-150 ${
                    aToZActive
                      ? "bg-[var(--textColor)] text-[var(--bgColor)] font-semibold text-xl"
                      : ""
                  }`}
                >
                  <SortAsc size={30} strokeWidth={1} />
                  <p>A-Z</p>
                </button>

                <button
                  onClick={() => {
                    setZToAActive(true);
                    setAToZActive(false);
                  }}
                  className={`mb-2 w-[200px] px-10 flex justify-center items-center gap-2 border border-[var(--borderColor)] py-2 rounded-xl cursor-pointer active:scale-90 transition-all duration-150 ${
                    zToAActive
                      ? "bg-[var(--textColor)] text-[var(--bgColor)] font-semibold text-xl"
                      : ""
                  }`}
                >
                  <SortDescIcon size={30} strokeWidth={1} />
                  <p>Z-A</p>
                </button>

                <button
                  onClick={() => {
                    setShowFilterPopup(false);
                    setDoneClick(true);
                    setShowSortPopup(false);
                  }}
                  className="flex justify-center items-center gap-2 border-1 border-[var(--bgColor)] bg-blue-700 cursor-pointer active:scale-75 py-1 px-3 w-fit rounded-md text-white mt-4"
                >
                  {" "}
                  <CheckIcon strokeWidth={1} size={20} /> Done
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowFilterPopup((prev) => !prev);
                setShowSortPopup(false);
              }}
              className="flex flex-col cursor-pointer p-2 active:scale-75 gap-1 justify-end items-center"
            >
              {" "}
              <div className="flex gap-2 justify-center items-center">
                <FilterIcon size={25} strokeWidth={1} />
                <p className="text-2xl">Filter</p>
              </div>
              <p className="border-1 px-2 text-[12px] border-[var(--borderColor)] rounded-md">
                {allButtonActive
                  ? "All"
                  : bollywoodButtonActive
                  ? "Bollywood"
                  : "Rock"}
              </p>
            </button>
            {showFilterPopup && (
              <div className="fixed z-40 py-6 px-12 w-full rounded-2xl left-0 top-[40%] bg-[var(--wrapperColor)] text-[var(--textColor)] backdrop-blur-sm flex flex-col justify-center items-center">
                <button
                  onClick={() => {
                    setAllButtonActive(true);
                    setBollywoodButtonActive(false);
                    setRockButtonActive(false);
                  }}
                  className={`mb-2 border-1 w-full flex justify-start items-center gap-2 border-[var(--borderColor)] cursor-pointer active:scale-95 py-2 pr-28 pl-2 rounded-md ${
                    allButtonActive
                      ? "bg-[var(--textColor)] text-[var(--bgColor)] font-semibold text-xl"
                      : ""
                  }`}
                >
                  <Piano size={30} strokeWidth={1} /> All
                </button>
                <button
                  onClick={() => {
                    setBollywoodButtonActive(true);
                    setAllButtonActive(false);
                    setRockButtonActive(false);
                  }}
                  className={`mb-2 pr-28 pl-2 border-1 flex justify-start items-center gap-2 border-[var(--borderColor)] ${
                    bollywoodButtonActive
                      ? "bg-[var(--textColor)] text-[var(--bgColor)] font-semibold text-xl"
                      : ""
                  } cursor-pointer active:scale-95 py-2 w-full rounded-md`}
                >
                  <Speaker size={30} strokeWidth={1} /> BollyWood
                </button>
                <button
                  onClick={() => {
                    setBollywoodButtonActive(false);
                    setAllButtonActive(false);
                    setRockButtonActive(true);
                  }}
                  className={`mb-2 pr-28 pl-2 flex w-full justify-start items-center gap-2 border-1 border-[var(--borderColor)] ${
                    rockButtonActive
                      ? "bg-[var(--textColor)] text-[var(--bgColor)] font-semibold text-xl"
                      : ""
                  } cursor-pointer active:scale-95 py-2  rounded-md`}
                >
                  <Guitar size={30} strokeWidth={1} /> Rock
                </button>
                <button
                  onClick={() => {
                    setShowFilterPopup(false);
                    setDoneClick(true);
                    setShowSortPopup(false);
                  }}
                  className="flex justify-center items-center gap-2 border-1 border-[var(--bgColor)] bg-blue-800 cursor-pointer active:scale-75 py-1 px-3 w-fit rounded-md text-white mt-4"
                >
                  {" "}
                  <CheckIcon strokeWidth={1} size={20} /> Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
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
            <span
              key={index}
              className="flex w-full h-fit items-center justify-between gap-2 px-2 border-1 border-[var(--borderColor)] bg-[var(--bgColor)]/15 rounded-xl mb-3"
            >
              <div className="flex items-center gap-2 px-2">
                <Image
                  src={item.image}
                  className="rounded-sm w-8 h-8"
                  width={40}
                  height={40}
                  alt="music artist"
                />

                <button
                  type="button"
                  onClick={(e) => handlePlayPause(item.url, index)}
                  className="flex items-center justify-center cursor-pointer"
                >
                  {musicSource.index === index && musicSource.playing ? (
                    <PauseIcon size={30} strokeWidth={1} />
                  ) : (
                    <Play size={30} strokeWidth={1} />
                  )}
                </button>

                <div
                  className={`${
                    musicSource.playing && musicSource.index === index
                      ? "scale-100 opacity-100 z-30"
                      : "scale-100 opacity-0"
                  }`}
                >
                  {musicSource.playing === true &&
                  index === musicSource.index ? (
                    <AudioBars />
                  ) : (
                    <NewLoader />
                  )}
                </div>
              </div>

              <div className="overflow-hidden">
                <p
                  className={`text-end text-nowrap text-[15px] ${
                    musicSource.index === index && musicSource.playing
                      ? "translate-animation"
                      : ""
                  }`}
                >
                  {item.title
                    .split("-")
                    .slice(0, 3)
                    .join("-")
                    .split("_")[0]
                    .slice(0, 20) + "..."}
                </p>
              </div>

              <button
                onClick={() => {
                  setMusicModal && setMusicModal(false);
                  setChevronActive && setChevronActive(false);
                  dispatch(setMusicData(item));
                }}
                className="flex rounded-full active:bg-[var(--wrapperColor)] active:scale-50 p-1 items-center justify-center cursor-pointer"
              >
                <Plus size={35} strokeWidth={1} className="inline ml-auto" />
              </button>
            </span>
          ))}
      </div>

      {showSortPopup || showFilterPopup ? (
        <div
          onClick={() => {
            setShowSortPopup(false);
            setShowFilterPopup(false);
          }}
          className="fixed w-full h-screen inset-0 z-30 bg-black/70"
        ></div>
      ) : null}

      {/* hidden music player */}
      <audio
        controls
        autoPlay={false}
        loop
        // src={musicSource.url || undefined}
        className="fixed top-6"
        ref={audioRef}
      ></audio>
    </div>
  );
}

export default MusicComponent;
