"use client";

import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { CheckCircle2, XCircle, UploadCloud } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setShowStoryUploadModal } from "@/features/storySlice";

export default function UploadStory() {
  const dispatch = useAppDispatch();
  const uploadStatus = useAppSelector((state) => state.story.uploadStoryStatus);
  const showStoryUploadModal = useAppSelector(
    (state) => state.story.showStoryUploadModal
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      progress < 90 && setProgress((prev) => prev + 10);
    }, 500);
    return () => clearInterval(interval);
  }, [progress]);

  const getStatusUI = () => {
    switch (uploadStatus) {
      case "loading":
        return {
          icon: null,
          title: "Uploading Story...",
          message: "Hold tight! Your story is uploading.",
        };
      case "succeeded":
        return {
          icon: <CheckCircle2 className="h-10 w-10 text-green-500" />,
          title: "Uploaded Successfully!",
          message: "Your story is now live.",
        };
      case "failed":
        return {
          icon: <XCircle className="h-10 w-10 text-red-500" />,
          title: "Upload Failed!",
          message: "Something went wrong. Please try again.",
        };
    }
  };

const { icon, title, message } = getStatusUI() ?? {
  icon: null,
  title: "",
  message: "",
};

  return (
    <Transition show={showStoryUploadModal} as={Fragment}>
      <Dialog
        onClose={() => dispatch(setShowStoryUploadModal(false))}
        className="relative z-[9999]"
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-[var(--wrapperColor)] p-6 text-center shadow-xl transition-all">
              {icon && <div className="flex justify-center mb-4">{icon}</div>}

              <Dialog.Title
                as="h3"
                className="text-xl font-semibold text-[var(--textColor)]"
              >
                {title}
              </Dialog.Title>
              <p className="mt-2 text-[var(--textColor)]/70">{message}</p>

              {uploadStatus === "loading" && (
                <div className="mt-6 w-full">
                  <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-[var(--textColor)]/60 mt-1">
                    {progress}%
                  </p>
                </div>
              )}

              {uploadStatus !== "loading" && (
                <div className="mt-6">
                  <button
                    onClick={() => dispatch(setShowStoryUploadModal(false))}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-12 py-2 text-white shadow-md transition hover:bg-blue-700 active:scale-95"
                  >
                    Close
                  </button>
                </div>
              )}
            </Dialog.Panel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
