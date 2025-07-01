import React, { useState } from "react";

import TextareaAutosize from "react-textarea-autosize";
import { HexColorPicker } from "react-colorful";
import { PaintBrushBroadIcon } from "@phosphor-icons/react";
import { ItalicIcon, TextIcon, UnderlineIcon } from "lucide-react";

function StoryText() {
  const [fontSize, setFontSize] = useState("50");
  const [weight, setWeight] = useState<"normal" | "bold">("normal");
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [color, setColor] = useState("white");
  const [bgColor, setBgColor] = useState("#481bba");
  const [bgOpacity, setBgOpacity] = useState(1);

  const [paintBrushClicked, setPaintBrushClicked] = useState(false);
  const [fontWeightClicked, setFontWeightClicked] = useState(false);
  const [fontStyleClicked, setFontStyleClicked] = useState(false);
  const [fontUnderlineClicked, setFontUnderlineClicked] = useState(false);
  const [fontColorClicked, setFontColorClicked] = useState(false);
  const [fontItalicClicked, setFontItalicClicked] = useState(false);
  const [fontSizeClicked, setFontSizeClicked] = useState(false);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex w-full sm:w-[60%] md:w-[50%] p-2 items-center text-3xl text-[var(--textColor)] justify-between">
        <button
          onClick={() => setPaintBrushClicked((prev) => !prev)}
          className="p-2 rounded-full active:scale-90 active:bg-[var(--wrapperColor)] cursor-pointer"
          type="button"
        >
          <div
            style={{ backgroundColor: bgColor }}
            className={`h-8 w-8 rounded-full border-[var(--borderColor)] border-1`}
          ></div>
        </button>
        <button
          onClick={() => setFontStyleClicked((prev) => !prev)}
          className="p-2 rounded-full active:scale-90 active:bg-[var(--wrapperColor)] cursor-pointer"
          type="button"
        >
          <span>F</span>
          <span className="font-montez">f</span>
        </button>
        <button
          onClick={() => {
            setFontWeightClicked((prev) => !prev);
            setWeight((prev) => (prev === "normal" ? "bold" : "normal"));
          }}
          className={`p-2 ${
            weight === "bold" ? "font-bold" : "font-light"
          } active:scale-90 active:bg-[var(--wrapperColor)] rounded-full cursor-pointer`}
          type="button"
        >
          B
        </button>
        <button
          onClick={() => setFontColorClicked((prev) => !prev)}
          className="p-2 rounded-full active:scale-90 active:bg-[var(--wrapperColor)] cursor-pointer"
          type="button"
        >
          <div className="flex items-center border-[var(--borderColor)] border-1 text-[var(--textColor)] rounded-md px-2">
            <div className="">T</div>
            <div
              style={{ backgroundColor: color }}
              className={`h-4 w-4 rounded-full`}
            ></div>
          </div>
        </button>
        <button
          onClick={() => setFontSizeClicked((prev) => !prev)}
          className="p-2 rounded-full active:scale-90 active:bg-[var(--wrapperColor)] cursor-pointer"
          type="button"
        >
          <div className="flex items-end  text-[var(--textColor)] rounded-md px-2">
            <div className="text-sm">T</div>
            <div>T</div>
          </div>
        </button>
        <button
          onClick={() => {
            setFontItalicClicked((prev) => !prev);
            setItalic((prev) => !prev);
          }}
          className="p-2 rounded-full active:scale-90 active:bg-[var(--wrapperColor)] cursor-pointer"
          type="button"
        >
          <ItalicIcon size={35} />
        </button>
        <button
          onClick={() => {
            setFontUnderlineClicked((prev) => !prev);
            setUnderline((prev) => !prev);
          }}
          className="p-2 rounded-full active:scale-90 active:bg-[var(--wrapperColor)] cursor-pointer"
          type="button"
        >
          <UnderlineIcon size={35} />
        </button>
      </div>
      <div
        style={{ backgroundColor: bgColor, opacity: 1 }}
        className={`w-full flex items-center justify-center px-2 sm:w-[60%] md:w-[50%] min-h-[400px]`}
      >
        <div className="w-full flex justify-center items-center">
          <TextareaAutosize
            spellCheck="false"
            minRows={3}
            maxRows={20}
            autoFocus
            style={{
              fontSize: fontSize + "px",
              fontWeight: weight,
              fontStyle: italic ? "italic" : "normal",
              textDecoration: underline ? "underline" : "none",
              color: color,
              backgroundColor: "transparent",
            }}
            className={`border-none placeholder:text-center outline-none w-[90%] placeholder:text-[${color}]`}
            placeholder="🖋️ Write something..."
          />
        </div>
      </div>

      {/* conditional contents render here */}
      {paintBrushClicked && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center flex-col gap-6 justify-center">
          <HexColorPicker color={bgColor} onChange={setBgColor} />
          <button
            type="button"
            onClick={() => setPaintBrushClicked(false)}
            className="py-2 px-4 rounded-md border-1 border-[var(--borderColor)] bg-[var(--bgColor)] text-[var(--textColor)] text-2xl active:scale-90 cursor-pointer"
          >
            Done
          </button>
        </div>
      )}

      {fontColorClicked && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center flex-col gap-6 justify-center">
          <HexColorPicker color={color} onChange={(color) => setColor(color)} />
          <button
            type="button"
            onClick={() => setFontColorClicked(false)}
            className="py-2 px-4 rounded-md border-1 border-[var(--borderColor)] bg-[var(--bgColor)] text-[var(--textColor)] text-2xl active:scale-90 cursor-pointer"
          >
            Done
          </button>
        </div>
      )}

      {fontSizeClicked && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center flex-col gap-6 justify-center">
          <input
            type="range"
            min="5"
            max="80"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="w-[200px] accent-amber-300"
          />
          <button
            type="button"
            onClick={() => setFontSizeClicked(false)}
            className="py-2 px-4 rounded-md border-1 border-[var(--borderColor)] bg-[var(--bgColor)] text-[var(--textColor)] text-2xl active:scale-90 cursor-pointer"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

export default StoryText;
