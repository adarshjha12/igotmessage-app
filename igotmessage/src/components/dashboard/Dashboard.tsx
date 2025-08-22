"use client";

import {
  HouseIcon,
  MagnifyingGlassIcon,
  PlusSquareIcon,
  PlayIcon,
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
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import MainModal from "../modals/MainModal";
import CreateProfileModal from "../create profile/CreateProfile";
import UploadModal from "../modals/UploadStory";
import ProfileUpdateModal from "../modals/UpdateProfileModal";

function Dashboard({ children }: { children: ReactNode }) {
  const uploadStatus = useAppSelector((state) => state.story.uploadStoryStatus);
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);
  
  const userName = useAppSelector(
    (state: RootState) => state.auth.user.userName
  );
  const fullName = useAppSelector(
    (state: RootState) => state.auth.user.fullName
  );

  const isGuest = useAppSelector((state: RootState) => state.auth.user.isGuest);

  const panelOpen = useAppSelector(
    (state: RootState) => state.activity.panelOpen
  );
  const showStoryUploadModal = useAppSelector(
    (state: RootState) => state.story.showStoryUploadModal
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
  const avatar = useAppSelector(state => state.auth.user.profilePicture);

  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);

  const RandomNumber = useMemo(() => {
    return Math.floor(Math.random() * 10000 + 1);
  }, []);

  function handleNavClick(path: string) {
    if (pathname !== path) {
      router.push(path);
    }
  }

  useEffect(() => {
    if (!userName && !isGuest) {
      setShowCreateProfileModal(true);
    }
    console.log("username", userName);
    console.log("setShowCreateProfileModal", showCreateProfileModal);
    
    return () => {
      
    };
  }, [userName]);

  return (
    <div
      className={`w-full z-20 h-full bg-[var(--bgColor)] text-[var(--textColor)]  flex items-start justify-center relative`}
    >
      <div
        className={` w-full flex items-start justify-center transition-colors duration-200 relative `}
      >
        <div
          className={` w-full grid grid-cols-1  items-center sm:items-start transition-all duration-200 ease-in ${
            sidebarOpen
              ? "md:[grid-template-columns:1fr_2fr] lg:[grid-template-columns:1fr_2.5fr_1.5fr]"
              : "md:gap-5 md:[grid-template-columns:1fr_5fr] lg:[grid-template-columns:1fr_5fr_3fr]"
          }`}
        >
          {/* header starts here */}
          <header className=" md:hidden bg-[var(--bgColor)] down-slide sticky z-10 top-0 w-full md:border-none flex justify-between py-2 px-2 items-center ">
            <div className="flex items-center gap-3 pl-4">
              {pathname !== "/dash/feed" && (
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => router.back()}
                >
                  <ArrowLeftIcon size={25} strokeWidth={1} />
                </button>
              )}
              <p
                className={`md:hidden ${
                  pathname === "/dash/feed" ? "font-montez  text-4xl" : ""
                } text-2xl active:bg-[var(--wrapperColor)] transition-all  duration-100 rounded-full active:scale-75 ${isDark ? "font-[500]" : "font-[600]"} cursor-pointer ease-in `}
              >
                {pathname === "/dash/feed"
                  ? "IGotMessage"
                  : pathname === "/dash/create"
                  ? "Create"
                  : pathname === "/dash/chats"
                  ? "Messages"
                  : pathname === "/reels"
                  ? "Reels"
                  : pathname === "/dash/calls"
                  ? "Calls"
                  : pathname === "/dash/notifications"
                  ? "Notifications"
                  : pathname === "/dash/profile"
                  ? `${userName ? userName : `NewUser${RandomNumber}` }`
                  : ""}
              </p>
            </div>
            {/* <Brand scalemd={true} /> */}
            <div className="flex items-center justify-center">
              <button
                onClick={() => {
                  setCameraClick((prev) => !prev);
                }}
                className={`cursor-pointer ${
                  pathname !== "/dash/feed" && "hidden"
                } active:bg-[var(--wrapperColor)] px-2 rounded-full active:scale-125`}
                type="button"
              >
                <div>
                  <CameraIcon size={33} className="" strokeWidth={1.5} />
                </div>
              </button>
              <button
                onClick={() => {
                  handleNavClick("/dash/notifications");
                }}
                className={`cursor-pointer px-2 active:bg-[var(--wrapperColor)] rounded-full active:scale-125 ${
                  pathname !== "/dash/feed" && "hidden"
                }`}
                type="button"
              >
                <div>
                  <MagnifyingGlassIcon
                    size={33}
                    className=""
                    strokeWidth={1.5}
                    weight={
                      pathname === "/dash/notifications" ? "fill" : "regular"
                    }
                  />
                </div>
              </button>

              <button
                onClick={() => {
                  handleNavClick("/dash/notifications");
                }}
                className={`cursor-pointer px-2 active:bg-[var(--wrapperColor)] rounded-full active:scale-125 ${
                  pathname !== "/dash/feed" && "hidden"
                }`}
                type="button"
              >
                <div>
                  <HeartIcon
                    size={33}
                    className=""
                    strokeWidth={1.5}
                    weight={
                      pathname === "/dash/notifications" ? "fill" : "regular"
                    }
                  />
                </div>
              </button>

              <button
                type="button"
                className="cursor-pointer pr-1 active:bg-[var(--wrapperColor)] rounded-full active:scale-75"
                onClick={() => setShowMoreModal((prev) => !prev)}
              >
                <MoreVertical
                  size={30}
                  strokeWidth={1}
                  fill={isDark ? "white" : "black"}
                />
              </button>
              {showMoreModal && <MainModal closeModal={setShowMoreModal} />}
              {showMoreModal && (
                <button
                  type="button"
                  onClick={() => setShowMoreModal(false)}
                  className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                ></button>
              )}
            </div>
          </header>
          {/* header ends here */}

          {/* nav for desktop starts here (1st column for desktop) */}

          <nav
            className={`px-4 mt-1 overflow-y-auto  h-screen transition-all duration-200 ease-in border-[var(--borderColor)] pb-20 right-slide hidden my-2 md:flex rounded-xl flex-col gap-4  text-[var(--textColor)] justify-start ${
              !sidebarOpen ? "items-center" : ""
            } md:sticky md:top-2 `}
          >
            <div
              className={`flex items-center gap-4 bg-[var(--bgColor)] py-2 mb-8 rounded-full justify-center text-[var(--textColor)] ${
                sidebarOpen ? "px-4" : "px-0 bg-transparent"
              }`}
            >
              <Link href="/dash/feed">
                <p
                  className={`font-montez z-10 text-3xl cursor-pointer font-[600] ${
                    sidebarOpen ? "" : "hidden"
                  }`}
                >
                  IGotMessage
                </p>
              </Link>
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                type="button"
                title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                className="cursor-pointer flex items-center justify-center"
              >
                {sidebarOpen ? (
                  <SidebarCloseIcon
                    className="hover:scale-125 transition-all"
                    strokeWidth={1.5}
                    size={33}
                  />
                ) : (
                  <SidebarIcon
                    className="hover:scale-125 transition-all"
                    strokeWidth={1.5}
                    size={33}
                  />
                )}
              </button>
            </div>

            {/* FEED */}
            <Link
              href="/dash/feed"
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 font-medium text-xl ease-in px-3 py-1 rounded-full cursor-pointer active:bg-[var(--wrapperColor)] hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] active:rounded-full active:scale-90 ${
                pathname === "/dash/feed"
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <HouseIcon size={28} strokeWidth={1.5} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Feed</p>
            </Link>

            {/* CAMERA - Still a button */}
            <button
              onClick={() => setCameraClick((prev) => !prev)}
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 font-medium text-xl hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] ease-in px-3 py-1 rounded-full cursor-pointer active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90`}
              type="button"
            >
              <CameraIcon strokeWidth={1.5} size={28} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Camera</p>
            </button>

            {/* search */}
            <button
              className={` ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 font-medium text-xl hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] hidden md:flex lg:hidden ease-in px-3 py-1 rounded-full cursor-pointer active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90`}
              type="button"
            >
              <SearchIcon strokeWidth={1.5} size={28} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Search</p>
            </button>

            {/* CREATE */}
            <Link
              href="/dash/create"
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 font-medium text-xl hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] px-3 py-1 rounded-full cursor-pointer ease-in active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90 ${
                pathname === "/dash/create"
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <PlusSquareIcon strokeWidth={1.5} size={28} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Create</p>
            </Link>

            {/* MESSAGES */}
            <Link
              href="/dash/chats"
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 font-medium text-xl hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] px-3 py-1 rounded-full cursor-pointer ease-in active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90 ${
                pathname === "/dash/chats"
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <ChatsCircleIcon strokeWidth={1.5} size={28} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Messages</p>
            </Link>

            {/* REELS */}
            <Link
              href="/reels"
              className={`font-medium ${
                sidebarOpen ? "w-full" : "w-fit"
              } gap-2 justify-start px-3 text-xl py-1 hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] rounded-full flex items-center cursor-pointer active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90 ${
                pathname === "/reels"
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <PlayIcon strokeWidth={1.5} size={28} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Reels</p>
            </Link>

            {/* CALLS */}
            <Link
              href="/dash/calls"
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } font-medium justify-start items-center gap-2 text-xl px-3 hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] py-1 rounded-full cursor-pointer ease-in active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90 ${
                pathname === "/dash/calls"
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <VideoCameraIcon strokeWidth={1.5} size={28} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Calls</p>
            </Link>

            {/* NOTIFICATIONS */}
            <Link
              href="/dash/notifications"
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 font-medium text-xl hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] px-3 py-1 rounded-full cursor-pointer ease-in active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90 ${
                pathname === "/dash/notifications"
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <HeartIcon strokeWidth={1.5} size={28} />
              <p className={`${sidebarOpen ? "" : "hidden"}`}>Notifications</p>
            </Link>

            {/* PROFILE */}
            <Link
              href="/dash/profile"
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 font-medium text-xl hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] px-3 py-1 rounded-full cursor-pointer active:bg-[var(--wrapperColor)] active:rounded-full active:scale-90 ${
                pathname === "/dash/profile"
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <div className=" flex items-center justify-center rounded-full bg-gradient-to-br text-[var(--textColor)]  hover:scale-105 transition-transform duration-300 ease-out">
                 {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="w-6 h-6 rounded-xl"
                    />
                  ) : (
                    <div className=" flex items-center justify-center rounded-full transition-transform duration-300 ease-out">
                      <UserIcon
                        size={28}
                        strokeWidth={1.2}
                        className="text-[var(textColor)] group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
              </div>
              <p className={`${sidebarOpen ? "" : "hidden"} text-[var(textColor)]`}>{userName !== "" ? userName + " (You)" : "You"}</p>
            </Link>

            {/* PANEL TOGGLE - Still a button */}
            <button
              onClick={() => dispatch(setPanelOpen(!panelOpen))}
              type="button"
              className={`flex ${
                sidebarOpen ? "w-full" : "w-fit"
              } justify-start items-center gap-2 active:bg-[var(--wrapperColor)] text-xl hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] px-3 py-1 rounded-full active:rounded-full active:scale-90 font-medium cursor-pointer z-10`}
            >
              <div
                className={`${
                  panelOpen
                    ? "flex items-center gap-2 opacity-100 scale-100"
                    : "opacity-0 scale-0 hidden"
                }`}
              >
                <XIcon
                  size={28}
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
                <ListIcon size={28} />
                <p className={`${sidebarOpen ? "" : "hidden"}`}>Menu</p>
              </div>
            </button>
          </nav>

          {/* nav for desktop ends here */}

          {/* main starts here (2nd column for desktop) */}
          <main className="pb-10 sm:px-5 px-2 flex flex-col justify-center items-center">
            {children}
          </main>
          {/* main ends here */}

          {/* nav for mobile starts here */}

          <nav className="w-full py-3 bg-[var(--bgColor)] border-y-1 border-[var(--shadowBorder)] px-2 md:hidden flex fixed left-0 bottom-0">
            <div className="w-full items-center flex justify-between">
              <Link
                href="/dash/feed"
                className={`flex flex-col items-center justify-center relative gap-1 cursor-pointer active:bg-[var(--wrapperColor)]`}
              >
                <div
                  className={`flex flex-col rounded-xl ${
                    pathname === "/dash/feed"
                      ? "bg-[var(--navButtonColor)]"
                      : ""
                  } px-4 items-center justify-center gap-1`}
                >
                  <HouseIcon
                    size={25}
                    weight={pathname === "/dash/feed" ? "fill" : "regular"}
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-sm opacity-70 font-medium">Home</p>
              </Link>

              <Link
                href="/dash/create"
                className={`flex flex-col items-center justify-center relative gap-1 cursor-pointer active:bg-[var(--wrapperColor)]`}
              >
                <div
                  className={`flex flex-col rounded-xl ${
                    pathname === "/dash/create"
                      ? "bg-[var(--navButtonColor)]"
                      : ""
                  } px-4 items-center justify-center gap-1`}
                >
                  <PlusSquareIcon
                    size={25}
                    weight={pathname === "/dash/create" ? "fill" : "regular"}
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-sm opacity-70 font-medium">Create</p>
              </Link>

              {/* Messages */}
              <Link
                href="/dash/chats"
                className={`flex flex-col items-center justify-center relative gap-1 cursor-pointer active:bg-[var(--wrapperColor)]`}
              >
                <div
                  className={`flex flex-col rounded-xl ${
                    pathname === "/dash/chats"
                      ? "bg-[var(--navButtonColor)]"
                      : ""
                  } px-4 items-center justify-center gap-1`}
                >
                  <ChatsCircleIcon
                    size={25}
                    weight={pathname === "/dash/chats" ? "fill" : "regular"}
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-sm opacity-70 font-medium">Messages</p>
              </Link>

              {/* Reels */}
              <Link
                href="/reels"
                className={`flex flex-col items-center justify-center relative gap-1 cursor-pointer active:bg-[var(--wrapperColor)]`}
              >
                <div
                  className={`flex flex-col rounded-xl ${
                    pathname === "/reels" ? "bg-[var(--navButtonColor)]" : ""
                  } px-4 items-center justify-center gap-1`}
                >
                  <PlayIcon
                    size={25}
                    weight={pathname === "/reels" ? "fill" : "regular"}
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-sm opacity-70 font-medium">Reels</p>
              </Link>

              {/* Calls */}
              <Link
                href="/dash/calls"
                className={`flex flex-col items-center justify-center relative gap-1 cursor-pointer active:bg-[var(--wrapperColor)]`}
              >
                <div
                  className={`flex flex-col rounded-xl ${
                    pathname === "/dash/calls"
                      ? "bg-[var(--navButtonColor)]"
                      : ""
                  } px-4 items-center justify-center gap-1`}
                >
                  <VideoCameraIcon
                    size={25}
                    weight={pathname === "/dash/calls" ? "fill" : "regular"}
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-sm opacity-70 font-medium">Calls</p>
              </Link>

              {/* Profile */}
              <Link
                href="/dash/profile"
                className={`flex flex-col items-center justify-center relative gap-1 cursor-pointer active:bg-[var(--wrapperColor)]`}
              >
                <div
                  className={`flex flex-col rounded-xl ${
                    pathname === "/dash/profile"
                      ? "bg-[var(--navButtonColor)]"
                      : ""
                  } px-4 items-center justify-center gap-1`}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="w-6 h-6 rounded-xl"
                    />
                  ) : (
                    <div className=" flex items-center justify-center rounded-full bg-gradient-to-br  shadow-md hover:scale-105 transition-transform duration-300 ease-out group">
                      <UserIcon
                        size={25}
                        strokeWidth={1.2}
                        className="text-[var(--textColor)] group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>
                <p className="text-sm opacity-70 font-medium">{"You"}</p>
              </Link>
            </div>
          </nav>
          {/* nav for mobile ends here */}

          {/* third column for desktop starts here */}
          <div className="hidden lg:flex my-2 mx-2 sticky top-2">
            <div className="relative w-full ">
              <div
                className={`flex items-center bg-[var(--wrapperColor)] transition-all ease-in-out duration-300 px-3 border-1 border-[var(--borderColor)] rounded-full 
                    ${
                      searchInputClick
                        ? "opacity-100 w-full"
                        : "opacity-0 w-20 sm:opacity-100 sm:w-full"
                    } 
                  `}
              >
                <MagnifyingGlassIcon className="w-5 h-5 text-[var(--textColor)]" />

                <input
                  value={searchInput}
                  onClick={() => setSearchInputClick((prev) => !prev)}
                  onBlur={() => {
                    setSearchInputClick((prev) => !prev);
                    setSearchInput("");
                  }}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="search"
                  placeholder="Search"
                  className="ml-2 w-full h-10 px-4 py-2 bg-transparent text-[var(--textColor)] placeholder:text-gray-500 text-base rounded-full outline-none border-none"
                />
              </div>

              <MagnifyingGlassIcon
                size={30}
                className={`absolute top-1 right-2 p-1 text-[var(--textColor)] rounded-full transition-all duration-300 pointer-events-none 
                      ${searchInputClick ? "opacity-0" : "sm:opacity-0"}
                    `}
              />
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
      {showCreateProfileModal && <CreateProfileModal isOpen={showCreateProfileModal} newUser={true} onClose={() => setShowCreateProfileModal(false)}/>}

      {/* modal for story upload  */}
      {/* when user upload story inside create-story page whether upload success or not, we show this modal*/}
      {showStoryUploadModal && <UploadModal />}
      {showProfileUpdateModal && <ProfileUpdateModal />}
    </div>
  );
}

export default Dashboard;