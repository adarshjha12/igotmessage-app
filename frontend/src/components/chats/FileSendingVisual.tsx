import { useUIStore } from "@/store/zustand/chatStore";
import { Loader2Icon } from "lucide-react";

function FileSendingVisual() {
  const { filePreview } = useUIStore();

  return (
    <div>
      {filePreview && (
        <div
          className="relative w-[220px] rounded-xl rounded-br-md
                   overflow-hidden
                   border border-violet-500/30
                   bg-black/30"
        >
          <img
            src={filePreview}
            alt="preview"
            className="w-full z-10 h-full object-cover"
          />
          <div className="absolute top-0 h-full flex items-center justify-center w-full backdrop-blur-xs bg-white/1 z-20">
            <span className="h-fit w-fit flex flex-col justify-center items-center">
              <Loader2Icon
                strokeWidth={2}
                className="w-16 h-16 animate-spin text-white"
              />

              <p className="animate-pulse text-white ">sending...</p>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileSendingVisual;
