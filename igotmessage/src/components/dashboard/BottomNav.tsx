"use client";

import Link from "next/link";
import {
  HouseIcon,
  ChatCircleIcon,
  PlusSquareIcon,
  PlayCircleIcon,
  VideoCameraIcon,
  UserIcon,
  ChatCircleTextIcon,
  ChatsTeardropIcon,
  ChatsCircleIcon,
  PhoneCallIcon,
  PhoneIcon,
  ChatTextIcon,
} from "@phosphor-icons/react";
import { useAppSelector } from "@/store/hooks";

export default function BottomNav({ pathname }: { pathname: string }) {

   const avatar = useAppSelector((state) => state.auth.user.avatar);
  const myId = useAppSelector((state) => state.auth.user._id);
  const profilePicture = useAppSelector(
    (state) => state.auth.user.profilePicture
  );

  const navItems = [
    { href: "/dash/feed", icon: HouseIcon },
    { href: `/chats?userId=${myId}`, icon: ChatTextIcon  },
    { href: "/dash/create", icon: PlusSquareIcon },
    { href: `/reels?myId=${myId}&myPic=${profilePicture || avatar}`, icon: PlayCircleIcon },
    { href: "/dash/calls", icon: PhoneIcon },
    { href: "/dash/profile", icon: UserIcon },
  ];

  return (
    <nav className="fixed -bottom-2 left-0 w-full flex items-center justify-between pb-2
      bg-[var(--bgColor)]/80 backdrop-blur-xl border-t border-[var(--shadowBorder)] 
      px-2 z-20 md:hidden">
      <ul className="flex items-center justify-between w-full">
        {navItems.map(({ href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center justify-center"
                aria-label={href}
              >
                <div
                  className={`p-3 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--accentColor)]"
                      : "text-[var(--textColor)]"
                  }`}
                >
                  {href === "/dash/profile" && avatar ? (
                    <div
                      className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center ring-2 transition-all duration-200 ${
                        isActive
                          ? "ring-[var(--accentColor)]"
                          : "ring-transparent"
                      }`}
                    >
                      <img
                        src={
                          profilePicture && profilePicture.trim() !== ""
                            ? profilePicture
                            : avatar
                        }
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <Icon size={32} weight={isActive ? "fill" : "regular"} />
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
