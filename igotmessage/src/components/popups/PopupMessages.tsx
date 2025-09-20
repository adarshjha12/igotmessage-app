import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { XCircle } from "lucide-react";

type MessagePopupProps = {
  show: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

export default function MessagePopup({ show, message, type, onClose }: MessagePopupProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // avoid SSR errors

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed w-[90%] flex justify-center top-6 left-1/2 -translate-x-1/2 z-[9999]"
        >
          <div
            className="flex w-fit justify-center items-center gap-3 px-5 py-4 rounded-2xl border bg-[var(--wrapperColor)]/50 backdrop-blur-md border-[var(--borderColor)]/30"
            style={{
              color: "var(--textColor)",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.4), 0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            {/* icon */}
            <XCircle
              className={`w-6 h-6 flex-shrink-0 ${
                type === "success" ? "text-green-400" : "text-red-400"
              }`}
            />

            <span className="font-medium">{message}</span>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="ml-2 rounded-full p-1 hover:bg-white/10 transition"
            >
              <XCircle className="w-5 h-5 opacity-70" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
