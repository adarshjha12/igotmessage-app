"use client";

import Image from "next/image";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";
import { ImageIcon } from "@phosphor-icons/react";
import { useAppDispatch } from "@/store/hooks";
import { setStoryImage, setStoryTextBg } from "@/features/storySlice";

// JSON imports
import grayImages from "../../json/Story images/grayscale.json";
import petImages from "../../json/Story images/pets.json";
import natureImages from "../../json/Story images/natural.json";
import patternImages from "../../json/Story images/pattern.json";
import cityImages from "../../json/Story images/city.json";

interface Props {
  feedPost?: boolean;
  setTemplateImage?: (url: string) => void;
}

interface SectionProps {
  title: string;
  images: { url: string }[];
  feedPost?: boolean;
  setTemplateImage?: (url: string) => void;
  defaultOpen?: boolean;
}

const ImageSection: React.FC<SectionProps> = ({
  title,
  images,
  feedPost,
  setTemplateImage,
  defaultOpen,
}) => {
  const dispatch = useAppDispatch();
  const [show, setShow] = React.useState(!!defaultOpen);
  const [loaded, setLoaded] = React.useState<{ [key: number]: boolean }>({});

  return (
    <div className="w-full flex flex-col gap-3 mb-6">
      <button
        onClick={() => setShow((prev) => !prev)}
        className="flex w-full items-center justify-between px-2 py-2 rounded-xl hover:bg-[var(--borderColor)]/10 transition"
      >
        <p className="text-xl sm:text-lg font-semibold text-[var(--textColor)]">
          {title}
        </p>
        <ChevronDown
          size={22}
          className={`sm:w-4 sm:h-4 text-[var(--textColor)] transition-transform ${
            show ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {show && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-4 px-2"
          >
            {images
              .sort((a, b) => a.url.localeCompare(b.url))
              .map((image, index) => (
                <div
                  key={index}
                  className="relative group aspect-square w-28 sm:w-20 rounded-xl sm:rounded-lg overflow-hidden shadow-md"
                >
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    className={`object-cover transition-opacity duration-500 ${
                      loaded[index] ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() =>
                      setLoaded((prev) => ({ ...prev, [index]: true }))
                    }
                  />

                  {!loaded[index] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200/20">
                      <ImageIcon className="w-7 h-7 sm:w-5 sm:h-5" />
                    </div>
                  )}

                  {loaded[index] && (
                    <button
                      type="button"
                      onClick={() => {
                        if (feedPost) {
                          setTemplateImage?.(image.url);
                        } else {
                          dispatch(setStoryImage(image.url));
                          dispatch(setStoryTextBg(image.url));
                        }
                      }}
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 sm:px-2 py-1.5 sm:py-1 
                                 flex items-center gap-1 rounded-full bg-[var(--bgColor)]/70 backdrop-blur-sm 
                                 text-sm sm:text-xs font-medium text-[var(--textColor)] 
                                 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Plus className="w-4 h-4 sm:w-3 sm:h-3" />
                      Select
                    </button>
                  )}
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function StoryTemplates({ feedPost, setTemplateImage }: Props) {
  const sections = [
    { title: "City", images: cityImages, defaultOpen: true },
    { title: "Pets", images: petImages },
    { title: "Nature", images: natureImages },
    { title: "Pattern", images: patternImages },
    { title: "Grayscale", images: grayImages },
  ];

  return (
    <div className="w-full h-full rounded-2xl flex flex-col justify-start items-center p-4 sm:p-2">
      <div className="flex gap-2 items-center mb-4">
        <ImageIcon className="w-7 h-7 sm:w-5 sm:h-5 text-red-500" />
        <p className="text-2xl sm:text-lg font-semibold tracking-wide text-[var(--textColor)]">
          Image Library
        </p>
      </div>

      <div className="w-full flex flex-col">
        {sections.map((section, i) => (
          <ImageSection
            key={i}
            title={section.title}
            images={section.images}
            feedPost={feedPost}
            setTemplateImage={setTemplateImage}
            defaultOpen={section.defaultOpen}
          />
        ))}
      </div>
    </div>
  );
}

export default StoryTemplates;
