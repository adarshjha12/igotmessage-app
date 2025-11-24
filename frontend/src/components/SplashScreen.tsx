"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

function SplashScreen() {
  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-gradient-to-br from-indigo-500 via-blue-500 to-blue-900">
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-5"
      >
        {/* Glass container for logo */}
        <div className="px-6 py-8 rounded-3xl bg-white/50 backdrop-blur-lg border border-white/20 shadow-xl flex items-center gap-3">
          <Image
            src="/images/ig.png"
            alt="IG"
            width={80}
            height={80}
            className="w-[80px] h-[65px] drop-shadow-lg"
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <Image
              src="/images/m.png"
              alt="M"
              width={70}
              height={70}
              className="w-[70px] h-[70px] drop-shadow-lg"
            />
          </motion.div>
        </div>

        {/* Brand Name */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl font-semibold font-montez tracking-wide text-white drop-shadow-lg"
        >
          IGotMessage
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-sm text-gray-200"
        >
          AI-Powered Next-Gen Social Media 🚀
        </motion.p>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 flex flex-col items-center justify-center"
      >
        <div className="flex items-center gap-2 text-gray-100 font-medium drop-shadow">
          <img src="/images/makeInIndia.png" className="w-12 h-auto" alt="" />
          <p>A Make in India Initiative</p>
        </div>
      </motion.div>
    </div>
  );
}

export default SplashScreen;
