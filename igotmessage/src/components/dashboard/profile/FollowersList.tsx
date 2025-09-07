"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import axios from "axios";
import { useAppSelector } from "@/store/hooks";

type User = {
  _id: string;
  userName: string;
  profilePicture?: string;
  avatar: string;
};

interface FollowersListProps {
  userId: string;
  type: "followers" | "following";
}

export default function FollowersList({ userId, type }: FollowersListProps) {
  const myId = useAppSelector((state) => state.auth.user._id);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const url =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL
      : process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${url}/api/profile/get-followers?userId=${userId}&type=${type}`
        );

        if (res.data) {
          setUsers(res.data.total);                    
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [userId, type]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--textColor)]" />
      </div>
    );
  }

  if (users?.length === 0) {
    return (
      <p className="text-center min-h-screen text-lg text-gray-500 py-6">
        No {type} yet.
      </p>
    );
  }

  return (
    <div className="flex w-full px-4 flex-col min-h-screen py-4 bg-[var(--wrapperColor)] shadow-sm overflow-hidden">
      {/* 🔍 Search Bar */}
      <div className="flex items-center gap-2 py-3 px-2 sm:px-4 rounded-xl border-b border-[var(--shadowBorder)] bg-[var(--bgColor)]">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder={`Search ${type}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-[var(--textColor)] placeholder-gray-400"
        />
      </div>

      {/* Users List */}
      <div className="flex flex-col divide-y divide-[var(--shadowBorder)]">
        {users?.map((user) => (
          <Link
            key={user._id}
            href={`/public-profile/${user._id}/myId/${myId}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bgColor)]/60 transition-colors"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={user.profilePicture?.trim() || user.avatar}
                alt={user.userName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Username */}
            <span className="text-[var(--textColor)] font-medium text-sm truncate">
              @{user.userName}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
