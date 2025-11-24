import { Loader2 } from "lucide-react";
import React from "react";


interface PostButtonProps {
    showPoll: boolean;
    remaining: number;
    canPost: boolean ;
    posting: boolean;
    handleSubmit: () => void
}
const PostButton = React.memo(
  ({ showPoll, remaining, canPost, posting, handleSubmit }: PostButtonProps) => {
    return (
      <>
        {/* post button */}
        <div className="flex items-center justify-between">
            {!showPoll && (
                <span
              className={`text-sm ${
                remaining < 0 ? "text-red-400" : "text-[var(--textColor)]"
              }`}
            >
              {remaining} characters left
            </span>
            )}
            <button
              onClick={handleSubmit}
              disabled={!canPost || posting}
              className="bg-[var(--textColor)] text-[var(--bgColor)] px-6 py-2 rounded-full flex items-center gap-2 disabled:opacity-50"
            >
              {posting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Post"}
            </button>
          </div>
      </>
    );
  }
);

export default PostButton;
