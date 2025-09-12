"use client";

import {
  MoonIcon,
  SunIcon,
  ArrowRightIcon,
  ShieldIcon,
  InfoIcon,
  GroupIcon,
  Settings2Icon,
  ArrowDownUp,
  X,
  LogOutIcon,
} from "lucide-react";
import React, { useState } from "react";
import Toggle from "../Toggle";
import { RootState } from "@/store/store";
import { setDarkMode } from "@/features/activitySlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logOut } from "@/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import NewLoader from "../NewLoader";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  closeModal?: (value: boolean) => void;
}

function MainModal({ closeModal }: Props) {
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);
  const [dataSaver, setDataSaver] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const logOutStatus = useAppSelector(
    (state: RootState) => state.auth.user.logOutStatus
  );

  async function handleLogout() {
    const res = await dispatch(logOut());
    if (res.meta.requestStatus === "fulfilled") {
      router.push("/login");
    }
  }

  const enableDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      dispatch(setDarkMode(false));
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      dispatch(setDarkMode(true));
    }
  };

  return (
    <div
      className="w-full h-full 
                    backdrop-blur-lg text-[var(--textColor)] shadow-2xl overflow-y-auto"
    >
      <div className="px-6 py-8 space-y-4">
        {/* Settings Header */}
        <div className="flex bg-[var(--wrapperColor)] px-4 py-2 rounded-xl gap-3 items-center text-2xl font-semibold">
          <Settings2Icon
            className="text-[var(--iconColor)]"
            size={34}
            strokeWidth={1.5}
          />
          <p>Preferences</p>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex justify-between items-center rounded-xl px-4 py-2  hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <p className="text-lg font-medium">Dark Mode</p>
            {isDark ? (
              <MoonIcon size={30} className="text-indigo-400" />
            ) : (
              <SunIcon size={30} className="text-amber-500" />
            )}
          </div>
          <button onClick={enableDarkMode}>
            <Toggle toggleNow={isDark} />
          </button>
        </div>

        {/* Data Saver Toggle */}
        <div className="flex justify-between items-center rounded-xl px-4 py-2 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <p className="text-lg font-medium">Data Saver</p>
            <ArrowDownUp size={26} className="text-emerald-500" />
          </div>
          <button onClick={() => setDataSaver((prev) => !prev)}>
            <Toggle toggleNow={dataSaver} />
          </button>
        </div>

        {/* Visit Links */}
        <div className=" mt-8">
          <div className="flex gap-3 items-center bg-[var(--wrapperColor)] px-4 py-2 rounded-xl text-2xl font-semibold mb-4">
            <ArrowRightIcon
              className="text-[var(--iconColor)] -rotate-45"
              size={30}
            />
            <p>Visit</p>
          </div>
          <div className="space-y-3">
            <Link
              href="/about-dev"
              className="flex items-center gap-3 px-4 py-3 rounded-xl  hover:shadow-md transition"
            >
              <InfoIcon className="text-[var(--iconColor)]" /> About Dev
            </Link>
            <Link
              href="/privacy-policy"
              className="flex items-center gap-3 px-4 py-3 rounded-xl  hover:shadow-md transition"
            >
              <ShieldIcon className="text-[var(--iconColor)]" /> Privacy Policy
            </Link>
            <Link
              href="/community-guidelines"
              className="flex items-center gap-3 px-4 py-3 rounded-xl  hover:shadow-md transition"
            >
              <GroupIcon className="text-[var(--iconColor)]" /> Community
              Guidelines
            </Link>
            <Link
              href="/terms"
              className="flex items-center gap-3 px-4 py-3 rounded-xl  hover:shadow-md transition"
            >
              <InfoIcon className="text-[var(--iconColor)]" /> Terms &
              Conditions
            </Link>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl 
                       bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold shadow-lg 
                       hover:scale-95 active:scale-90 transition"
        >
          {logOutStatus === "loading" ? (
            <NewLoader color="white" />
          ) : (
            <>
              <LogOutIcon /> Logout
            </>
          )}
        </button>
      </div>
      <div
        className={`mt-12 mb-12 flex items-center justify-center gap-2 font-medium text-[var(--textColor)]/80`}
      >
        <img src="/images/lion.png" className="w-12 h-auto" alt="" />
        <p> A Make in India Initiative</p>
      </div>
    </div>
  );
}

export default MainModal;
