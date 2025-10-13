"use client";

import {
  HouseIcon,
  MagnifyingGlassIcon,
  PlusSquareIcon,
  VideoCameraIcon,
  UserCircleIcon,
  XIcon,
  HamburgerIcon,
  HeartIcon,
  VideoCameraSlashIcon,
  ChatTeardropIcon,
  ArrowLeftIcon,
  CameraIcon,
  ChatsCircleIcon,
  ChatTeardropTextIcon,
  ChatCircleDotsIcon,
  ListIcon,
  ChatTeardropDotsIcon,
  BookmarkSimpleIcon,
} from "@phosphor-icons/react";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Panel from "../Panel";
import { setPanelOpen } from "@/features/activitySlice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { RootState } from "@/store/store";
import CameraCapture from "../Camera";
import { log } from "console";
import {
  MoreVertical,
  PlusCircleIcon,
  SearchIcon,
  SidebarCloseIcon,
  SidebarIcon,
  PlaySquare,
  UserIcon,
  ChevronLeftIcon,
  LucideSettings,
} from "lucide-react";
import Link from "next/link";
import CreateProfileModal from "./profile/CreateProfile";
import UploadStory from "../modals/UploadStory";
import ProfileUpdateModal from "../modals/UpdateProfileModal";
import { setPostId, setProfileUpdateStatus } from "@/features/authSlice";
import { setUploadStoryStatus } from "@/features/storySlice";
import {
  setShowPostUploadModal,
  setUploadPostStatus,
} from "@/features/postSlice";
import BottomNav from "./BottomNav";
import FollowersList from "./profile/AllUsers";
import UploadPostModal from "../modals/UploadPostModal";
import PopupWithLink from "../popups/PopupWithLink";

