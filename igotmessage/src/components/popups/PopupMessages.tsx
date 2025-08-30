import { CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PopupMessageProps {
  show: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export default function PopupMessage({
  show,
  type,
  message,
  onClose,
}: PopupMessageProps) {
  const Icon = type === "success" ? CheckCircle : XCircle;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed w-full z-50 flex items-start mt-4 justify-center"
        >
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-[var(--borderColor)]/30"
            style={{
              backgroundColor: "var(--wrapperColor)",
              color: "var(--textColor)",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.4), 0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            <Icon
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
    </AnimatePresence>
  );
}
