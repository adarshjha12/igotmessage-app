"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Search, UserCheck, UserPlus } from "lucide-react";
import axios from "axios";
import { useAppSelector } from "@/store/hooks";

type User = {
  _id: string;
  userName: string;
  fullName: string;
  profilePicture?: string;
  avatar: string;
  followers: string[];
  following: string[];
};

interface FollowersListProps {
  userId: string;
  type: "followers" | "following" | "people";
}

interface UsersListProps {
  users: User[];
  myId: string;
  isFollowing?: boolean;
}

const UsersList = ({ users, myId }: UsersListProps) => {
  const [isFollowing, setIsFollowing] = useState<Record<string, boolean>>({});

  const url =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL
      : process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL;

  const handleFollow = async (targetUserId: string) => {
    try {
      if (myId && targetUserId) {
        if (isFollowing[targetUserId]) {
          const res = await axios.post(
            `${url}/api/profile/follow-toggle`,
            {
              currentUserId: myId,
              targetUserId: targetUserId,
            },
            { withCredentials: true }
          );

          if (res.status === 200) console.log(res.data);

          setIsFollowing((prev) => ({ ...prev, [targetUserId]: false }));
        } else {
          const res = await axios.post(
            `${url}/api/profile/follow-toggle`,
            {
              currentUserId: myId,
              targetUserId,
            },
            { withCredentials: true }
          );

          if (res.status === 200) console.log(res.data);

          setIsFollowing((prev) => ({ ...prev, [targetUserId]: true }));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (users.some((user) => user.followers?.includes(myId))) {
      users?.forEach((user) => {
        user.followers?.includes(myId) &&
          setIsFollowing((prev) => ({ ...prev, [user._id]: true }));
      });
    }
    return () => {};
  }, [users, myId]);

  return (
    <div className="flex flex-col w-full">
      {users?.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bgColor)]/60 transition-all duration-200 group w-full"
        >
          {/* Wrap only avatar + name in Link */}
          <Link
            href={`/public-profile/${user._id}/myId/${myId}`}
            className="flex items-center gap-3 min-w-0 w-full"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={user.profilePicture?.trim() || user.avatar}
                alt={user.userName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col min-w-0 w-full">
              <span className="text-[var(--textColor)] font-semibold text-sm truncate">
                @{user.userName}
              </span>
              <span className="text-xs text-gray-400 truncate">
                {user.fullName || "Active user"}
              </span>
            </div>
          </Link>

          {/* Follow button stays outside */}
          <button
            onClick={() => handleFollow(user._id)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-sm hover:scale-[1.01] ${
              isFollowing[user._id]
                ? "bg-gray-100 text-gray-800"
                : "bg-gradient-to-r from-blue-500 to-blue-800 text-white"
            }`}
          >
            {isFollowing[user._id] ? (
              <UserCheck size={16} />
            ) : (
              <UserPlus size={16} />
            )}
            {isFollowing[user._id] ? "Following" : "Follow"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default function FollowersList({ userId, type }: FollowersListProps) {
  const myId = useAppSelector((state) => state.auth.user._id);
  const [users, setUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  const url =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL
      : process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL;

  // Fetch initial users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        if (type === "followers" || type === "following") {
          const res = await axios.get(
            `${url}/api/profile/get-followers?userId=${userId}&type=${type}`,
            { withCredentials: true }
          );
          if (res.data) setUsers(res.data.total);
        } else {
          const res = await axios.get(
            `${url}/api/search/get-all-people?userId=${userId}`,
            {
              withCredentials: true,
            }
          );
          if (res.data) setUsers(res.data.users);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [userId, type]);

  // Search effect
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${url}/api/search/${type}?q=${query}`,
          { userId: myId, type },
          { withCredentials: true }
        );
        setSearchResults(res.data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="flex flex-col w-full h-screen px-4 py-4 shadow-sm">
      {/* 🔍 Search Bar (sticky at top) */}
      <div className="flex items-center gap-2 py-3 px-2 sm:px-4 rounded-xl bg-[var(--wrapperColor)] sticky top-4 z-10">
        <Search size={18} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder={`Search ${type}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-[var(--textColor)] placeholder-gray-400"
        />
      </div>

      {/* Scrollable User List */}
      <div className="flex-1 mt-4 overflow-y-auto">
        {loading ? (
          <div className="animate-pulse w-full space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-[var(--wrapperColor)] rounded-xl"
              />
            ))}
          </div>
        ) : query.length > 0 ? (
          searchResults.length ? (
            <UsersList users={searchResults} myId={myId} />
          ) : (
            <p className="text-center text-gray-500 py-6">No results found</p>
          )
        ) : users?.length ? (
          <UsersList users={users} myId={myId} />
        ) : (
          <p className="text-center text-gray-500 py-6">No {type} yet.</p>
        )}
      </div>
    </div>
  );
}
