import React, { useState } from "react";

import TextareaAutosize from "react-textarea-autosize";
import { HexColorPicker } from "react-colorful";
import { PaintBrushBroadIcon } from "@phosphor-icons/react";
import { ItalicIcon, TextIcon, UnderlineIcon, XIcon } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

function StoryText() {
  const storyTextBg = useAppSelector(
    (state) => state.activity.story.storyTextBg
  );
  const [fontSize, setFontSize] = useState("50");
  const [weight, setWeight] = useState<"normal" | "extrabold">("normal");
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [color, setColor] = useState("white");
  const [bgColor, setBgColor] = useState("#428bf5");
  const [gradientColor1, setGradientColor1] = useState("#58f1f1");
  const [gradientColor2, setGradientColor2] = useState("#481bba");
  const [bgOpacity, setBgOpacity] = useState("100");

  const [paintBrushClicked, setPaintBrushClicked] = useState(false);
  const [fontWeightClicked, setFontWeightClicked] = useState(false);
  const [fontStyleClicked, setFontStyleClicked] = useState(false);
  const [fontUnderlineClicked, setFontUnderlineClicked] = useState(false);
  const [fontColorClicked, setFontColorClicked] = useState(false);
  const [fontItalicClicked, setFontItalicClicked] = useState(false);
  const [fontSizeClicked, setFontSizeClicked] = useState(false);
  const [solidClicked, setSolidClicked] = useState(false);
  const [gradientClicked, setGradientClicked] = useState(false);
  const [solidColorChosen, setSolidColorChosen] = useState(false);
  const [gradientColorChosen, setGradientColorChosen] = useState(false);
  const [fontStyle, setFontStyle] = useState("normal");

  const fontStyles = [
    {
      style: "normal",
    },
    {
      style: "montez",
    },
    {
      style: "audioWide",
    },
    {
      style: "exo2",
    },
  ];
  return (
    <div className="w-full flex  flex-col justify-center items-center">
      <div className="flex w-full sm:w-[60%] md:w-[50%] p-2 items-center text-3xl text-[var(--textColor)] justify-between">
        <button
          onClick={() => setPaintBrushClicked((prev) => !prev)}
          className="p-2 rounded-full active:scale-90 active:bg-[var(--wrapperColor)] cursor-pointer"
          type="button"
        >
          <div
            style={{
              backgroundColor: solidColorChosen ? bgColor : !solidColorChosen && !gradientColorChosen && storyTextBg === "" ? bgColor : undefined,
              backgroundImage: gradientColorChosen
                ? `linear-gradient(to right, ${gradientColor1}, ${gradientColor2})`
                : storyTextBg !== "" &&
                  !solidColorChosen &&
                  !gradientColorChosen
                ? `url(${storyTextBg})`
                : undefined,
            }}
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
            setWeight((prev) => (prev === "normal" ? "extrabold" : "normal"));
          }}
          className={`p-2 ${
            weight === "extrabold" ? "font-extrabold" : "font-light"
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
              className={`h-4 border-[var(--borderColor)] border-1 w-4 rounded-full`}
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
        style={{
          backgroundColor: solidColorChosen ? bgColor : !solidColorChosen && !gradientColorChosen && storyTextBg === "" ? bgColor : undefined,
          backgroundImage: gradientColorChosen
            ? `linear-gradient(to right, ${gradientColor1}, ${gradientColor2})`
            : storyTextBg !== "" && !solidColorChosen && !gradientColorChosen
            ? `url(${storyTextBg})`
            : undefined,
        }}
        className={`w-full opacity-${bgOpacity} flex items-center justify-center px-2 sm:w-[60%] md:w-[50%] min-h-[400px]`}
      >
        <div
          style={{ opacity: 1 }}
          className="w-full opacity-100 flex justify-center items-center"
        >
          <TextareaAutosize
            spellCheck="false"
            minRows={3}
            maxRows={20}
            autoFocus
            style={{
              fontSize: fontSize + "px",
              fontWeight: `${weight === "normal" ? 600 : 900}`,
              fontStyle: italic ? "italic" : "normal",
              textDecoration: underline ? "underline" : "none",
              color: color,
              backgroundColor: "transparent",
            }}
            className={`border-none  text-center font-${fontStyle} placeholder:text-center outline-none w-[90%] placeholder:text-[${color}]`}
            placeholder="🖋️ Write something..."
          />
        </div>
      </div>

      {/* conditional contents render here */}
      {paintBrushClicked && (
        <div className="fixed inset-0 w-full z-50 bg-black/50 flex items-center flex-col gap-6 justify-center">
          <div
            className={`flex w-full text-2xl p-16  border-[var(-borderColor)] sm:w-[40%] rounded-2xl relative gap-4 items-start bg-[var(--wrapperColor)] justify-center flex-col ${
              solidClicked || gradientClicked ? "hidden" : ""
            }`}
          >
            <button
              className="absolute text-[var(--textColor)] cursor-pointer top-2 p-2 right-6 active:scale-90"
              onClick={() => setPaintBrushClicked((prev) => !prev)}
              type="button"
            >
              <XIcon size={35} />
            </button>
            <button
              onClick={() => setSolidClicked((prev) => !prev)}
              type="button"
              className="flex gap-4 w-full px-4 py-2 rounded-md border-1 border-[var(--borderColor)] cursor-pointer items-center"
            >
              <div
                style={{ backgroundColor: bgColor }}
                className="h-8 w-8 rounded-full border-[var(--borderColor)] border-1"
              ></div>
              <p>Solid</p>
            </button>
            <button
              onClick={() => setGradientClicked((prev) => !prev)}
              className="flex gap-4 w-full px-4 py-2 rounded-md border-1 border-[var(--borderColor)]  cursor-pointer items-center"
              type="button"
            >
              <div
                style={{
                  background: `linear-gradient(to right, ${gradientColor1}, ${gradientColor2})`,
                }}
                className="h-8 w-8 rounded-full border-[var(--borderColor)] border-1"
              ></div>
              <p>Gradient</p>
            </button>
          </div>
          {solidClicked && (
            <div className="flex flex-col gap-6 justify-center items-center">
              <HexColorPicker color={bgColor} onChange={setBgColor} />
              <button
                type="button"
                onClick={() => {
                  setPaintBrushClicked(false);
                  setSolidClicked(false);
                  setGradientClicked(false);
                  setGradientColorChosen(false);
                  setSolidColorChosen(true);
                }}
                className="py-2 px-4 rounded-md border-1 border-[var(--borderColor)] bg-[var(--bgColor)] text-[var(--textColor)] text-2xl active:scale-90 cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
          {gradientClicked && (
            <div className="flex flex-col bg-[var(--wrapperColor)] p-4 rounded-2xl w-full sm:w-[60%]  border-[var(--borderColor)] gap-4 items-center justify-center">
              <div className="flex  gap-4 text-2xl items-center justify-center">
                <div className="scale-75">
                  <p>Start Color</p>
                  <HexColorPicker
                    className=""
                    color={gradientColor1}
                    onChange={setGradientColor1}
                  />
                </div>
                <div className="scale-75">
                  <p>End Color</p>
                  <HexColorPicker
                    color={gradientColor2}
                    onChange={setGradientColor2}
                  />
                </div>
              </div>
              <div className="flex gap-4 items-start justify-center flex-col">
                <div className="flex gap-4 items-center justify-center">
                  <p>Preview Gradient-</p>

                  <div
                    className="w-[200px] h-16 rounded-4xl"
                    style={{
                      background: `linear-gradient(to right, ${gradientColor1}, ${gradientColor2})`,
                    }}
                  ></div>
                </div>
                <div className="flex gap-4 items-center justify-center">
                  <p>Opacity-</p>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={bgOpacity}
                    onChange={(e) => setBgOpacity(e.target.value)}
                    className="w-[200px] h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-amber-400 dark:bg-gray-700"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPaintBrushClicked(false);
                  setSolidClicked(false);
                  setGradientClicked(false);
                  setGradientColorChosen(true);
                  setSolidColorChosen(false);
                }}
                className="py-2 my-4 px-4 rounded-md border-1 border-[var(--borderColor)] bg-[var(--bgColor)] text-[var(--textColor)] text-2xl active:scale-90 cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
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
            className="w-[280px] accent-amber-300"
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

      {fontStyleClicked && (
        <div>
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center flex-col gap-6 justify-center">
            <div className="w-full bg-[var(--wrapperColor)] rounded-2xl p-6 sm:w-[30%] text-[var(--textColor)] flex text-3xl flex-col  items-center gap-8 justify-center">
              <div className="w-full  text-[var(--textColor)] flex text-3xl font-medium items-center gap-4 justify-center">
                {fontStyles.map((item, index) => (
                  <button
                    type="button"
                    onClick={() => setFontStyle(item.style)}
                    key={index}
                    className={`p-2 ${
                      fontStyle === item.style
                        ? "border-1 border-[var(--borderColor)]"
                        : ""
                    } active:bg-[var(--wrapperColor)] rounded-md cursor-pointer font-${
                      item.style
                    }`}
                  >
                    Abc
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setFontStyleClicked(false)}
                className="py-2 px-4 rounded-md border-1 border-[var(--borderColor)] bg-[var(--textColor)] text-[var(--bgColor)] text-2xl active:scale-90 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryText;
