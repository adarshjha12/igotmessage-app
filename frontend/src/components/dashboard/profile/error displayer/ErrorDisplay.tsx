import {
  BarChart3,
  ImageIcon,
  ImageOff,
  VideoIcon,
  VideoOff,
} from "lucide-react";

function NoVisualsMessage({
  type,
}: {
  type: "reels" | "visuals" | "text and polls";
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full py-6 bg-[var(--wrapperColor)]  text-center text-gray-500">
      {type === "visuals" ? (
        <ImageIcon strokeWidth={1} className="w-18 h-18 mb-4 " />
      ) : type === "reels" ? (
        <VideoIcon strokeWidth={1} className="w-18 h-18 mb-4 " />
      ) : (
        <BarChart3 strokeWidth={1} className="w-18 h-18 mb-4 " />
      )}
      <div className="text-lg font-medium">No {type} yet</div>
      <div className="text-sm text-gray-400 mt-1">
        Upload images or videos to get started
      </div>
    </div>
  );
}

export default NoVisualsMessage;
