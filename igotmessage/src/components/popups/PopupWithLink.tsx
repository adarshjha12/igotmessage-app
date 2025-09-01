"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";

interface PopupMessageProps {
  message: string;
  linkText?: string;
  linkHref?: string;
  show: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number; // ms
  type?: "success" | "error" | "info";
}

const PopupWithLink: React.FC<PopupMessageProps> = ({
  message,
  linkText,
  linkHref,
  show,
  onClose,
  autoClose = true,
  duration = 10000,
  type = "success",
}) => {
  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, duration, onClose]);

  const colors = {
    success: "bg-green-700/90 text-white",
    error: "bg-red-700/90 text-white",
    info: "bg-blue-500/90 text-white",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] sm:w-auto"
        >
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${colors[type]} backdrop-blur-md`}
          >
            <p className="flex-1 font-medium">{message}</p>

            {linkHref && linkText && (
              <Link
                href={linkHref}
                className="px-3 py-1 rounded-lg bg-white/20 text-white font-medium hover:bg-white/30 transition"
              >
                {linkText}
              </Link>
            )}

            <button onClick={onClose} className="p-1 hover:opacity-70">
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupWithLink;
