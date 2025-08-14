"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks"; // adjust path as per your app
import { Pencil, PlusCircle, User, Image, UserCircle } from "lucide-react";
import CreateProfileModal from "@/components/create profile/CreateProfile";
import PopupMessages from "@/components/popups/PopupMessages";
import Link from "next/link";
import { setProfileUpdateStatus } from "@/features/authSlice";

export default function ProfileComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const profileUpdateStatus = useAppSelector(
    (state) => state.auth.user.updateProfileStatus
  );
  const [editProfileClick, setEditProfileClick] = React.useState(false);

  const [showPopup, setShowPopup] = React.useState(false);
  // const [showProfileModal, setShowProfileModal] = React.useState(false);

  const onClose = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    if (profileUpdateStatus === "succeeded") {
      setShowPopup(true);
    }
    const timeout = setTimeout(() => {
      dispatch(setProfileUpdateStatus("idle"));
    }, 10000);
    return () => {
      clearTimeout(timeout)
    };
  }, [profileUpdateStatus]);

  const closeProfileModal = () => {
    setEditProfileClick(false);
  };

  return (
    <div className="w-full min-h-screen py-6 max-w-xl mx-auto rounded-2xl overflow-hidden bg-[var(--bgColor)] shadow-lg">
      {/* Cover Photo */}
      <div className="relative rounded-2xl h-48 bg-gray-300">
        {user?.coverPhoto ? (
          <img
            src={user.coverPhoto}
            alt="Cover"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full  flex items-center justify-center">
            <Image
              size={50}
              strokeWidth={1}
              className="text-[var(--bgColor)]"
            />
          </div>
        )}

        {/* Profile Photo */}
        <div className="absolute left-4  bottom-[-40px]">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full bg-gray-300 border-4 border-[var(--bgColor)] object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-[var(--bgColor)] bg-gray-300 flex items-center justify-center">
              <User size={40} className="text-gray-500" />
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-14 px-4 pb-6 text-[var(--textColor)]">
        <h2 className="text-xl font-semibold">
          {user?.fullName || "Full Name"}
        </h2>
        <p className="text-sm text-gray-400">
          @{user?.userName || "username123"}
        </p>
        <p className="mt-2 text-sm">
          {user?.bio || "This is a short bio about the user."}
        </p>

        {/* Buttons */}
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => setEditProfileClick(true)}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-[var(--textColor)] text-[var(--bgColor)] active:opacity-55 cursor-pointer font-medium shadow-sm hover:scale-[1.03] transition"
          >
            <Pencil size={18} />
            Edit Profile
          </button>
          <Link href={"/create-story"}>
            <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-[var(--textColor)] text-[var(--bgColor)] font-medium active:opacity-55 cursor-pointer shadow-sm hover:scale-[1.03] transition">
              <PlusCircle size={18} />
              Add Story
            </button>
          </Link>
        </div>
      </div>
      {editProfileClick && (
        <CreateProfileModal
          onClose={closeProfileModal}
          isOpen={editProfileClick}
        />
      )}
      {profileUpdateStatus === "succeeded" && (
        <div>
          <PopupMessages
            show={showPopup}
            message={"Profile updated successfully"}
            type={"success"}
            onClose={onClose}
          />
        </div>
      )}
    </div>
  );
}
