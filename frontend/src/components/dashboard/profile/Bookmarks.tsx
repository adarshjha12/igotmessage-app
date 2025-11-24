"use client";
import NewLoader from "@/components/NewLoader";
import PostItem from "@/components/post/PostItem";
import Posts, { Post } from "@/components/post/Posts";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import React, { useEffect, useState } from "react";

function Bookmarks() {
  const [posts, setPosts] = useState<Post[]>([]);
  const userId = useAppSelector((state) => state.auth.user._id);
  const [loading, setLoading] = useState(false);

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/post/get-bookmarked-posts`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/post/get-bookmarked-posts`;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${url}?userId=${userId}`, {
          withCredentials: true,
        });
        if (res.data) {
          setPosts(res.data.posts || []);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[var(--bgColor)]">
        <NewLoader color="[var(--textColor)]" />
      </div>
    );
  }

  return (
    <div className="w-full py-4 min-h-screen flex justify-center">
      {posts.map((post) => {
        return <PostItem key={post._id} post={post} />;
      })}
    </div>
  );
}

export default Bookmarks;
