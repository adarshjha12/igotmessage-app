import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { HexColorPicker } from "react-colorful";
import { CheckIcon, ItalicIcon, UnderlineIcon, XIcon } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

/**
 * Modern aesthetic redesign of StoryText with a working Background Color chooser.
 * Key fixes:
 * - Restored background chooser (Solid / Gradient) flow with HexColorPicker(s)
 * - Overlay components with proper z-index & backdrop blur
 * - Replaced dynamic Tailwind class `opacity-${bgOpacity}` with inline opacity style
 * - Mobile-friendly, scrollable toolbar
 */

function StoryText({ storyRef, isCapturing }: any) {
  const storyTextBg = useAppSelector((state) => state.story.storyTextBg);

  const [fontSize, setFontSize] = useState("50");
  const [weight, setWeight] = useState<"normal" | "extrabold">("normal");
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [color, setColor] = useState("white");

  // Background controls
  const [bgColor, setBgColor] = useState("#428bf5");
  const [gradientColor1, setGradientColor1] = useState("#58f1f1");
  const [gradientColor2, setGradientColor2] = useState("#481bba");
  const [bgOpacity, setBgOpacity] = useState("100"); // 0-100

  const [paintBrushClicked, setPaintBrushClicked] = useState(false);
  const [fontStyleClicked, setFontStyleClicked] = useState(false);
  const [fontColorClicked, setFontColorClicked] = useState(false);
  const [fontSizeClicked, setFontSizeClicked] = useState(false);

  const [solidColorChosen, setSolidColorChosen] = useState(false);
  const [gradientColorChosen, setGradientColorChosen] = useState(false);

  const [storyText, setStoryText] = useState("");
  const [fontStyle, setFontStyle] = useState("normal");

  const fontStyles = [
    { style: "normal" },
    { style: "montez" },
    { style: "audioWide" },
    { style: "exo2" },
  ];

  // Compute background style
  const bgStyle: React.CSSProperties = {};
  if (solidColorChosen) {
    bgStyle.backgroundColor = bgColor;
  } else if (gradientColorChosen) {
    bgStyle.backgroundImage = `linear-gradient(90deg, ${gradientColor1}, ${gradientColor2})`;
  } else if (storyTextBg) {
    bgStyle.backgroundImage = `url(${storyTextBg})`;
  } else {
    bgStyle.backgroundImage = `linear-gradient(90deg, ${gradientColor1}, ${gradientColor2})`;
  }
  bgStyle.opacity = Number(bgOpacity) / 100;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Toolbar */}
      <div className="flex w-full p-3 gap-3 overflow-x-auto rounded-xl bg-white/10 backdrop-blur-md shadow-md items-center text-xl text-[var(--textColor)] justify-between sm:justify-center">
        {/* Background Selector (opens working chooser) */}
        <button
          aria-label="Choose background"
          onClick={() => setPaintBrushClicked(true)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition active:scale-90 shadow shrink-0"
          type="button"
        >
          <div
            style={{
              backgroundColor: solidColorChosen ? bgColor : undefined,
              backgroundImage: gradientColorChosen
                ? `linear-gradient(to right, ${gradientColor1}, ${gradientColor2})`
                : storyTextBg
                ? `url(${storyTextBg})`
                : `linear-gradient(to right, ${gradientColor1}, ${gradientColor2})`,
            }}
            className="h-8 w-8 rounded-full border border-[var(--borderColor)]"
          />
        </button>

        {/* Font Style */}
        <button
          aria-label="Choose font style"
          onClick={() => setFontStyleClicked(true)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition active:scale-90 shadow shrink-0"
          type="button"
        >
          <span className="font-montez text-2xl">Aa</span>
        </button>

        {/* Bold */}
        <button
          aria-label="Toggle bold"
          onClick={() => setWeight((prev) => (prev === "normal" ? "extrabold" : "normal"))}
          className={`p-2 rounded-full bg-white/5 hover:bg-white/20 transition active:scale-90 shadow shrink-0 ${
            weight === "extrabold" ? "font-extrabold" : "font-light"
          }`}
          type="button"
        >
          B
        </button>

        {/* Font Color */}
        <button
          aria-label="Choose text color"
          onClick={() => setFontColorClicked(true)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition active:scale-90 shadow shrink-0"
          type="button"
        >
          <div className="flex items-center gap-1 border border-[var(--borderColor)] rounded-md px-2 py-1">
            <div className="text-sm">T</div>
            <div style={{ backgroundColor: color }} className="h-4 w-4 rounded-full border border-[var(--borderColor)]" />
          </div>
        </button>

        {/* Font Size */}
        <button
          aria-label="Choose font size"
          onClick={() => setFontSizeClicked(true)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition active:scale-90 shadow shrink-0"
          type="button"
        >
          <div className="flex items-end text-[var(--textColor)] rounded-md px-2">
            <div className="text-xs">T</div>
            <div>T</div>
          </div>
        </button>

        {/* Italic */}
        <button
          aria-label="Toggle italic"
          onClick={() => setItalic((prev) => !prev)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition active:scale-90 shadow shrink-0"
          type="button"
        >
          <ItalicIcon size={20} />
        </button>

        {/* Underline */}
        <button
          aria-label="Toggle underline"
          onClick={() => setUnderline((prev) => !prev)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition active:scale-90 shadow shrink-0"
          type="button"
        >
          <UnderlineIcon size={20} />
        </button>
      </div>

      {/* Text Canvas */}
      <div
        ref={storyRef}
        style={bgStyle}
        className={`w-full flex items-center justify-center px-3 py-6 rounded-xl shadow-lg mt-3`}
      >
        <div className="w-full flex justify-center items-center">
          {isCapturing ? (
            <div
              style={{
                fontSize: fontSize + "px",
                fontWeight: weight === "normal" ? 600 : 900,
                fontStyle: italic ? "italic" : "normal",
                textDecoration: underline ? "underline" : "none",
                color,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
              className={`text-center w-[90%] font-${fontStyle}`}
            >
              {storyText}
            </div>
          ) : (
            <TextareaAutosize
              spellCheck="false"
              minRows={3}
              maxRows={20}
              autoFocus
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              style={{
                fontSize: fontSize + "px",
                fontWeight: weight === "normal" ? 600 : 900,
                fontStyle: italic ? "italic" : "normal",
                textDecoration: underline ? "underline" : "none",
                color,
                backgroundColor: "transparent",
              }}
              className={`border-none min-h-[400px] text-center font-${fontStyle} placeholder:text-center outline-none w-[90%]`}
              placeholder="🖋️ Write something..."
            />
          )}
        </div>
      </div>

      {/* Overlays */}
      {fontColorClicked && (
        <Overlay onClose={() => setFontColorClicked(false)}>
          <HexColorPicker color={color} onChange={setColor} />
        </Overlay>
      )}

      {fontSizeClicked && (
        <Overlay onClose={() => setFontSizeClicked(false)}>
          <div className="flex flex-col items-center gap-3">
            <input
              type="range"
              min="5"
              max="80"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-[260px] accent-amber-400"
            />
            <div className="text-sm opacity-80">{fontSize}px</div>
          </div>
        </Overlay>
      )}

      {fontStyleClicked && (
        <Overlay onClose={() => setFontStyleClicked(false)}>
          <div className="flex gap-3 flex-wrap">
            {fontStyles.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setFontStyle(item.style)}
                className={`px-3 py-2 rounded-lg text-xl transition ${
                  fontStyle === item.style
                    ? "border border-[var(--borderColor)] bg-white/20"
                    : "bg-white/5"
                } font-${item.style}`}
              >
                Abc
              </button>
            ))}
          </div>
        </Overlay>
      )}

      {paintBrushClicked && (
        <BackgroundOverlay
          initialTab={solidColorChosen ? "solid" : gradientColorChosen ? "gradient" : "choose"}
          bgColor={bgColor}
          setBgColor={setBgColor}
          gradientColor1={gradientColor1}
          setGradientColor1={setGradientColor1}
          gradientColor2={gradientColor2}
          setGradientColor2={setGradientColor2}
          bgOpacity={bgOpacity}
          setBgOpacity={setBgOpacity}
          onClose={() => setPaintBrushClicked(false)}
          onChooseSolid={() => {
            setSolidColorChosen(true);
            setGradientColorChosen(false);
            setPaintBrushClicked(false);
          }}
          onChooseGradient={() => {
            setSolidColorChosen(false);
            setGradientColorChosen(true);
            setPaintBrushClicked(false);
          }}
        />
      )}
    </div>
  );
}

function Overlay({ children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-col gap-4 items-center">
        {children}
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-lg text-white"
        >
          Done
        </button>
      </div>
    </div>
  );
}

/** Background chooser with Solid / Gradient tabs (WORKING) */
function BackgroundOverlay({
  initialTab = "choose",
  bgColor,
  setBgColor,
  gradientColor1,
  setGradientColor1,
  gradientColor2,
  setGradientColor2,
  bgOpacity,
  setBgOpacity,
  onClose,
  onChooseSolid,
  onChooseGradient,
}: any) {
  const [tab, setTab] = useState<"choose" | "solid" | "gradient">(initialTab);

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[620px] bg-[var(--wrapperColor)] text-[var(--textColor)] rounded-2xl shadow-2xl border border-[var(--borderColor)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--borderColor)]">
          <div className="font-medium">Background</div>
          <button
            aria-label="Close background chooser"
            className="p-2 rounded-full hover:bg-white/10"
            onClick={onClose}
            type="button"
          >
            <XIcon size={20} />
          </button>
        </div>

        {tab === "choose" && (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setTab("solid")}
              type="button"
              className="flex gap-4 w-full px-4 py-3 rounded-xl border border-[var(--borderColor)] bg-white/5 hover:bg-white/10 transition items-center"
            >
              <div style={{ backgroundColor: bgColor }} className="h-8 w-8 rounded-full border border-[var(--borderColor)]" />
              <p>Solid</p>
            </button>

            <button
              onClick={() => setTab("gradient")}
              type="button"
              className="flex gap-4 w-full px-4 py-3 rounded-xl border border-[var(--borderColor)] bg-white/5 hover:bg-white/10 transition items-center"
            >
              <div
                style={{ background: `linear-gradient(90deg, ${gradientColor1}, ${gradientColor2})` }}
                className="h-8 w-8 rounded-full border border-[var(--borderColor)]"
              />
              <p>Gradient</p>
            </button>
          </div>
        )}

        {tab === "solid" && (
          <div className="p-5 flex flex-col items-center gap-5">
            <HexColorPicker color={bgColor} onChange={setBgColor} />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onChooseSolid()}
                className="px-5 py-2 rounded-full flex items-center gap-2 border border-[var(--borderColor)] bg-[var(--wrapperColor)]"
              >
                <CheckIcon size={18} /> Done
              </button>
              <button
                type="button"
                onClick={() => setTab("choose")}
                className="px-5 py-2 rounded-full border border-[var(--borderColor)] bg-white/10"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {tab === "gradient" && (
          <div className="p-5 flex flex-col gap-5 items-center">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm opacity-80">Start Color</p>
                <HexColorPicker color={gradientColor1} onChange={setGradientColor1} />
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm opacity-80">End Color</p>
                <HexColorPicker color={gradientColor2} onChange={setGradientColor2} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-3">
                <span className="opacity-80">Opacity</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={bgOpacity}
                  onChange={(e) => setBgOpacity(e.target.value)}
                  className="w-[220px] h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-amber-400 dark:bg-gray-700"
                />
                <span className="w-10 text-right opacity-80">{bgOpacity}%</span>
              </div>
              <div
                className="w-[180px] h-10 rounded-full border border-[var(--borderColor)]"
                style={{ background: `linear-gradient(90deg, ${gradientColor1}, ${gradientColor2})` }}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onChooseGradient()}
                className="px-5 py-2 rounded-full flex items-center gap-2 border border-[var(--borderColor)] bg-[var(--wrapperColor)]"
              >
                <CheckIcon size={18} /> Done
              </button>
              <button
                type="button"
                onClick={() => setTab("choose")}
                className="px-5 py-2 rounded-full border border-[var(--borderColor)] bg-white/10"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryText;
