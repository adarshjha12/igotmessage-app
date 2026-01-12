import React, { useEffect } from "react";
import { X } from "lucide-react";

function FullImageViewer({ src, onClose }: {
    src: string;
    onClose?: () => void;}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center
                 bg-black/80"
      onClick={onClose}
    >
      {/* Content wrapper */}
      <div
        className="relative mt-14 max-w-[92vw] max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0
                     text-white hover:opacity-80 transition"
        >
          <X size={28} />
        </button>

        {/* Image */}
        <img
          src={src}
          alt="Full preview"
          className="max-w-full max-h-[92vh]
                     object-contain rounded-2xl
                     shadow-2xl"
        />
      </div>
    </div>
  );
}

export default FullImageViewer;
