'use client'
import { LucideHome, CrossIcon, Search, PlusSquare, PhoneCall, MenuIcon, VideoOff, LucideDelete, MessageCircleIcon, MessageSquareCodeIcon, MessageSquare, XIcon, Settings, VideoIcon, Heart, User2, VideoOffIcon, Inbox, House, CameraIcon, ArrowLeft, LucideVideo, PlaySquareIcon, PlayCircle, Sidebar, LayoutDashboard, Building,  AppWindow, PanelLeft, HomeIcon, MessageCircleDashedIcon, MessageCircle, LayersIcon, LayoutList, LayoutTemplate, SidebarIcon, SidebarCloseIcon, MessageSquareHeart, MessageSquareDashed, MessageSquareMore, MessageSquareQuote, MessageSquareReply, MessageSquareDiff } from "lucide-react";

import Skeleton from "react-loading-skeleton";
import { ReactNode, useEffect, useState } from "react";
import Toggle from "@/components/Toggle";
import Brand from "@/components/Brand";
import { useRouter, usePathname } from "next/navigation";
import Panel from "../Panel";
import {  setPanelOpen } from '@/features/activitySlice'
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import CameraCapture from "../Camera";
import { log } from "console";

function Dashboard({children} : {children: ReactNode}) {

  const isDark = useSelector( (state : RootState) => state.activity.isDark)
  const panelOpen = useSelector( (state : RootState) => state.activity.panelOpen)
  const [searchInput, setSearchInput] = useState('')
  const [searchInputClick, setSearchInputClick] = useState(false)
  const [cameraClick, setCameraClick] = useState(false)
  const [navHover, setNavHover] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  const avatar = useSelector( (state : RootState) => state.auth.user.avatar)
console.log(avatar)

  function handleNavClick(path:string) {
    if (pathname !== path ) {
      router.push(path)
    } 
  }
  
  return (
    <div className="w-full  min-h-screen bg-[var(--bgColor)] text-[var(--textColor)]  flex items-start justify-center relative">
      <div className={` w-full flex items-start justify-center transition-colors duration-200 relative `}>
          <div className={` w-full grid grid-cols-1 items-center sm:items-start transition-all duration-200 ease-in ${sidebarOpen? 'sm:[grid-template-columns:1fr_3fr_1.5fr]' : 'sm:[grid-template-columns:0fr_3fr_1.5fr]'}`}>
            {/* header starts here */}
            <header className=" sm:hidden bg-[var(--wrapperColor)] down-slide sticky z-10 top-0 border-b-2 border-[var(--shadowBorder)] w-full sm:border-none flex justify-between py-2 px-4 items-center ">
           
              <div className="flex items-center gap-3">
                <button type="button" title="menu" className="flex flex-col gap-2 rounded-full active:bg-[var(--wrapperColor)] p-2 cursor-pointer" onClick={() => dispatch(setPanelOpen(true))}>
                  <span className="w-8 h-[3px] rounded-full bg-[var(--textColor)]"></span>
                  <span className="w-4 h-[3px] rounded-full bg-[var(--textColor)]"></span>
                  <span className="w-3 h-[3px] rounded-full bg-[var(--textColor)]"></span>
                </button>
                <p className={`sm:hidden ${pathname === '/dash/feed' ? 'font-montez' : ''} font-exo2 text-3xl active:bg-[var(--wrapperColor)] transition-all  duration-100 rounded-full active:scale-75 font-[600] cursor-pointer ease-in  ${searchInputClick? 'text-xl sm:text-3xl text-left' : 'inline'}`}>{pathname === '/dash/feed' ? 'IGotMessage' : pathname === '/dash/create' ? 'Create' : pathname === '/dash/chats' ? 'Messages' : pathname === '/reels' ? 'Reels' : pathname === '/dash/calls' ? 'Calls' : pathname === '/dash/notifications' ? 'Notifications' : pathname === '/dash/profile' ? 'Profile' : ''}</p>
              </div>
              {/* <Brand scaleSm={true} /> */}
             <div className="flex gap-4.5 justify-center">                
                <button
                onClick={
                  () => {
                    handleNavClick('/dash/notifications')
                  }
                }
                className={`cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 rounded-full active:scale-125`}
                type="button">
                  <div>
                    <Heart size={33} className=""
                    strokeWidth={1.5}
                     fill={pathname === '/dash/notifications'? (isDark? 'red' : 'red') : (isDark? 'transparent' : 'transparent')}
                    />
                </div>
              </button>

              <button
               onClick={
                () => {
                  setCameraClick(prev => !prev)
                }
              }
              className={`cursor-pointer ${pathname === '/dash/calls' ? 'hidden' : pathname === '/dash/chats' ? 'hidden' : pathname === '/reels' ? 'hidden' : pathname === '/dash/profile' ? 'hidden' : 'inline'} transition-all ease-in duration-200 active:bg-[var(--wrapperColor)] rounded-full active:scale-125`}
               type="button">
                <div>
                    <CameraIcon size={33} className=""
                    strokeWidth={1.5}
                    />
                </div>
               </button>
              </div>
            </header>
            {/* header ends here */}

            {/* nav for desktop starts here (1st column for desktop) */}
          <nav onMouseEnter={() => setNavHover(true)} onMouseLeave={() => setNavHover(false)} className={`px-4 mt-1 h-screen transition-all duration-200 ease-in border-[var(--borderColor)] py-2 right-slide hidden sm:flex rounded-xl flex-col gap-4 sm:w-fit text-[var(--textColor)] bg-[var(--wrapperColor)] justify-start sticky top-0 ${navHover? 'bg-blue-600 text-white' : ''} `}>
                <div className={`flex items-center gap-4  bg-[var(--bgColor)] py-2 mb-8 rounded-full justify-center text-[var(--textColor)] ${sidebarOpen? 'px-4' : 'px-0'}`}>
                  <p
                  onClick={() => router.push('/dash/feed')}
                   className={`font-montez z-10 text-3xl cursor-pointer  font-[600] ${sidebarOpen? '' : 'hidden'}`}>IGotMessage</p>
                  <button
                  onClick={() => setSidebarOpen(prev => !prev)}
                  type="button"
                  title="open sidebar"
                  className="cursor-pointer">
                    {sidebarOpen? <SidebarCloseIcon  className="hover:scale-125 transition-all duration-100 ease-in" strokeWidth={1.5} size={33}/> : <SidebarIcon className="hover:scale-125 transition-all duration-100 ease-in"  strokeWidth={1.5} size={33}/>}
                  </button>
                </div>
                <button
                  onClick={() => handleNavClick('/dash/feed')}
                  type="button"
                  
                  className={`flex ${sidebarOpen? 'w-full' : 'w-fit'} justify-start items-center gap-2 font-medium text-xl ease-in px-3 py-1 rounded-full cursor-pointer active:bg-[var(--wrapperColor)] hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] transition duration-100 active:rounded-full active:scale-90 ${pathname === '/dash/feed' ? 'bg-[var(--textColor)] text-[var(--bgColor)]' : ''}`}>
                      <LayoutTemplate 
                      strokeWidth={1.5}
                      fill="none"
                      /> 
                      <p className={`${sidebarOpen? '' : 'hidden'}`}>Feed</p>
                      
                  </button>

                  <button
                  onClick={
                    () => {
                      setCameraClick(prev => !prev)
                    }
                  }
                  className={`flex ${sidebarOpen? 'w-full' : 'w-fit'} justify-start items-center gap-2 font-medium text-xl hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] ease-in px-3 py-1 rounded-full cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90`}
                  type="button">
                      <CameraIcon strokeWidth={1.5}
                      /> 
                      <p className={`${sidebarOpen? '' : 'hidden'}`}>Camera</p>

                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/create')}
                  type="button"
                  className={`flex ${sidebarOpen? 'w-full' : 'w-fit'} justify-start items-center gap-2 font-medium text-xl hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] px-3 py-1 rounded-full cursor-pointer ease-in active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90 ${pathname === '/dash/create' ? 'bg-[var(--textColor)] text-[var(--bgColor)]' : ''}`}>
                  <PlusSquare
                  strokeWidth={1.5}
                  
                  /> <p className={`${sidebarOpen? '' : 'hidden'}`}>Create</p>

                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/chats')}
                  type="button"
                  className={` flex ${sidebarOpen? 'w-full' : 'w-fit'} justify-start items-center gap-2 font-medium text-xl hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] px-3 py-1 rounded-full cursor-pointer ease-in active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90 ${pathname === '/dash/chats' ? 'bg-[var(--textColor)] text-[var(--bgColor)]' : ''}`}>
                    <MessageCircle
                    strokeWidth={1.5}
                    /> <p className={`${sidebarOpen? '' : 'hidden'}`}>Messages</p>

                  </button>

                  <button 
                  onClick={() => handleNavClick('/reels')}
                  type="button"
                  className={`font-medium ${sidebarOpen? 'w-full' : 'w-fit'} gap-2 justify-start px-3 text-xl py-1 hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] rounded-full flex items-center cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90 ${pathname === '/reels' ? 'bg-[var(--textColor)] text-[var(--bgColor)]' : ''}`}>
                  <PlaySquareIcon
                  strokeWidth={1.5}
                  /> 
                  <p className={`${sidebarOpen? '' : 'hidden'}`}>Reels</p>
                  

                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/calls')}
                  type="button"
                  className={`flex ${sidebarOpen? 'w-full' : 'w-fit'} font-medium justify-start items-center gap-2 text-xl px-3 hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] py-1 rounded-full cursor-pointer ease-in active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90 ${pathname === '/dash/calls' ? 'bg-[var(--textColor)] text-[var(--bgColor)]' : ''}`}>
                  <VideoIcon
                  strokeWidth={1.5}
                  /> <p className={`${sidebarOpen? '' : 'hidden'}`}>Calls</p>

                  </button>
                  <button
                    onClick={
                      () => {
                        handleNavClick('/dash/notifications')
                      }
                    }
                    className={`flex ${sidebarOpen? 'w-full' : 'w-fit'} justify-start items-center gap-2 font-medium text-xl hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] px-3 py-1 rounded-full cursor-pointer ease-in active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90 ${pathname === '/dash/notifications' ? 'bg-[var(--textColor)] text-[var(--bgColor)]' : ''}`}
                    type="button">
                        <Heart
                        strokeWidth={1.5}
                        /> <p className={`${sidebarOpen? '' : 'hidden'}`}>Notifications</p>

                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/profile')}
                  type="button" 
                  className={`flex ${sidebarOpen? 'w-full' : 'w-fit'} justify-start items-center gap-2 font-medium text-xl hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] px-3 py-1 rounded-full cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90 ${pathname === '/dash/profile' ? 'bg-[var(--textColor)] text-[var(--bgColor)]' : ''}`}>
                  <User2
                  strokeWidth={1.5}
                  /> <p className={`${sidebarOpen? '' : 'hidden'}`}>Profile</p>
                  </button>

                  <button
                  onClick={() => (dispatch(setPanelOpen(!panelOpen)))}
                  type="button" 
                  className="flex ${sidebarOpen? 'w-full' : 'w-fit'} justify-start items-center gap-2 active:bg-[var(--wrapperColor)] text-xl hover:bg-[var(--wrapperColor)] hover:text-[var(--textColor)] px-3 py-1 rounded-full transition duration-100 active:rounded-full active:scale-90 font-medium cursor-pointer z-10">
                    <div className={`${panelOpen? 'flex items-center gap-2 opacity-100 scale-100' : 'opacity-0 scale-0 hidden'}`}>
                      <XIcon
                        className={` ${
                        panelOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    strokeWidth={2}
                    />  <p className={`${sidebarOpen? '' : 'hidden'}`}>Close</p>
                    </div>
                    <div className={`${!panelOpen? 'flex items-center gap-2 opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                      <MenuIcon
                      className=""
                    /> <p className={`${sidebarOpen? '' : 'hidden'}`}>Menu</p>
                    </div>
                  </button>
            </nav>
            {/* nav for desktop ends here */}

            {/* main starts here (2nd column for desktop) */}
            <main className="pb-10 sm:px-10 px-3 flex flex-col justify-center items-center ">
              {children}
            </main>
            {/* main ends here */}
            
            {/* nav for mobile starts here */}

            <nav className="w-full py-2 up-slide bg-[var(--wrapperColor)] border-y-1 border-[var(--shadowBorder)] px-2 sm:hidden flex fixed left-0 bottom-0 ">
                <div className="w-full items-center flex justify-between">
                  <button
                  onClick={() => handleNavClick('/dash/feed')}
                  type="button"
                  className={`flex flex-col items-center justify-center relative gap-1 cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 rounded-xl active:scale-90 px-2 py-1 ${pathname === '/dash/feed'? 'bg-[var(--textColor)]/75 text-[var(--bgColor)]' : ''}`}>
                    <HomeIcon
                    size={33}
                    strokeWidth={1.5}

                    />
                    
                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/create')}
                  type="button"
                  className={`flex flex-col items-center justify-center gap-1 cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 rounded-xl active:scale-90 px-2 py-1 ${pathname === '/dash/create'? 'bg-[var(--textColor)]/75 text-[var(--bgColor)]' : ''}`}>
                  <PlusSquare
                  size={33}
                  strokeWidth={1.5}
                                  
                  />
                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/chats')}
                  type="button"
                  className={`flex flex-col items-center justify-center gap-1 relative cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100  rounded-xl active:scale-90 px-2 py-1 ${pathname === '/dash/chats'? 'bg-[var(--textColor)]/75 text-[var(--bgColor)]' : ''}`}>
                  <MessageSquareMore
                  size={33}
                  strokeWidth={1.5}
                  className="-scale-x-100"
                  />
                  </button>

                  <button 
                  onClick={() => handleNavClick('/reels')}
                  type="button"
                  className={`flex flex-col items-center justify-center gap-1 relative cursor-pointer  active:bg-[var(--wrapperColor)] transition duration-100 rounded-xl active:scale-90 px-2 py-1 ${pathname === '/dash/reels'? 'bg-[var(--textColor)]/75 text-[var(--bgColor)]' : ''}`}>
                  <PlaySquareIcon
                  size={33}
                  strokeWidth={1.5}
                  />
                  
                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/calls')}
                  type="button"
                  className={`flex flex-col items-center justify-center gap-1 cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 rounded-xl  active:scale-90 px-2 py-1 ${pathname === '/dash/calls'? 'bg-[var(--textColor)]/75 text-[var(--bgColor)]' : ''}`}>
                  <VideoIcon
                  size={33}
                  strokeWidth={1.5}
                  />
                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/profile')}
                  type="button" 
                  className={`flex flex-col items-center justify-center gap-1 cursor-pointer active:bg-[var(--wrapperColor)] transition-all  duration-100 ease-in rounded-xl  active:scale-90 px-1.5 py-0.5 ${pathname === '/dash/profile'? 'border-2 border-[var(--borderColor)] text-[var(--bgColor)]' : ''}`}>
                  {avatar ? 
                  <img src={avatar} alt="avatar" className="w-8 h-8 rounded-xl" /> : <User2 size={33} strokeWidth={1.5} />
                  }
                  </button>
                  
                </div>
                
              </nav>
              {/* nav for mobile ends here */}

              {/* third column for desktop starts here */} 
              <div className="sticky hidden sm:flex top-2">
                <div>
                    <div className={`flex transition-all ease-in duration-200 px-2 bg-[var(--inputBg)] rounded-md justify-center items-center ${searchInputClick? '' : 'opacity-0  w-18 px-0 sm:opacity-100 sm:w-full sm:px-2'}`}>
                    <Search size={33} className=""/>
                    <input 
                    value={searchInput} 
                    onClick={() => setSearchInputClick(prev => !prev)}
                    onBlur={() => {
                      setSearchInputClick(prev => !prev)
                      setSearchInput('')
                    }}
                    onChange={(e) => setSearchInput(e.target.value)} 
                    type="search" 
                    placeholder="Search" 
                    className="outline-none rounded-2xl border-none w-full h-full text-xl placeholder:text-md placeholder:pl-2 px-2 py-1.5" name="" id="" />
                    
                    </div>
                    <Search size={33} className={`absolute top-0.5 right-0 pointer-events-none active:bg-[var(--wrapperColor)] transition duration-100 rounded-full active:scale-125 ${searchInputClick? 'opacity-0' : 'sm:opacity-0'}`}/>
                  </div>
                </div>
              </div>

            {panelOpen && (
              <div
                onClick={() => dispatch(setPanelOpen(false))}
                className="fixed inset-0 bg-black/70 z-30"
              ></div>
            )}
           <Panel/>
           <button
            className={` ease-in duration-500 cursor-pointer transform transition-all z-50 ${panelOpen? 'flex  rotate-180 scale-100 opacity-100' : 'opacity-0 scale-0'} fixed bottom-3 right-3`}
            type='button'
            onClick={() => dispatch(setPanelOpen(false))}>
              <XIcon size={33} className="text-[var(--textColor)] ease-in duration-200 cursor-pointer transform transition-all hover:scale-150"/>
           </button>

           {cameraClick? 
           <div className={` justify-center items-start ${cameraClick ? "flex" : "hidden"}`}>
            <button
             type="button"
             
             onClick={() => setCameraClick(false)}
              className="fixed top-2 z-50 left-2 active:scale-90 rounded-full  text-red-500 cursor-pointer">
                <ArrowLeft className="text-[var(--textColor)] hover:text-green-700" strokeWidth={2} size={35}/>
            </button>
            <CameraCapture />
          </div> 
          : ''
          }
      </div>
    </div>
   
  )
}

export default Dashboard

