"use client";
import { useEffect, useState } from "react";
import { Send, Smile, ChevronDown, ChevronUp, X, UserIcon } from "lucide-react";
import axios from "axios";
import { useAppSelector } from "@/store/hooks";
import PopupWithLink from "@/components/popups/PopupWithLink";
import { formatDistanceToNowStrict } from "date-fns";
import NewLoader from "@/components/NewLoader";

interface ReplyType {
  _id: string;
  user: {
    _id: string;
    userName: string;
    profilePicture: string;
    avatar: string;
  };
  text: string;
  updatedAt: string;
}

interface CommentType {
  _id: string;
  user: {
    _id: string;
    userName: string;
    profilePicture: string;
    avatar: string;
  };
  text: string;
  postId: string;

  createdAt: string;
  updatedAt: string;
  replies?: ReplyType[];
}

export default function Comment({ postId }: { postId: string }) {
  const userId = useAppSelector((state) => state.auth.user._id);
  const isGuest = useAppSelector((state) => state.auth.user.isGuest);
  const [showGuestError, setShowGuestError] = useState(false);
  const profilePicture = useAppSelector(
    (state) => state.auth.user.profilePicture
  );
  const [loading, setLoading] = useState(false);

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}`;

  const [comments, setComments] = useState<CommentType[]>([]);
  const [input, setInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<null | {
    replierId: string;
    commentId: string;
    userName: string;
  }>(null);
  const [expandedReplies, setExpandedReplies] = useState<{
    [key: string]: boolean;
  }>({});

  const handleAddComment = async function (postId: string, userId: string) {
    try {
      const res = await axios.post(
        `${url}/api/comment/add-comment`,
        { postId, userId, text: input },
        { withCredentials: true }
      );
      if (res.data) {
        setComments((prev) => [res.data.comment, ...prev]);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleAddReply = async (userId: string, commentId: string) => {
    try {
      console.log(replyingTo);

      const res = await axios.post(
        `${url}/api/comment/add-reply`,
        { userId, commentId, text: input },
        { withCredentials: true }
      );

      if (res.data) {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  replies: [res.data.reply, ...(comment.replies ?? [])],
                }
              : comment
          )
        );
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSend = async function () {
    if (isGuest) {
      setShowGuestError(true);
      return;
    } else if (input === "") {
      return;
    } else {
      setShowGuestError(false);
      setLoading(true);

      if (replyingTo) {
        handleAddReply(replyingTo.replierId, replyingTo.commentId);
      } else {
        handleAddComment(postId, userId);
      }
    }

    setInput("");
  };

  useEffect(() => {
    async function getComments(postId: string) {
      try {
        const res = await axios.post(
          `${url}/api/comment/get-comments`,
          { postId },
          { withCredentials: true }
        );
        if (res.data) {
          setComments((prev) => {
            const combined = [...prev, ...res.data.comments];
            const unique = Array.from(
              new Map(
                combined.map((comment) => [comment._id, comment])
              ).values()
            );
            return unique;
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (postId) {
      getComments(postId);
    }
    return () => {};
  }, [postId]);

  return (
    <div className="w-full max-w-2xl mx-auto sm:py-5 py-0 px-2 sm:px-4  backdrop-blur-lg rounded-2xl space-y-4">
      {/* Comments list */}
      <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400/40">
        {/* loader */}
        {loading && (
          <div className="flex items-center justify-center h-[50px] w-full bg-[var(--bgColor)]">
            <NewLoader color="[var(--textColor)]" />
          </div>
        )}

        {comments.map((c) => (
          <div key={c._id} className="space-y-1">
            {/* Main Comment */}
            <div className="flex gap-3 items-start group hover:bg-[var(--wrapperColor)]/50 rounded-xl p-2 transition">
              {c.user.profilePicture ? (
                <img
                  src={c.user.profilePicture}
                  alt={c.user.userName}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <img
                  src={c.user.avatar}
                  alt={c.user.userName}
                  className="w-9 h-9 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-md sm:text-sm text-[var(--textColor)]">
                    {c.user.userName}
                  </span>
                  <span className="text-xs sm:text-sm text-[var(--textColor)]/60">
                    {formatDistanceToNowStrict(new Date(c?.updatedAt ?? ""), {
                      addSuffix: true,
                    })}{" "}
                  </span>
                </div>
                <p className="text-md sm:text-xs text-[var(--textColor)] leading-relaxed">
                  {c.text}
                </p>
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() =>
                      setReplyingTo(
                        replyingTo?.commentId === c._id
                          ? null
                          : {
                              commentId: c._id,
                              replierId: userId,
                              userName: c.user.userName,
                            }
                      )
                    }
                    className="text-md sm:text-sm text-[#ff2525] font-semibold hover:underline"
                  >
                    Reply
                  </button>
                  {c.replies && c.replies.length > 0 && (
                    <button
                      onClick={() =>
                        setExpandedReplies((prev) => ({
                          ...prev,
                          [c._id]: !prev[c._id],
                        }))
                      }
                      className="flex items-center gap-1 text-md sm:text-sm text-[var(--textColor)]/80 hover:underline"
                    >
                      {expandedReplies[c._id] ? (
                        <>
                          Hide Replies <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          View Replies ({c.replies.length}){" "}
                          <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Replies */}
            {expandedReplies[c._id] && c.replies && c.replies.length > 0 && (
              <div className="ml-12 space-y-2">
                {c.replies.map((r) => (
                  <div
                    key={r._id}
                    className="flex gap-2 items-start bg-[var(--wrapperColor)]/40 rounded-xl p-2"
                  >
                    {r.user.profilePicture ? (
                      <img
                        src={r.user.profilePicture}
                        alt={r.user.userName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                       <img
                        src={r.user.avatar}
                        alt={r.user.userName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm sm:text-sm text-[var(--textColor)]">
                          {r.user.userName}
                        </span>
                        <span className="text-[10px] sm:text-sm text-[var(--textColor)]/60">
                          {formatDistanceToNowStrict(
                            new Date(r?.updatedAt ?? ""),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--textColor)]">
                        {r.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Shared Input Box */}
      <div className="space-y-2">
        {replyingTo && (
          <div className="flex items-center justify-between text-lg sm:text-sm text-white bg-blue-500 px-3 py-1 rounded-md">
            Replying to{" "}
            <span className="font-semibold">{replyingTo.userName}</span>
            <button
              onClick={() => {
                setReplyingTo(null);
                setInput("");
              }}
              className="text-white hover:text-red-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 px-4 py-0">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={"user"}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className=" rounded-full p-1 bg-[var(--bgColor)] border border-gray-400/50 text-[var(--textColor)]">
              <UserIcon strokeWidth={2} className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          )}
          <input
            type="text"
            autoFocus
            placeholder={replyingTo ? "Add a reply..." : "Add a comment..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent outline-none text-base text-[var(--textColor)] placeholder:text-[var(--textColor)]/60"
          />
          <button
            onClick={handleSend}
            className="py-2 px-4 active:scale-90 active:opacity-35 hover:scale-105 transition duration-100 text-[var(--textColor)] text-lg font-semibold "
          >
            {/* <Send className="w-5 h-5" /> */} Add
          </button>
        </div>
      </div>
      {showGuestError && (
        <PopupWithLink
          linkHref="/login"
          linkText="signup"
          type="error"
          message="Sorry, Guest users can't comment"
          show={showGuestError}
          onClose={() => setShowGuestError(false)}
        />
      )}
    </div>
  );
}
