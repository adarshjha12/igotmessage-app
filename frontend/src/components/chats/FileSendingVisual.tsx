import { useUIStore } from "@/store/zustand/chatStore";
import { UploadIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { Loader2Icon } from "lucide-react";

function FileSendingVisual() {
  const { filePreview } = useUIStore();

  return (
    <div>
      {filePreview && (
        <div
          className="relative mb-12 border-4 border-violet-500 rounded-2xl w-[220px] rounded-br-md
                   overflow-hidden
                   bg-black/30"
        >
          <img
            src={filePreview}
            alt="preview"
            className="w-full z-10 h-full object-cover"
          />
          <div className="absolute top-0 h-full flex items-center justify-center w-full backdrop-blur-xs bg-white/1 z-20">
            <span className="h-fit bg-black/50 py-2 w-full flex flex-col justify-center gap-2 items-center">
              <Loader2Icon
                strokeWidth={2}
                className="w-10 h-10 animate-spin text-white"
              />

              <p className="animate-pulse flex items-center gap-2 tracking-widest text-xl text-white ">
                <UploadSimpleIcon
                  strokeWidth={2}
                  weight="bold"
                  fill="aqua"
                  className="w-8 h-8 "
                />
                SENDING{" "}
              </p>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileSendingVisual;
