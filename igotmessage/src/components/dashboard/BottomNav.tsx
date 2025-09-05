"use client";

import Link from "next/link";
import {
  House,
  PlusSquare,
  MessageCircle,
  Play,
  Video,
  User,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export default function BottomNav({ pathname }: { pathname: string }) {
  const navItems = [
    { href: "/dash/feed", icon: House },
    { href: "/dash/chats", icon: MessageCircle },
    { href: "/dash/create", icon: PlusSquare }, // FAB but same style now
    { href: "/reels", icon: Play },
    { href: "/dash/calls", icon: Video },
    { href: "/dash/profile", icon: User },
  ];

  const avatar = useAppSelector((state) => state.auth.user.avatar);
  const profilePicture = useAppSelector(
    (state) => state.auth.user.profilePicture
  );

  return (
    <nav className="fixed bottom-0 left-0 w-full flex items-center justify-between bg-[var(--bgColor)]/80 backdrop-blur-lg border border-[var(--shadowBorder)] px-3 py-2 shadow-lg z-20 md:hidden">
      <ul className="flex items-center justify-between w-full">
        {navItems.map(({ href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center justify-center group"
                aria-label={href}
              >
                <div
                  className={`p-3 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br text-[var(--bgColor)] bg-[var(--textColor)]/70 scale-110 shadow-md"
                      : "group-hover:bg-[var(--wrapperColor)]"
                  }`}
                >
                  {href === "/dash/profile" && avatar ? (
                    <img
                      src={
                        profilePicture && profilePicture.trim() !== ""
                          ? profilePicture
                          : avatar
                      }
                      alt="avatar"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <Icon
                      size={26}
                      strokeWidth={isActive ? 2.5 : 1.8}
                      className={`transition-transform ${
                        isActive ? "scale-110" : "group-hover:scale-105"
                      }`}
                    />
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
