"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  MessageSquare,
  Phone,
  Search,
  UserCheck,
  UserPlus,
} from "lucide-react";
import axios from "axios";
import { useAppSelector } from "@/store/hooks";
import { useSearchParams } from "next/navigation";
import { UsersThreeIcon } from "@phosphor-icons/react";

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
  type: "followers" | "following" | "people" | "chats";
}

interface UsersListProps {
  users: User[];
  myId: string;
  isFollowing?: boolean;
  type: "followers" | "following" | "people" | "chats";
}

const UsersList = ({ users, myId, type }: UsersListProps) => {
  const [isFollowing, setIsFollowing] = useState<Record<string, boolean>>({});

  const url =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL
      : process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL;

  const handleFollow = async (targetUserId: string) => {
    if (!myId || !targetUserId) return;

    // Save previous state to rollback if needed
    const prevFollowing = isFollowing[targetUserId];

    // Optimistically update UI
    setIsFollowing((prev) => ({
      ...prev,
      [targetUserId]: !prevFollowing,
    }));

    try {
      const res = await axios.post(
        `${url}/api/profile/follow-toggle`,
        {
          currentUserId: myId,
          targetUserId,
        },
        { withCredentials: true }
      );

      // Optional: rollback if server response is not OK
      if (res.status !== 200) {
        setIsFollowing((prev) => ({
          ...prev,
          [targetUserId]: prevFollowing,
        }));
        console.error("Follow toggle failed on server:", res.data);
      }
    } catch (err) {
      // Rollback UI on network/error
      setIsFollowing((prev) => ({
        ...prev,
        [targetUserId]: prevFollowing,
      }));
      console.error("Error toggling follow:", err);
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
    <div className="flex items-center flex-col w-full">
      {users?.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bgColor)]/60 transition-all duration-200  w-full"
        >
          {/* Wrap only avatar + name in Link */}
          <Link
            href={
              type === "chats"
                ? `/chats/${user._id}?avatar=${
                    user.profilePicture || user.avatar
                  }&userName=${user.userName}&recieverId=${
                    user._id
                  }&senderId=${myId}`
                : `/public-profile/${user._id}/myId/${myId}`
            }
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
          {type !== "chats" ? (
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
          ) : (
            <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-sm hover:scale-[1.01] bg-[var(--wrapperColor)] text-[var(--textColor)]">
              <MessageSquare size={16} />
              <Phone size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default function AllUsers({ userId, type }: FollowersListProps) {
  const myId = JSON.parse(localStorage.getItem("userId") as string);
  const [users, setUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const params = useSearchParams();

  const backupUserId = params.get("userId");

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
            `${url}/api/profile/get-followers?userId=${
              userId || backupUserId
            }&type=${type}`,
            { withCredentials: true }
          );
          if (res.data) setUsers(res.data.total);
        } else {
          const res = await axios.get(
            `${url}/api/search/get-all-people?userId=${userId ?? backupUserId}`,
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

    if (userId || backupUserId) {
      fetchUsers();
    }

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
          { userId: myId || backupUserId, type },
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
    <div className="flex flex-col h-screen items-center w-full px-4 py-4 ">
      {/* 🔍 Search Bar (sticky at top) */}
      {type !== "chats" && (
        <div className="w-full max-w-[600px] sticky top-4 z-10">
          <div className="flex items-center gap-2 py-3 px-3 sm:px-4 rounded-xl bg-[var(--wrapperColor)]">
            <Search size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder={`Search ${type}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-[var(--textColor)] placeholder-gray-400"
            />
          </div>
        </div>
      )}

      {type === "chats" && (
        <div className="font-bold text-xl gap-4 tracking-wider flex w-full items-center justify-center py-2 px-4 rounded-md ">
          <div className="p-2 bg-[var(--textColor)]/15 rounded-full">
            <UsersThreeIcon size={30} />
          </div>
          Recommended Chats
        </div>
      )}

      {/* Scrollable User List */}
      <div className="flex-1 mt-4 overflow-y-auto scroll-hidden w-full max-w-[600px]">
        {loading ? (
          <div className="animate-pulse w-full space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-(--wrapperColor) rounded-xl"
              />
            ))}
          </div>
        ) : query.length > 0 ? (
          searchResults.length ? (
            <UsersList type={type} users={searchResults} myId={myId!} />
          ) : (
            <p className="text-center text-gray-500 py-6">No results found</p>
          )
        ) : users?.length ? (
          <UsersList users={users} type={type} myId={myId!} />
        ) : (
          <p className="text-center text-gray-500 py-6">No {type} yet.</p>
        )}
      </div>
    </div>
  );
}
