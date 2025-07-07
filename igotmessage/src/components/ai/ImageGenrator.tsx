"use client";

import React, { useEffect, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import AIFeatureUnavailableModal from "../modals/ModalTwo";

const placeholderSuggestions = [
  "Search man on mars",
  "Fish playing cricket",
  "Cat in a detective hat",
  "Robot making pizza",
  "Ancient castle in space",
  "Alien DJ at a party",
];

interface Props {
  story?: boolean;
  post?: boolean;
  setAiButtonClicked: (val: boolean) => void;
}
function ImageGenerator({ story, post, setAiButtonClicked }: Props) {
  const [input, setInput] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [generateClicked, setGenerateClicked] = useState(false);

  // Typing animation effect
  useEffect(() => {
    const currentWord = placeholderSuggestions[wordIndex];
    const timeout = setTimeout(() => {
      setPlaceholder(currentWord.slice(0, charIndex + 1));
      setCharIndex((prev) => prev + 1);
    }, 50);

    if (charIndex === currentWord.length) {
      // Pause before going to next word
      setTimeout(() => {
        setCharIndex(0);
        setWordIndex((prev) => (prev + 1) % placeholderSuggestions.length);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, wordIndex]);

  const handleGenerate = () => {
    setGenerateClicked(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bgColor)] text-[var(--textColor)] flex flex-col items-center justify-start px-4 pt-20 space-y-8">
      <h1 className="text-3xl font-bold text-[var(--textColor)] flex items-center gap-2">
        <Sparkles className="text-blue-400" />
        AI Story Generator
      </h1>

      <div className="w-full max-w-xl flex flex-col items-center space-y-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder={`"` + placeholder +`"` }
            className="w-full pl-10 pr-4 py-3 rounded-xl  text-[var(--textColor)] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder:text-gray-500"
          />
        </div>

        <button
          onClick={handleGenerate}
          className="bg-gradient-to-r from-blue-500 to-blue-900 transition-all duration-200 px-6 py-3 rounded-xl text-white font-semibold flex active:scale-90 cursor-pointer items-center gap-2"
        >
          <Sparkles size={18} />
          Generate
        </button>
      </div>
      {generateClicked  && 
      <AIFeatureUnavailableModal setShowModal={setGenerateClicked} setAiButtonClicked={setAiButtonClicked}/>
      }
    </div>
  );
}

export default ImageGenerator;
