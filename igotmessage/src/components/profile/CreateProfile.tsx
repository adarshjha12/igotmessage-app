// CreateProfileModal.tsx
"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import {
  Camera,
  ImageIcon,
  User,
  Heading,
  Info,
  Check,
  ImagePlus,
  XIcon,
} from "lucide-react";

export default function CreateProfileModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [usernameError, setUsernameError] = useState<string | null>(null);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    // Validate username: must start with letter, can have letters, numbers, - _ .
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_.-]*$/;
    if (value && !usernameRegex.test(value)) {
      setUsernameError(
        'Username must start with a letter and can include numbers, "-", "_", "."'
      );
    } else {
      setUsernameError(null);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCoverImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed z-50 inset-0 text-[var(--textColor)] overflow-y-auto bg-black/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <DialogPanel className="w-full relative max-w-lg bg-[var(--bgColor)] rounded-2xl shadow-2xl p-6 space-y-6">
          <DialogTitle className="text-2xl font-semibold text-center flex flex-col items-center gap-1">
            Hey, create your profile
          </DialogTitle>
          <p className="text-sm text-gray-500 text-center">
            It takes just one minute.
          </p>

          {/* Cover photo */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
              id="coverInput"
            />
            <label
              htmlFor="coverInput"
              className="block w-full h-40 bg-[var(--wrapperColor)] rounded-xl cursor-pointer overflow-hidden relative"
            >
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Cover"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImagePlus
                    size={50}
                    strokeWidth={1}
                    className=" text-gray-400"
                  />
                </div>
              )}
            </label>
          </div>

          {/* Profile photo */}
          <div className="flex justify-center -mt-16">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileChange}
                className="hidden"
                id="profileInput"
              />
              <label
                htmlFor="profileInput"
                className="block w-32 h-32 rounded-full border-2 border-blue-600/50 bg-[var(--wrapperColor)] overflow-hidden cursor-pointer"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </label>
              <div className="p-2 absolute bottom-2 right-2 rounded-full bg-[var(--wrapperColor)]">
                <Camera size={18} className=" " />
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2  border-[var(--borderColor)]  rounded-lg bg-[var(--wrapperColor)] focus:outline-none "
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Starts with letter; can use numbers & - _ ."
                className={`w-full px-3 py-2  ${
                  usernameError ? "border-red-500" : "border-gray-300 "
                } rounded-lg bg-[var(--wrapperColor)]  focus:outline-none ${
                  usernameError ? "focus:ring-red-500" : "focus:ring-primary"
                }`}
              />
              {usernameError && (
                <p className="text-xs text-red-500 mt-1">{usernameError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us something about you..."
                rows={3}
                className="w-full px-3 py-2  border-gray-300  rounded-lg bg-[var(--wrapperColor)] focus:outline-none "
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="accent-blue-500 h-6 w-6"
                id="terms"
              />
              <label htmlFor="terms" className="text-sm">
                I agree to the terms and conditions
              </label>
            </div>
          </div>

          {/* Button */}
          <button
            disabled={!acceptedTerms}
            className="w-full py-2 px-4 bg-primary  rounded-lg text-white font-medium hover:bg-primary/90 disabled:opacity-90 bg-gradient-to-r from-blue-500 to-blue-950 transition"
          >
            Create Profile
          </button>
          <div className="absolute top-2 right-2">
            <button type="button">
              <XIcon
                strokeWidth={1.5}
                size={35}
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setIsOpen && setIsOpen(false)}
              />
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
