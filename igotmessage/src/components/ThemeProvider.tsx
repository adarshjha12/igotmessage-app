"use client";
import React, { ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setDarkMode } from "@/features/activitySlice";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

function ThemeProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsMounted(true);
    const theme = localStorage.getItem("theme");
    if (!theme) {
      localStorage.setItem("theme", "dark");
      dispatch(setDarkMode(true));
      document.documentElement.classList.add("dark");
    }

    if (theme === "dark") {
      dispatch(setDarkMode(true));
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      dispatch(setDarkMode(false));
    }
  }, []);

  return isMounted ? (
    <div className={`w-full h-full ${isDark ? "bg-black" : "bg-white"}`}>
      {children}
    </div>
  ) : null;
}

export default ThemeProvider;
