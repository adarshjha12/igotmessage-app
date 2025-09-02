"use client";

import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostItem from "./PostItem";
import NewLoader from "@/components/NewLoader";
import axios from "axios";

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
  };
  mediaUrls?: string[];
  templateImage?: string;
  text?: string;
  postType?: "normal" | string;
  privacy?: "public" | "private";
  poll?: {
    question: string;
    options: { text: string; votes?: string[] }[];
  };
  pollVotes?: string[];
  musicData?: MusicData;
  likes?: string[];
  shares?: string[];
  comments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}`;

  const fetchPosts = async () => {
    const res = await axios.get(`${url}/api/post/get-posts?page=${page}`);
    const data = await res.data;
    console.log(data.posts);

    const parsedPosts =
      typeof data.posts === "string" ? JSON.parse(data.posts) : data.posts;

    console.log(parsedPosts[0].privacy);

    setPosts((prev) => {
      const merged = [...prev, ...parsedPosts];
      const uniquePosts = Array.from(
        new Map(merged.map((post) => [post._id, post])).values()
      );

      return uniquePosts;
    });
    setHasMore(data.hasMore);
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={() => setPage((p) => p + 1)}
      hasMore={hasMore}
      loader={
        <div className="w-full h-[100px] flex justify-center items-center">
          {hasMore ? "loading..." : "No more posts"}
        </div>
      }
      // loader={<div className="w-full h-[100px] justify-center items-start"><NewLoader color="[var(--textColor)]"/></div>}
    >
      <div className="flex flex-col gap-6">
        {posts.map((post: Post) => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
