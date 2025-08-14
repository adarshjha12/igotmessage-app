// CreateProfileModal.tsx
"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  handleProfileUpdate,
  setShowProfileUpdateModal,
} from "@/features/authSlice";
import { useRouter } from "next/navigation";
import NewLoader from "../NewLoader";

interface CreateProfileModalProps {
  newUser?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProfileModal({
  newUser,
  isOpen,
  onClose,
}: CreateProfileModalProps) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user._id);
  const profileUpdateStatus = useAppSelector(
    (state) => state.auth.user.updateProfileStatus
  );
  const router = useRouter();
  const oldUserData = useAppSelector((state) => state.auth.user);
  const [profileImage, setProfileImage] = useState<File | undefined>(undefined);

  const [coverImage, setCoverImage] = useState<File | undefined>(undefined);
  const [profileImagePreview, setProfileImagePreview] = useState<
    string | undefined
  >(oldUserData?.profilePicture ?? undefined);

  const [coverImagePreview, setCoverImagePreview] = useState<
    string | undefined
  >(oldUserData?.coverPhoto ?? undefined);
  const [fullName, setFullName] = useState(oldUserData.fullName ?? "");
  const [username, setUsername] = useState(oldUserData.userName ?? "");
  const [bio, setBio] = useState(oldUserData.bio ?? "");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [boxCheckedMessage, setBoxCheckedMessage] = useState("");

  const [usernameError, setUsernameError] = useState<string>("");

  const [fullnameError, setFullnameError] = useState<string>("");
  validator.isAlpha(fullName);
  const [openModal, setOpenModal] = useState(isOpen);
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    // Validate username: must start with letter, can have letters, numbers, - _ .
    const usernameRegex = /^(?=.*\d)[a-zA-Z][a-zA-Z0-9_.-]*$/;
    if (value && !usernameRegex.test(value)) {
      setUsernameError(
        'Username must start with a letter and must include numbers, "-", "_", "."'
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
    const fullNameRegex = /^[A-Za-z][A-Za-z\s]*$/;

    if (value && !fullNameRegex.test(value)) {
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
      setProfileImage(e.target.files[0]);
      setProfileImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCoverImage(e.target.files[0]);
      setCoverImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && bio && fullName && !acceptedTerms) {
      setBoxCheckedMessage("Please check the box ");
    } else if (username && bio && fullName && acceptedTerms) {
      setBoxCheckedMessage("");
      dispatch(setShowProfileUpdateModal(true));
      await dispatch(
        handleProfileUpdate({
          userId,
          userName: username,
          fullName: fullName,
          bio,
          profilePic: profileImage ?? undefined,
          coverPic: coverImage ?? undefined,
        })
      );
    }
  };

  useEffect(() => {
    if (profileUpdateStatus === "succeeded") {
      setOpenModal(false);
      router.push("/dash/profile");
      console.log("profile update success");
    } else if (profileUpdateStatus === "failed") {
      console.log("profile update failed");
    }
  }, [profileUpdateStatus]);

  return (
    <Dialog
      open={openModal}
      onClose={onClose}
      className="fixed z-50 inset-0 text-[var(--textColor)] overflow-y-auto bg-black/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <DialogPanel className="w-full relative max-w-lg bg-[var(--bgColor)] rounded-2xl shadow-2xl p-6 space-y-6">
          <DialogTitle className="text-2xl font-semibold text-center flex justify-center items-center gap-4">
            <EditIcon
              size={30}
              strokeWidth={1}
              className="text-[var(--textColor)]"
            />
            {newUser ? "Hey, create your profile" : "Update your profile"}
          </DialogTitle>
          <p className="text-sm text-[var(--textColor)] text-center">
            It takes just one minute.
          </p>
          <form onSubmit={handleCreateProfile}>
            {/* Cover photo */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
                id="coverInput"
                name="coverInput"
              />
              <label
                htmlFor="coverInput"
                className="block w-full h-40 bg-[var(--wrapperColor)] rounded-xl cursor-pointer overflow-hidden relative"
              >
                {coverImagePreview ? (
                  <img
                    src={coverImagePreview}
                    alt="Cover"
                    className="object-contain w-full h-full"
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
                  name="profileInput"
                />
                <label
                  htmlFor="profileInput"
                  className="block w-32 h-32 rounded-full border-2 border-blue-600/50 bg-[var(--wrapperColor)] overflow-hidden cursor-pointer"
                >
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
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
                      "border-1 border-blue-500"
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
                        className="text-blue-500"
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
                        : "text-blue-500"
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
                      "border-1 border-blue-500"
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
                        className="text-blue-500"
                      />
                    )}
                    {usernameError !== "Good to go" && usernameError !== "" && (
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
                        : "text-blue-500"
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
                    className="accent-blue-500 rounded-4xl h-6 w-6"
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
              className="w-full flex justify-center items-center cursor-pointer my-2 py-2 px-4 bg-primary rounded-lg text-white font-medium hover:bg-primary/90 disabled:opacity-90 bg-gradient-to-r from-blue-500 to-blue-950 active:scale-95 active:opacity-40 transition"
            >
              {profileUpdateStatus === "loading"
                ? "Updating..."
                : `${newUser ? "Create Profile" : "Update Profile"}`}
              {profileUpdateStatus === "loading" && <NewLoader />}
            </button>
          </form>
          <div className="absolute top-2 right-2">
            <button type="button">
              <XIcon
                strokeWidth={1.5}
                size={35}
                className="text-gray-400 hover:text-gray-600"
                onClick={onClose}
              />
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
