"use client";

import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostItem from "./PostItem";
import NewLoader from "@/components/NewLoader";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { setPosts } from "@/features/postSlice";

export interface MusicData {
  title?: string;
  artist?: string;
  genre?: string;
  url?: string;
  image?: string;
}

export interface Post {
  _id: string;
  user: {
    profilePicture: string;
    userName: string;
    _id: string;
    avatar: string;
  };
  whoReposted?: {
    profilePicture: string;
    userName: string;
    _id: string;
    avatar: string;
  };
  isReposted: boolean;
  repostCaption: string;
  mediaUrls?: string[];
  templateImage?: string;
  text?: string;
  postType?: "normal" | "poll";
  privacy?: "public" | "private";
  poll?: {
    question: string;
    options: { _id: string; text: string; votes?: string[] }[];
  };
  musicData?: MusicData;
  likes?: string[];
  shares?: string[];
  comments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function Posts() {
  const posts = useAppSelector((state: RootState) => state.post.posts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useAppDispatch();
  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}`;

  const fetchPosts = async () => {
    const res = await axios.get(`${url}/api/post/get-posts?page=${page}`);
    const data = await res.data;

    const parsedPosts =
      typeof data.posts === "string" ? JSON.parse(data.posts) : data.posts;

    dispatch(setPosts(parsedPosts));
    setHasMore(data.hasMore);
  };

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, [page]);

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={() => setPage((p) => p + 1)}
      hasMore={hasMore}
      loader={
        <div className="w-full px-4 justify-center items-start">
          {hasMore ? (
            <div className="w-full animate-pulse">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-[var(--wrapperColor)]" />
                <div className="flex-1">
                  <div className="h-4 w-1/3 bg-[var(--wrapperColor)] rounded mb-1" />
                  <div className="h-3 w-1/4 bg-[var(--wrapperColor)] rounded" />
                </div>
              </div>

              {/* Post image/video */}
              <div className="w-full h-[300px] bg-[var(--wrapperColor)] rounded" />

              {/* Actions */}
              <div className="flex gap-4 mt-3">
                <div className="h-6 w-6 bg-[var(--wrapperColor)] rounded" />
                <div className="h-6 w-6 bg-[var(--wrapperColor)] rounded" />
                <div className="h-6 w-6 bg-[var(--wrapperColor)] rounded" />
              </div>

              {/* Caption */}
              <div className="mt-2 space-y-2">
                <div className="h-3 w-2/3 bg-[var(--wrapperColor)] rounded" />
                <div className="h-3 w-1/2 bg-[var(--wrapperColor)] rounded" />
              </div>
            </div>
          ) : (
            "No more posts"
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {posts.map((post: Post) => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
