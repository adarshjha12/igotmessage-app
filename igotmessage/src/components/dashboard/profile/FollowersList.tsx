"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Search, UserCheck, UserPlus } from "lucide-react";
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
  type: "followers" | "following" | "people";
}

export default function FollowersList({ userId, type }: FollowersListProps) {
  const myId = useAppSelector((state) => state.auth.user._id);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  const url =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL
      : process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (type === "followers" || type === "following") {
          setLoading(true);
          const res = await axios.get(
            `${url}/api/profile/get-followers?userId=${userId}&type=${type}`,
            { withCredentials: true }
          );

          if (res.data) {
            setUsers(res.data.total);
          }
        } else {
          const res = await axios.get(`${url}/api/search/get-all-people`, {
            withCredentials: true,
          });

          if (res.data) {
            setUsers(res.data.users);
          }
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
      <div className="w-full overflow-hidden h-screen bg-[var(--bgColor)] px-4 pt-4 animate-pulse">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg mb-2 ">
            {/* Profile Pic */}
           <div  className="flex items-center gap-3 p-3 rounded-lg mb-2 ">
             <div className="h-10 w-10 rounded-full bg-[var(--wrapperColor)]" />

            {/* Username */}
            <div className="flex-1">
              <div className="h-4 w-1/3 bg-[var(--wrapperColor)] rounded" />
            </div>
           </div>
            {/* button */}
            <div className="flex-1">
              <div className="h-4 w-1/3 bg-[var(--wrapperColor)] rounded" />
            </div>
          </div>
        ))}
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
    <div className="flex w-full px-4 flex-col min-h-screen py-4 shadow-sm overflow-hidden">
      {/* 🔍 Search Bar */}
      <div className="flex items-center gap-2 py-3 px-2 sm:px-4 rounded-xl  bg-[var(--wrapperColor)]">
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
      <div className="flex flex-col gap-2">
        {users?.map((user) => (
          <Link
            key={user._id}
            href={`/public-profile/${user._id}/myId/${myId}`}
            className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[var(--bgColor)]/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={user.profilePicture?.trim() || user.avatar}
                  alt={user.userName}
                  className="w-full bg-gray-500 h-full object-cover"
                />
              </div>

              {/* Username */}
              <span className="text-[var(--textColor)] font-medium text-sm truncate">
                @{user.userName}
              </span>
            </div>

            <button
              // onClick={handleFollow}
              className={` flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all hover:shadow-sm hover:scale-[1.01]
                     ${
                       isFollowing
                         ? "bg-gray-100 text-gray-800"
                         : "bg-gradient-to-r from-blue-500 to-blue-800 text-white"
                     }
                  `}
            >
              {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
              {isFollowing ? "Following" : "Follow"}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
