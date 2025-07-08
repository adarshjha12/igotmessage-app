import Image from "next/image";
import React from "react";
import grayImages from "../../json/Story images/grayscale.json";
import petImages from "../../json/Story images/pets.json";
import natureImages from "../../json/Story images/natural.json";
import patternImages from "../../json/Story images/pattern.json";
import cityImages from "../../json/Story images/city.json";
import { ImageIcon, SelectionIcon, ThumbsUpIcon } from "@phosphor-icons/react";
import { ChevronDown, Plus } from "lucide-react";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { setStoryImage, setStoryTextBg } from "@/features/storySlice";
import { number } from "zod";
import Skeleton from "react-loading-skeleton";

function StoryTemplates() {
  const dispatch = useDispatch();
  const [cityImagesShow, setCityImagesShow] = React.useState(false);
  const [grayImagesShow, setGrayImagesShow] = React.useState(false);
  const [petImagesShow, setPetImagesShow] = React.useState(false);
  const [natureImagesShow, setNatureImagesShow] = React.useState(false);
  const [patternImagesShow, setPatternImagesShow] = React.useState(false);
  const [loadedImagesCity, setLoadedImagesCity] = React.useState<{
    [key: number]: boolean;
  }>({});
  const [loadedImagesPets, setLoadedImagesPets] = React.useState<{
    [key: number]: boolean;
  }>({});
  const [loadedImagesNature, setLoadedImagesNature] = React.useState<{
    [key: number]: boolean;
  }>({});
  const [loadedImagesPattern, setLoadedImagesPattern] = React.useState<{
    [key: number]: boolean;
  }>({});
  const [loadedImagesGrayscale, setLoadedImagesGrayscale] = React.useState<{
    [key: number]: boolean;
  }>({});

  const handleImageLoad = (index: number, type: string) => {
    if (type === "city") {
      setLoadedImagesCity((prev) => ({ ...prev, [index]: true }));
    } else if (type === "pets") {
      setLoadedImagesPets((prev) => ({ ...prev, [index]: true }));
    } else if (type === "nature") {
      setLoadedImagesNature((prev) => ({ ...prev, [index]: true }));
    } else if (type === "pattern") {
      setLoadedImagesPattern((prev) => ({ ...prev, [index]: true }));
    } else if (type === "grayscale") {
      setLoadedImagesGrayscale((prev) => ({ ...prev, [index]: true }));
    }
  };

  return (
    <div className="w-full h-full rounded-2xl flex flex-col justify-center items-center">
      <hr className="w-[10%] my-6 h-[1px] bg-[var(--borderColor)]" />
      <div className="w-full flex px-2 gap-3 flex-col justify-center items-center">
        <div className="flex gap-2 justify-center items-center">
          <ImageIcon size={30} />
          <p className="text-xl text-center font-medium text-[var(--textColor)]">
            You can choose from here also
          </p>
        </div>
        {/* <hr className='w-full h-[1px] bg-[var(--borderColor)]'/> */}
        <div className="w-full flex gap-0 flex-col justify-center items-center">
          <div className="w-full flex px-3 flex-col items-start flex-wrap justify-center">
            <p
              className={` text-[var(--textColor)] pt-4 pb-2 font-semibold text-2xl`}
            >
              City
            </p>
            <div
              className={`flex gap-6 ${
                cityImagesShow
                  ? "overflow-auto down-slide h-full"
                  : "overflow-hidden h-[150px]"
              } flex-wrap justify-start items-center`}
            >
              {cityImages.sort((a, b) => a.url.localeCompare(b.url)).map((image, index) => (
                <div
                  key={index}
                  className="flex w-[150px] h-[150px] justify-center text-center items-center relative"
                >
                  <Image
                    onLoad={() => handleImageLoad(index, "city")}
                    style={
                      loadedImagesCity[index] ? { opacity: 1 } : { opacity: 0 }
                    }
                    className=" object-cover rounded-md"
                    src={image.url}
                    priority
                    sizes="150px"
                    fill
                    alt=""
                  />
                  {!loadedImagesCity[index] && (
                    <div className="absolute rounded-md w-full h-full flex justify-center items-center">
                      <ImageIcon size={30} />
                    </div>
                  )}
                  {loadedImagesCity[index] && (
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(setStoryImage(image.url));
                        dispatch(setStoryTextBg(image.url));
                      }}
                      className="absolute cursor-pointer active:scale-75 flex py-1 rounded-full px-2 bg-[var(--bgColor)]/50 backdrop-blur-sm justify-center items-center gap-2 bottom-2 z-20  text-[var(--textColor)]"
                    >
                      <Plus size={20} />
                      Select
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setCityImagesShow((prev) => !prev)}
              type="button"
              className="flex w-full bg-[var(--bgColor)]/50 backdrop-blur-sm px-2 py-2 active:scale-75 rounded-md justify-center gap-4 items-center cursor-pointer"
            >
              <p className="text-xl py-2 font-semibold text-[var(--textColor)]">
                {cityImagesShow ? "Show less" : "Show more"}
              </p>
              <ChevronDown
                size={25}
                className={`text-[var(--textColor)] ${
                  cityImagesShow ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          <div className="w-full flex px-3 flex-col items-start flex-wrap justify-center">
            <p
              className={` text-[var(--textColor)] pt-4 pb-2 font-semibold text-2xl`}
            >
              Pets
            </p>
            <div
              className={`flex gap-6 ${
                petImagesShow
                  ? "down-slide overflow-auto h-full"
                  : "overflow-hidden h-[150px]"
              } flex-wrap justify-start items-center`}
            >
              {petImages.map((image, index) => (
                <div
                  key={index}
                  className="flex w-[150px] h-[150px] justify-center text-center items-center relative"
                >
                  <Image
                    onLoad={() => handleImageLoad(index, "pets")}
                    style={
                      loadedImagesPets[index] ? { opacity: 1 } : { opacity: 0 }
                    }
                    className=" object-cover rounded-md"
                    src={image.url}
                    priority
                    sizes="150px"
                    fill
                    alt=""
                  />
                  {!loadedImagesPets[index] && (
                    <div className="absolute rounded-md w-full h-full flex justify-center items-center">
                      <ImageIcon size={30} />
                    </div>
                  )}
                  {loadedImagesPets[index] && (
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(setStoryImage(image.url));
                        dispatch(setStoryTextBg(image.url));
                      }}
                      className="absolute cursor-pointer active:scale-75 flex py-1 rounded-full px-2 bg-[var(--bgColor)]/50 backdrop-blur-sm justify-center items-center gap-2 bottom-2 z-20  text-[var(--textColor)]"
                    >
                      <Plus size={20} />
                      Select
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setPetImagesShow((prev) => !prev)}
              type="button"
              className="flex w-full bg-[var(--bgColor)]/50 backdrop-blur-sm px-2 py-2 active:scale-75 rounded-md justify-center gap-4 items-center cursor-pointer"
            >
              <p className="text-xl py-2 font-semibold text-[var(--textColor)]">
                {petImagesShow ? "Show less" : "Show more"}
              </p>
              <ChevronDown
                size={25}
                className={`text-[var(--textColor)] ${
                  petImagesShow ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          <div className="w-full flex px-3 flex-col items-start flex-wrap justify-center">
            <p
              className={` text-[var(--textColor)] pt-4 pb-2 font-semibold text-2xl`}
            >
              Nature
            </p>
            <div
              className={`flex gap-6 ${
                natureImagesShow
                  ? "down-slide overflow-auto h-full"
                  : "overflow-hidden h-[150px]"
              } flex-wrap justify-start items-center`}
            >
              {natureImages.map((image, index) => (
                <div
                  key={index}
                  className="flex w-[150px] h-[150px] justify-center text-center items-center relative"
                >
                  <Image
                    onLoad={() => handleImageLoad(index, "nature")}
                    style={
                      loadedImagesNature[index]
                        ? { opacity: 1 }
                        : { opacity: 0 }
                    }
                    className=" object-cover rounded-md"
                    src={image.url}
                    priority
                    sizes="150px"
                    fill
                    alt=""
                  />
                  {!loadedImagesNature[index] && (
                    <div className="absolute rounded-md w-full h-full flex justify-center items-center">
                      <ImageIcon size={30} />
                    </div>
                  )}
                  {loadedImagesNature[index] && (
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(setStoryImage(image.url));
                        dispatch(setStoryTextBg(image.url));
                      }}
                      className="absolute cursor-pointer active:scale-75 flex py-1 rounded-full px-2 bg-[var(--bgColor)]/50 backdrop-blur-sm justify-center items-center gap-2 bottom-2 z-20  text-[var(--textColor)]"
                    >
                      <Plus size={20} />
                      Select
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setNatureImagesShow((prev) => !prev)}
              type="button"
              className="flex w-full bg-[var(--bgColor)]/50 backdrop-blur-sm px-2 py-2 active:scale-75 rounded-md justify-center gap-4 items-center cursor-pointer"
            >
              <p className="text-xl py-2 font-semibold text-[var(--textColor)]">
                {natureImagesShow ? "Show less" : "Show more"}
              </p>
              <ChevronDown
                size={25}
                className={`text-[var(--textColor)] ${
                  natureImagesShow ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          <div className="w-full flex px-3 flex-col items-start flex-wrap justify-center">
            <p
              className={` text-[var(--textColor)] pt-4 pb-2 font-semibold text-2xl`}
            >
              Pattern
            </p>
            <div
              className={`flex gap-6 ${
                patternImagesShow
                  ? "down-slide overflow-auto h-full"
                  : "overflow-hidden h-[150px]"
              } flex-wrap justify-start items-center`}
            >
              {patternImages.map((image, index) => (
                <div
                  key={index}
                  className="flex w-[150px] h-[150px] justify-center text-center items-center relative"
                >
                  <Image
                    onLoad={() => handleImageLoad(index, "pattern")}
                    style={
                      loadedImagesPattern[index]
                        ? { opacity: 1 }
                        : { opacity: 0 }
                    }
                    className=" object-cover rounded-md"
                    src={image.url}
                    priority
                    sizes="150px"
                    fill
                    alt=""
                  />
                  {!loadedImagesPattern[index] && (
                    <div className="absolute rounded-md w-full h-full flex justify-center items-center">
                      <ImageIcon size={30} />
                    </div>
                  )}
                  {loadedImagesPattern[index] && (
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(setStoryImage(image.url));
                        dispatch(setStoryTextBg(image.url));
                      }}
                      className="absolute cursor-pointer active:scale-75 flex py-1 rounded-full px-2 bg-[var(--bgColor)]/50 backdrop-blur-sm justify-center items-center gap-2 bottom-2 z-20  text-[var(--textColor)]"
                    >
                      <Plus size={20} />
                      Select
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setPatternImagesShow((prev) => !prev)}
              type="button"
              className="flex w-full bg-[var(--bgColor)]/50 backdrop-blur-sm px-2 py-2 active:scale-75 rounded-md justify-center gap-4 items-center cursor-pointer"
            >
              <p className="text-xl py-2 font-semibold text-[var(--textColor)]">
                {patternImagesShow ? "Show less" : "Show more"}
              </p>
              <ChevronDown
                size={25}
                className={`text-[var(--textColor)] ${
                  patternImagesShow ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div className="w-full flex px-3 flex-col items-start flex-wrap justify-center">
            <p
              className={` text-[var(--textColor)] pt-4 pb-2 font-semibold text-2xl`}
            >
              Grayscale
            </p>
            <div
              className={`flex gap-6 ${
                grayImagesShow
                  ? "down-slide overflow-auto h-full"
                  : "overflow-hidden h-[150px]"
              } flex-wrap justify-start items-center`}
            >
              {grayImages.map((image, index) => (
                <div
                  key={index}
                  className="flex w-[150px] h-[150px] justify-center text-center items-center relative"
                >
                  <Image
                    onLoad={() => handleImageLoad(index, "grayscale")}
                    style={
                      loadedImagesGrayscale[index]
                        ? { opacity: 1 }
                        : { opacity: 0 }
                    }
                    className=" object-cover rounded-md"
                    src={image.url}
                    priority
                    sizes="150px"
                    fill
                    alt=""
                  />
                  {!loadedImagesGrayscale[index] && (
                    <div className="absolute rounded-md w-full h-full flex justify-center items-center">
                      <ImageIcon size={30} />
                    </div>
                  )}
                  {loadedImagesGrayscale[index] && (
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(setStoryImage(image.url));
                        dispatch(setStoryTextBg(image.url));
                      }}
                      className="absolute cursor-pointer active:scale-75 flex py-1 rounded-full px-2 bg-[var(--bgColor)]/50 backdrop-blur-sm justify-center items-center gap-2 bottom-2 z-20  text-[var(--textColor)]"
                    >
                      <Plus size={20} />
                      Select
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setGrayImagesShow((prev) => !prev)}
              type="button"
              className="flex w-full bg-[var(--bgColor)]/50 backdrop-blur-sm px-2 py-2 active:scale-75 rounded-md justify-center gap-4 items-center cursor-pointer"
            >
              <p className="text-xl py-2 font-semibold text-[var(--textColor)]">
                {grayImagesShow ? "Show less" : "Show more"}
              </p>
              <ChevronDown
                size={25}
                className={`text-[var(--textColor)] ${
                  grayImagesShow ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryTemplates;
