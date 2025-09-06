import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Post } from "./Posts";
import PostItem from "./PostItem";
import { ArrowLeft, ChevronLeftIcon } from "lucide-react";
import { ArrowLeftIcon } from "@phosphor-icons/react";

export default function UserPostPage() {
    const router = useRouter();
  const params = useParams()
  const { userId, postId } = params;
  const containerRef = useRef<HTMLDivElement>(null);

  const [posts, setPosts] = useState<Post[]>([]);

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}`;

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      const res = await axios.get(`${url}/api/post/get-single-user-post?userId=${userId}`);
      setPosts(res.data.posts || []);
    };

    fetchPosts();
  }, [userId]);

  useEffect(() => {
    if (posts.length && postId && containerRef.current) {
      const element = document.getElementById(`post-${postId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [posts, postId]);

  return (
    <div
      ref={containerRef}
      className="w-screen pt-12 max-w-[600px] min-h-screen overflow-y-auto text-[var(--textColor)] bg-[var(--bgColor)]"
    > 
     <button type="button" onClick={() => router.back()} className="p-2 fixed top-0 left-0 flex items-center gap-4 w-full text-[var(--textColor)] z-40 bg-[var(--bgColor)] backdrop-blur-lg">
        <ChevronLeftIcon size={34} strokeWidth={2}/>
        <span className="text-lg font-semibold">Back</span>
      </button>

      {posts.map((post) => (
        <div
          key={post._id}
          id={`post-${post._id}`}
          className="mb-6 sm:px-4 bg-[var(--cardColor)] rounded-xl shadow-md"
        >
          <PostItem post={post} />
        </div>
      ))}
    </div>
  );
}
