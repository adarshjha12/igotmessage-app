// CreateProfileModal.tsx
"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import validator from "validator";
import {
  Camera,
  ImageIcon,
  User,
  Heading,
  Info,
  Check,
  ImagePlus,
  XIcon,
  CheckCircle,
  CheckCircle2Icon,
  ArrowUp,
  ArrowUpRight,
  EditIcon,
} from "lucide-react";
import Link from "next/link";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";

export default function CreateProfileModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [createProfileClicked, setCreateProfileClicked] = useState(false);
  const [boxCheckedMessage, setBoxCheckedMessage] = useState("");

  const [usernameError, setUsernameError] = useState<string>("");

  const [fullnameError, setFullnameError] = useState<string>("");
  validator.isAlpha(fullName);
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    // Validate username: must start with letter, can have letters, numbers, - _ .
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_.-]*$/;
    if (value && !usernameRegex.test(value)) {
      setUsernameError(
        'Username must start with a letter and can include numbers, "-", "_", "."'
      );
    } else if (!value) {
      setUsernameError("");
    } else if (value.length < 3) {
      setUsernameError("Username must be at least 3 characters");
    } else {
      setUsernameError("Good to go");
    }
  };

  const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setFullName(value);
    if (!validator.isAlpha(fullName, "en-US", { ignore: " " })) {
      setFullnameError(
        "Fullname must start with a letter and can include spaces"
      );
    } else if (!value) {
      setFullnameError("");
    } else if (value.length < 3) {
      setFullnameError("Fullname must be at least 3 characters");
    } else {
      setFullnameError("Good to go");
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

  const handleCreateProfile = () => {
    if (username && bio && fullName && !acceptedTerms) {
      setBoxCheckedMessage("Please check the box ");
    } else if (username && bio && fullName && acceptedTerms) {
      setBoxCheckedMessage("");

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
          <DialogTitle className="text-2xl font-semibold text-center flex justify-center items-center gap-4">
            <EditIcon size={30} strokeWidth={1} className="text-[var(--textColor)]" />
            Hey, create your profile
          </DialogTitle>
          <p className="text-sm text-[var(--textColor)] text-center">
            It takes just one minute.
          </p>
          <form action="/dgthfhf">
            {/* Cover photo */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
                id="coverInput"
                required
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
                  FullName
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={handleFullnameChange}
                    placeholder="Mitchell Starc"
                    className={`w-full px-3 py-2  ${
                      fullnameError === "Good to go" &&
                      "border-1 border-green-500"
                    } ${
                      fullnameError !== "Good to go" &&
                      fullnameError !== "" &&
                      "border-1 border-red-500"
                    } rounded-lg bg-[var(--wrapperColor)]  focus:outline-none ${
                      fullnameError
                        ? "focus:ring-red-500"
                        : "focus:ring-primary"
                    }`}
                  />
                  <div className="absolute top-2 right-2">
                    {fullnameError === "Good to go" && (
                      <CheckCircleIcon
                        size={24}
                        weight={"fill"}
                        className="text-green-500"
                      />
                    )}
                    {fullnameError !== "Good to go" && fullnameError !== "" && (
                      <XCircleIcon
                        size={24}
                        weight={"fill"}
                        className="text-red-500"
                      />
                    )}
                  </div>
                </div>
                {fullnameError && (
                  <p
                    className={`text-md font-medium ${
                      fullnameError !== "Good to go"
                        ? "text-red-500"
                        : "text-green-500"
                    } mt-1`}
                  >
                    {fullnameError}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Starts with letter; can use numbers & - _ ."
                    className={`w-full px-3 py-2  ${
                      usernameError === "Good to go" &&
                      "border-1 border-green-500"
                    } ${
                      usernameError !== "Good to go" &&
                      usernameError !== "" &&
                      "border-1 border-red-500"
                    } rounded-lg bg-[var(--wrapperColor)]  focus:outline-none ${
                      usernameError
                        ? "focus:ring-red-500"
                        : "focus:ring-primary"
                    }`}
                  />
                  <div className="absolute top-2 right-2">
                    {usernameError === "Good to go" && (
                      <CheckCircleIcon
                        size={24}
                        weight={"fill"}
                        className="text-green-500"
                      />
                    )}
                    {usernameError !== "Good to go" && username !== "" && (
                      <XCircleIcon
                        size={24}
                        weight={"fill"}
                        className="text-red-500"
                      />
                    )}
                  </div>
                </div>
                {usernameError && (
                  <p
                    className={`text-md font-medium ${
                      usernameError !== "Good to go"
                        ? "text-red-500"
                        : "text-green-500"
                    } mt-1`}
                  >
                    {usernameError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={bio}
                  required
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us something about you..."
                  rows={3}
                  className="w-full px-3 py-2  border-gray-300  rounded-lg bg-[var(--wrapperColor)] focus:outline-none "
                />
              </div>
              <div className="flex flex-col py-2 items-start gap-0">
                <div className="flex py-2 items-center gap-2">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked);
                      setBoxCheckedMessage("");
                    }}
                    className="accent-green-500 rounded-4xl h-6 w-6"
                    id="terms"
                  />
                  <label htmlFor="terms" className="text-xs">
                    I agree to the{" "}
                    <strong className="text-sm">
                      <Link href="/terms">terms and conditions</Link>
                    </strong>
                  </label>
                </div>
                {boxCheckedMessage && (
                  <div>
                    <ArrowUp size={20} className="text-red-500" />
                    <p className="text-md font-bold text-red-500">
                      {boxCheckedMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              onClick={handleCreateProfile}
              className="w-full my-2 py-2 px-4 bg-primary  rounded-lg text-white font-medium hover:bg-primary/90 disabled:opacity-90 bg-gradient-to-r from-blue-500 to-blue-950 transition"
            >
              Create Profile
            </button>
          </form>
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
