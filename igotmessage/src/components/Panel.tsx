"use client";

import {
  MoonIcon,
  SunIcon,
  GroupIcon,
  ShieldIcon,
  InfoIcon,
  ArrowLeftIcon,
  Settings2Icon,
  ArrowDownUp,
  ArrowRightIcon,
  LogOutIcon,
  ChevronLeftIcon,
} from "lucide-react";
import React, { useState } from "react";
import Toggle from "./Toggle";
import { RootState } from "@/store/store";
import { setDarkMode, setPanelOpen } from "@/features/activitySlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import NewLoader from "./NewLoader";
import { logOut } from "@/features/authSlice";
import { motion, AnimatePresence } from "framer-motion";

function Panel() {
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);
  const logOutStatus = useAppSelector(
    (state: RootState) => state.auth.user.logOutStatus
  );
  const panelOpen = useAppSelector(
    (state: RootState) => state.activity.panelOpen
  );

  const [dataSaver, setDataSaver] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

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
    <AnimatePresence>
      {panelOpen && (
        <motion.div
          key="panel"
          initial={{ x: "-50%" }}
          animate={{ x: 0 }}
          exit={{ x: "-50%" }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
          className="fixed inset-0 right-0 z-50 h-full w-[85%] sm:w-[40%] backdrop-blur-lg bg-[var(--bgColor)]/50 shadow-2xl overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => dispatch(setPanelOpen(false))}
            className="m-3 p-2 rounded-full hover:bg-[var(--wrapperColor)] transition"
          >
            <ChevronLeftIcon size={34} className="text-[var(--iconColor)]" />
          </button>

          {/* Content */}
          <div className="flex flex-col gap-10 px-6 py-4">
            {/* Header */}
            <div className="flex items-center gap-3 text-2xl font-bold">
              <Settings2Icon
                className="text-[var(--iconColor)]"
                size={26}
                strokeWidth={1.5}
              />
              <p>Settings</p>
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-4">
              {/* Dark mode */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--wrapperColor)] hover:shadow-lg transition">
                <div className="flex items-center gap-3">
                  {isDark ? (
                    <MoonIcon size={22} className="text-indigo-400" />
                  ) : (
                    <SunIcon size={22} className="text-amber-600" />
                  )}
                  <p className="text-sm font-semibold">Dark Mode</p>
                </div>
                <button onClick={enableDarkMode}>
                  <Toggle toggleNow={isDark} />
                </button>
              </div>

              {/* Data Saver */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--wrapperColor)] hover:shadow-lg transition">
                <div className="flex items-center gap-3">
                  <ArrowDownUp size={22} className="text-emerald-400" />
                  <p className="text-sm font-semibold">Data Saver</p>
                </div>
                <button onClick={() => setDataSaver((prev) => !prev)}>
                  <Toggle toggleNow={dataSaver} />
                </button>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-2xl font-bold">
                <ArrowRightIcon
                  className="text-[var(--iconColor)] -rotate-45"
                  size={26}
                />
                <p>Visit</p>
              </div>
              <Link
                href="/about-dev"
                className="flex items-center text-sm gap-3 p-3 rounded-xl bg-[var(--wrapperColor)] hover:shadow-md transition"
              >
                <InfoIcon size={22} className="text-[var(--iconColor)]" />
                About Dev
              </Link>
              <Link
                href="/privacy-policy"
                className="flex items-center text-sm gap-3 p-3 rounded-xl bg-[var(--wrapperColor)] hover:shadow-md transition"
              >
                <ShieldIcon size={22} className="text-[var(--iconColor)]" />
                Privacy Policy
              </Link>
              <Link
                href="/community-guidelines"
                className="flex items-center text-sm gap-3 p-3 rounded-xl bg-[var(--wrapperColor)] hover:shadow-md transition"
              >
                <GroupIcon size={22} className="text-[var(--iconColor)]" />
                Community Guidelines
              </Link>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="mt-6 text-md flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold shadow-lg hover:scale-95 active:scale-90 transition"
            >
              {logOutStatus === "loading" ? (
                <NewLoader color="white" />
              ) : (
                <>
                  <LogOutIcon /> Logout
                </>
              )}
            </button>
            <div
              className={`mt-3 flex items-center justify-center gap-2 font-medium text-sm text-[var(--textColor)]/80`}
            >
              <img
                src="/images/lion.png"
                className="w-12 h-auto"
                alt=""
              />
              <p> A Make in India Initiative</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Panel;