function Dashboard({ children }: { children: ReactNode }) {
  const uploadStoryStatus = useAppSelector(
    (state) => state.story.uploadStoryStatus
  );
  const uploadPostStatus = useAppSelector(
    (state) => state.post.uploadPostStatus
  );
  const postingStatus = useAppSelector((state) => state.post.uploadPostStatus);
  const isReposted = useAppSelector((state) => state.post.isReposted);
  const postId = useAppSelector((state) => state.post.postId);
  const userIdInPost = useAppSelector((state) => state.post.userIdInPost);

  const updateProfileStatus = useAppSelector(
    (state) => state.auth.user.updateProfileStatus
  );
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);

  const myId = useAppSelector((state: RootState) => state.auth.user._id);

  const userName = useAppSelector(
    (state: RootState) => state.auth.user.userName
  );
  const fullName = useAppSelector(
    (state: RootState) => state.auth.user.fullName
  );

  const isGuest = useAppSelector((state: RootState) => state.auth.user.isGuest);
  const profilePicture = useAppSelector(
    (state: RootState) => state.auth.user.profilePicture
  );

  const panelOpen = useAppSelector(
    (state: RootState) => state.activity.panelOpen
  );
  const showStoryUploadModal = useAppSelector(
    (state: RootState) => state.story.showStoryUploadModal
  );

  const showPostUploadMooal = useAppSelector(
    (state: RootState) => state.post.showPostUploadModal
  );
  const showProfileUpdateModal = useAppSelector(
    (state: RootState) => state.auth.user.showProfileUpdateModal
  );
  const [searchInput, setSearchInput] = useState("");
  const [searchInputClick, setSearchInputClick] = useState(false);
  const [cameraClick, setCameraClick] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const profilePic = useAppSelector((state) => state.auth.user.profilePicture);
  const avatar = useAppSelector((state) => state.auth.user.avatar);
  const [showPostUploadSuccessPopup, setShowPostUploadSuccessPopup] =
    useState(false);

  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);

  const RandomNumber = useMemo(() => {
    return Math.floor(Math.random() * 10000 + 1);
  }, []);

  useEffect(() => {
    if (!userName && !isGuest) {
      setShowCreateProfileModal(true);
    }
  }, [userName]);

  useEffect(() => {
    if (
      updateProfileStatus === "succeeded" ||
      uploadStoryStatus === "succeeded" ||
      uploadPostStatus === "succeeded"
    ) {
      const timeout = setTimeout(() => {
        if (updateProfileStatus === "succeeded") {
          dispatch(setProfileUpdateStatus("idle"));
        }
        if (uploadStoryStatus === "succeeded") {
          dispatch(setUploadStoryStatus("idle"));
        }
        if (uploadPostStatus === "succeeded") {
          dispatch(setUploadPostStatus("idle"));
        }
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [updateProfileStatus, uploadStoryStatus, uploadPostStatus, dispatch]);

  useEffect(() => {
    if (showMoreModal && pathname !== "/login") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showMoreModal]);

  useEffect(() => {
    if (postingStatus === "succeeded" && isReposted) {
      dispatch(setPostId(postId ?? ""));
      dispatch(setShowPostUploadModal(false));
      console.log("post id", postId);
      setShowPostUploadSuccessPopup(true);
    }
  }, [postingStatus, postId, dispatch]);

  return (
    <div
      className={`w-full z-20 h-full bg-[var(--bgColor)] text-[var(--textColor)]  flex items-start justify-center relative`}
    >
      <div
        className={` w-full flex items-start justify-center transition-colors duration-200 relative `}
      >
        <div
          className={`
    w-full grid grid-cols-1 sm:gap-2 
    justify-items-stretch sm:justify-items-center
    items-center sm:items-start
    ${
      sidebarOpen
        ? "md:[grid-template-columns:1fr_2fr] lg:[grid-template-columns:1fr_2fr_1.5fr]"
        : "md:[grid-template-columns:0.2fr_2fr] lg:[grid-template-columns:0.5fr_4fr_2fr]"
    }
    transition-all duration-200 ease-in
  `}
        >
          {/* header starts here */}
          <header
            className={`
    md:hidden sticky top-0 z-20
    w-full flex items-center justify-between
    px-3 py-2
    bg-[var(--bgColor)]/80 backdrop-blur-lg
    
    shadow-sm
    duration-300 ${
      pathname.includes("/dash/chats") || pathname.includes("/dash/calls")
        ? "hidden"
        : ""
    }
  `}
          >
            {/* Left section: back button + title */}
            <div className="flex items-center gap-3">
              {pathname !== "/dash/feed" && (
                <button
                  type="button"
                  className="px-2 rounded-full hover:bg-[var(--wrapperColor)]/40 active:scale-90 transition"
                  onClick={() => router.back()}
                >
                  <ChevronLeftIcon size={34} strokeWidth={2} />
                </button>
              )}
              <p
                className={`cursor-pointer font-medium select-none transition-all duration-200 ease-in 
        ${
          pathname === "/dash/feed"
            ? "font-montez font-medium text-3xl"
            : "text-3xl font-semibold"
        }
        ${isDark ? "text-white" : "text-black"}
      `}
              >
                {pathname === "/dash/feed"
                  ? "IGotMessage"
                  : pathname === "/dash/create"
                  ? "Create"
                  : pathname === "/dash/chats"
                  ? "Chats"
                  : pathname === "/reels"
                  ? "Reels"
                  : pathname === "/dash/calls"
                  ? "Calls"
                  : pathname === "/dash/notifications"
                  ? "Notifications"
                  : pathname === "/dash/search"
                  ? "All users"
                  : pathname === "/dash/profile/settings"
                  ? "Settings & More"
                  : pathname === "/dash/profile/bookmarks"
                  ? "Bookmarks"
                  : pathname.includes("/dash/profile/followers")
                  ? "Followers"
                  : pathname.includes("/dash/profile/following")
                  ? "Following"
                  : pathname === "/dash/profile"
                  ? userName || `NewUser${RandomNumber}`
                  : ""}
              </p>
            </div>

            {/* Right section: action icons */}
            <div className="flex items-center gap-2">
              {/* Camera (only on feed) */}
              {pathname === "/dash/feed" && (
                <button
                  onClick={() => setCameraClick((prev) => !prev)}
                  className="p-2 rounded-full hover:bg-[var(--wrapperColor)]/40 active:scale-110 transition"
                  type="button"
                >
                  <CameraIcon size={28} strokeWidth={1.5} />
                </button>
              )}

              {/* Search (only on feed) */}
              {pathname === "/dash/feed" && (
                <Link
                  href={"/dash/search"}
                  className="p-2 rounded-full hover:bg-[var(--wrapperColor)]/40 active:scale-110 transition"
                  type="button"
                >
                  <MagnifyingGlassIcon
                    size={28}
                    strokeWidth={1.5}
                    weight={
                      (pathname as string) === "/dash/notifications"
                        ? "fill"
                        : "regular"
                    }
                  />
                </Link>
              )}
              {pathname === "/dash/profile" && (
                <Link
                  href={"/dash/profile/bookmarks"}
                  className="p-2 rounded-full hover:bg-[var(--wrapperColor)]/40 active:scale-110 transition"
                  type="button"
                >
                  <BookmarkSimpleIcon
                    size={26}
                    strokeWidth={1.5}
                    weight={
                      (pathname as string) === "/dash/notifications"
                        ? "fill"
                        : "regular"
                    }
                  />
                </Link>
              )}
              {pathname === "/dash/profile" && (
                <Link
                  href={"/dash/profile/settings"}
                  className="p-2 rounded-full hover:bg-[var(--wrapperColor)]/40 active:scale-110 transition"
                  type="button"
                >
                  <LucideSettings size={26} strokeWidth={1.5} />
                </Link>
              )}

              {/* Heart (only on feed) */}
              {pathname === "/dash/feed" && (
                <Link
                  href={"/dash/notifications"}
                  className="p-2 rounded-full hover:bg-[var(--wrapperColor)]/40 active:scale-110 transition"
                  type="button"
                >
                  <HeartIcon
                    size={28}
                    strokeWidth={1.5}
                    weight={
                      (pathname as string) === "/dash/notifications"
                        ? "fill"
                        : "regular"
                    }
                  />
                </Link>
              )}

              {/* More menu */}
              {/* <button
                type="button"
                className="p-2 rounded-full hover:bg-[var(--wrapperColor)]/40 active:scale-90 transition"
                onClick={() => setShowMoreModal((prev) => !prev)}
              >
                <MoreVertical
                  size={26}
                  strokeWidth={1.5}
                  className={isDark ? "text-white" : "text-black"}
                />
              </button> */}
            </div>

            {/* Overlay for modal */}
            {showMoreModal && (
              <button
                type="button"
                onClick={() => setShowMoreModal(false)}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              />
            )}
          </header>

          {/* header ends here */}

          {/* nav for desktop starts here (1st column for desktop) */}

          <nav
            className={`hidden md:flex col-span-1 px-4 mt-1 overflow-y-auto  h-screen transition-all duration-200 ease-in border-[var(--borderColor)] pb-20 right-slide my-2 rounded-xl flex-col gap-4 sticky top-3 text-[var(--textColor)] justify-start `}
          >
            <div
              className={`flex items-center justify-center gap-3 
              bg-[var(--bgColor)] py-2 mb-8 rounded-full text-[var(--textColor)]
              ${sidebarOpen ? "px-4" : "px-0 bg-transparent"}
            `}
            >
              {/* Title */}
              {sidebarOpen && (
                <Link href="/dash/feed" className="flex items-center">
                  <p className="font-montez text-2xl font-semibold leading-none">
                    IGotMessage
                  </p>
                </Link>
              )}

              {/* Toggle Button */}
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                type="button"
                title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[var(--wrapperColor)] transition"
              >
                {sidebarOpen ? (
                  <SidebarCloseIcon
                    className="hover:scale-110 transition-transform"
                    strokeWidth={1.5}
                    size={30}
                  />
                ) : (
                  <SidebarIcon
                    className="hover:scale-110  transition-transform"
                    strokeWidth={1.5}
                    size={30}
                  />
                )}
              </button>
            </div>

            {/* FEED */}
            <Link
              href="/dash/feed"
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 font-medium text-xl sm:text-sm ease-in px-3 py-1 rounded-full cursor-pointer active:bg-[var(--wrapperColor)] hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] active:rounded-full active:scale-90 ${
                pathname === "/dash/feed"
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <HouseIcon size={22} strokeWidth={1.5} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Feed</p>
            </Link>

            {/* CAMERA - Still a button */}
            <button
              onClick={() => setCameraClick((prev) => !prev)}
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 font-medium text-xl sm:text-sm hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] ease-in px-3 py-1 rounded-full cursor-pointer active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90`}
              type="button"
            >
              <CameraIcon strokeWidth={1.5} size={22} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Camera</p>
            </button>

            {/* search */}
            <Link
              href={"/dash/search"}
              className={` ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 font-medium text-xl sm:text-sm hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] hidden md:flex lg:hidden ease-in px-3 py-1 rounded-full cursor-pointer active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90`}
              type="button"
            >
              <SearchIcon strokeWidth={1.5} size={22} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Search</p>
            </Link>

            {/* CREATE */}
            <Link
              href="/dash/create"
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 font-medium text-xl sm:text-sm hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] px-3 py-1 rounded-full cursor-pointer ease-in active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90 ${
                pathname === "/dash/create"
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <PlusSquareIcon strokeWidth={1.5} size={22} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Create</p>
            </Link>

            {/* MESSAGES */}
            <Link
              href="/dash/chats"
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 font-medium text-xl sm:text-sm hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] px-3 py-1 rounded-full cursor-pointer ease-in active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90 ${
                pathname === "/dash/chats"
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <ChatsCircleIcon strokeWidth={1.5} size={22} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Messages</p>
            </Link>

            {/* REELS */}
            <Link
              href={`/reels?myId=${myId}&myPic=${profilePicture || avatar}`}
              className={`font-medium ${
                sidebarOpen ? "w-full" : "w-fit"
              } gap-2 justify-start px-3 text-xl sm:text-sm py-1 hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] rounded-full flex items-center cursor-pointer active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90 ${
                pathname === "/reels"
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <PlaySquare strokeWidth={1.5} size={22} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Reels</p>
            </Link>

            {/* CALLS */}
            <Link
              href="/dash/calls"
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } font-medium justify-start items-center gap-2 text-xl sm:text-sm px-3 hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] py-1 rounded-full cursor-pointer ease-in active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90 ${
                pathname === "/dash/calls"
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <VideoCameraIcon strokeWidth={1.5} size={22} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Calls</p>
            </Link>

            {/* NOTIFICATIONS */}
            <Link
              href="/dash/notifications"
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 font-medium text-xl sm:text-sm hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] px-3 py-1 rounded-full cursor-pointer ease-in active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90 ${
                pathname === "/dash/notifications"
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <HeartIcon strokeWidth={1.5} size={22} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Notifications</p>
            </Link>

            {/* PROFILE */}
            <Link
              href="/dash/profile"
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 font-medium text-xl sm:text-sm hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] px-3 py-1 rounded-full cursor-pointer active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90 ${
                pathname === "/dash/profile"
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <div className=" flex items-center justify-center rounded-full bg-gradient-to-br   hover:scale-105 transition-transform duration-300 ease-out">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="profilePic"
                    className="w-6 h-6 rounded-xl"
                  />
                ) : (
                  <img
                    src={avatar!}
                    alt="avatar"
                    className="w-6 h-6 rounded-xl"
                  />
                )}
              </div>
              <p
                className={`${
                  sidebarOpen ? "" : "hidden"
                } text-[var(textColor)]`}
              >
                {userName !== "" ? userName + " (You)" : "You"}
              </p>
            </Link>

            {/* PANEL TOGGLE - Still a button */}
            <button
              onClick={() => dispatch(setPanelOpen(!panelOpen))}
              type="button"
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 active:bg-[var(--wrapperColor)] text-xl sm:text-sm hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] px-3 py-1 rounded-full active:rounded-full active:scale-90 font-medium cursor-pointer z-10`}
            >
              <div
                className={`${
                  panelOpen
                    ? "flex items-center gap-2 opacity-100 scale-100"
                    : "opacity-0 scale-0 hidden"
                }`}
              >
                <XIcon
                  size={22}
                  className={`${panelOpen ? "rotate-180" : "rotate-0"}`}
                  strokeWidth={2}
                />
                <p className={`${sidebarOpen ? "" : "hidden"}`}>Close</p>
              </div>
              <div
                className={`${
                  !panelOpen
                    ? "flex items-center gap-2 opacity-100 scale-100"
                    : "opacity-0 scale-0"
                }`}
              >
                <ListIcon size={22} />
                <p className={`${sidebarOpen ? "" : "hidden"}`}>Menu</p>
              </div>
            </button>
          </nav>

          {/* nav for desktop ends here */}

          {/* main starts here (2nd column for desktop) */}
          <main
            className={`pb-10 w-full lg:pt-2 sm:px-4 px-0 flex flex-col overflow-x-hidden justify-center items-center col-span-1`}
          >
            {children}
          </main>
          {/* main ends here */}

          {/* nav for mobile starts here */}

          <BottomNav pathname={pathname} />

          {/* nav for mobile ends here */}

          {/* third column for desktop starts here */}
          <div className="col-span-1 hidden w-full sticky top-2 lg:block my-2 mx-2">
            <div className="overflow-y-auto max-h-[90vh]">
              <FollowersList userId={myId} type="people" />
            </div>
          </div>
        </div>

        {panelOpen && (
          <div
            onClick={() => dispatch(setPanelOpen(false))}
            className="fixed inset-0 bg-black/70 z-30"
          ></div>
        )}

        {/* pannel component */}
        {panelOpen ? <Panel /> : null}

        {/* camera component */}
        {cameraClick ? (
          <div
            className={` justify-center items-start ${
              cameraClick ? "flex" : "hidden"
            }`}
          >
            <CameraCapture
              clickedFromHome={true}
              setCameraOpen={setCameraClick}
            />
          </div>
        ) : (
          ""
        )}
      </div>

      {/* moodal for create profile if no username exist */}
      {showCreateProfileModal && (
        <CreateProfileModal
          isOpen={showCreateProfileModal}
          newUser={true}
          onClose={() => setShowCreateProfileModal(false)}
        />
      )}

      {/* modal for story upload  */}
      {/* when user upload story inside create-story page whether upload success or not, we show this modal*/}
      {showStoryUploadModal && <UploadStory />}
      {showProfileUpdateModal && <ProfileUpdateModal />}
      {showPostUploadMooal && <UploadPostModal />}
      {showPostUploadSuccessPopup && (
        <PopupWithLink
          linkHref={`/post/${postId}/user/${userIdInPost}`}
          linkText="View Post"
          show={showPostUploadSuccessPopup}
          type="success"
          message="Reposted Successfully"
          onClose={() => setShowPostUploadSuccessPopup(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
