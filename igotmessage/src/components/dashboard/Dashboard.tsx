'use client'
import { Home, CrossIcon, Search, PlusSquare, PhoneCall, MenuIcon, VideoOff, LucideDelete, MessageCircleIcon, XIcon, Settings, VideoIcon, Heart, User2, HomeIcon, VideoOffIcon, CameraIcon, ArrowLeft, LucideVideo, PlaySquareIcon, PlayCircle } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { ReactNode, useEffect, useState } from "react";
import Toggle from "@/components/Toggle";
import Brand from "@/components/Brand";
import { useRouter, usePathname } from "next/navigation";
import Panel from "../Panel";
import {  setPanelOpen } from '@/features/authSlice'
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import CameraCapture from "../Camera";

function Dashboard({children} : {children: ReactNode}) {

  const isDark = useSelector( (state : RootState) => state.auth.isDark)
  const panelOpen = useSelector( (state : RootState) => state.auth.panelOpen)
  const [heartClicked, setHeartClicked] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [searchInputClick, setSearchInputClick] = useState(false)
  const [cameraClick, setCameraClick] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()


  function handleNavClick(path:string) {
    if (pathname === path && pathname !== '/dash/home') {
      router.back()
    } else {
      router.push(path)
    }
  }
  
  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-[var(--bgColor)]  to-[var(--inputBg)] text-[var(--textColor)]  flex items-start justify-center relative">
      <div className={` w-full flex items-start justify-center transition-colors duration-200 relative `}>
          <div className="mt-2 w-full grid grid-cols-1 sm:[grid-template-columns:1fr_3fr] items-center sm:items-start">
            {/* header starts here */}
            <header className=" down-slide border-b-2 border-[var(--shadowBorder)] sm:absolute sm:top-0 sm:left-0 w-full  sm:border-none flex sm:justify-center justify-between py-2 px-2 items-center ">
           
              <p onClick={() => router.push('/dash/home')} className={`sm:hidden font-montez text-3xl active:bg-[var(--wrapperColor)] transition duration-100 rounded-full active:scale-75 font-[600] cursor-pointer ease-in  ${searchInputClick? 'text-xl sm:text-3xl text-left' : 'inline'}`}>IGotMessage</p>
              {/* <Brand scaleSm={true} /> */}
             <div className="flex gap-4.5 justify-center">
               <div className="relative">
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
                <button
                onClick={
                  () => {
                    handleNavClick('/dash/likes')
                  }
                }
                className={`cursor-pointer ${searchInputClick? 'hidden sm:inline' : 'inline'} active:bg-[var(--wrapperColor)] transition duration-100 rounded-full active:scale-125`}
                type="button">
                  <div>
                    <Heart size={33} className=""
                    strokeWidth={1.5}
                     fill={pathname === '/dash/likes'? (isDark? 'red' : 'red') : (isDark? '' : 'white')}
                    />
                </div>
              </button>

              <button
               onClick={
                () => {
                  setCameraClick(prev => !prev)
                }
              }
              className={`cursor-pointer ${searchInputClick? 'hidden sm:inline' : 'inline'} transition-all ease-in duration-200 active:bg-[var(--wrapperColor)] rounded-full active:scale-125`}
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

            {/* nav starts here */}
            <nav className="px-4 h-screen  border-[var(--borderColor)] right-slide hidden sm:flex border-r-4 flex-col gap-3 sm:w-fit justify-start ">
                <p className="font-montez text-3xl pb-4 font-[600] ">IGotMessage</p>

                <button
                  onClick={() => handleNavClick('/dash/home')}
                  type="button"
                  className={`flex font-semibold ease-in px-3 py-1 rounded-full cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90`}>
                    <div className="relative">
                      <Home 
                      strokeWidth={1.5}
                      className="mr-1 inline"
                      fill={pathname === '/dash/home'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                      /> Home
                      <div className="bg-[var(--bgColor)] rounded-xs absolute w-[11px] h-[10px] left-[8%] bottom-1"></div>
                    </div>
                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/create')}
                  type="button"
                  className="flex font-semibold px-3 py-1 rounded-full cursor-pointer ease-in active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-75">
                  <PlusSquare
                  strokeWidth={1.5}
                  fill={pathname === '/dash/create'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  className={`mr-2 ${pathname === '/dash/create'? (isDark? 'text-black' : 'text-white') : (isDark? '' : 'text-black')}`}
                  /> Create

                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/chats')}
                  type="button"
                  className=" font-semibold px-3 py-1 rounded-full flex items-center cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-75">
                  <div className="relative">
                    <MessageCircleIcon
                    strokeWidth={1.5}
                    className="mr-1 inline"
                    fill={pathname === '/dash/chats'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                    /> Messages
                    <div className=" border-y-2 border-dashed border-[var(--bgColor)] absolute w-[11px] h-[6px] left-[5%] bottom-2"></div>
                  </div>
                  </button>

                  <button 
                  onClick={() => handleNavClick('/reels')}
                  type="button"
                  className="flex gap-1 relative cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 rounded-full active:scale-75">
                  <PlaySquareIcon
                  size={33}
                  strokeWidth={1.5}
                  fill={pathname === '/reels'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  />
                  
                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/calls')}
                  type="button"
                  className="flex font-semibold px-3 py-1 rounded-full cursor-pointer ease-in active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-75">
                  <VideoIcon
                  className="mr-2"
                  strokeWidth={1.5}
                  fill={pathname === '/dash/calls'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  /> Calls
                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/profile')}
                  type="button" 
                  className="flex font-semibold px-3 py-1 rounded-full cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-75">
                  <User2
                  className="mr-2"
                  strokeWidth={1.5}
                  fill={pathname === '/dash/profile'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  /> Profile
                  </button>

                  <button
                  onClick={() => (dispatch(setPanelOpen(!panelOpen)))}
                  type="button" 
                  className="flex active:bg-[var(--wrapperColor)] px-3 py-1 rounded-full transition duration-100 active:rounded-full active:scale-75 font-semibold cursor-pointer z-10">
                    <div className={`${panelOpen? 'flex gap-2 opacity-100 scale-100' : 'opacity-0 scale-0 hidden'}`}>
                      <XIcon
                        className={` ${
                        panelOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    strokeWidth={2}
                    />  <span className="text-red-600">Close</span>
                    </div>
                    <div className={`${!panelOpen? 'flex gap-2 opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                      <MenuIcon
                      className=""
                    /> Menu
                    </div>
                  </button>

            </nav>
            {/* nav ends here */}

            {/* main starts here */}
            <main className="pb-10 sm:p-2 my-2.5 sm:mt-14">
              {children}
            </main>
            {/* main ends here */}
            
            <nav className="w-full up-slide bg-[var(--bgColor)] border-y-1 py-3 border-[var(--shadowBorder)] px-4 pb-2 sm:hidden flex fixed left-0 bottom-0 ">
                <div className="w-full items-center flex justify-between">
                  <button
                  onClick={() => handleNavClick('/dash/home')}
                  type="button"
                  className="flex relative gap-1 cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 rounded-full active:scale-75">
                    <Home 
                    size={33}
                    strokeWidth={1.5}
                    fill={pathname === '/dash/home'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                    />
                    <div className="bg-[var(--bgColor)] rounded-xs absolute w-[15px] h-[16px] left-[28%] bottom-1.5">

                    </div>

                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/create')}
                  type="button"
                  className="flex gap-1 cursor-pointer">
                  <PlusSquare
                  size={33}
                  strokeWidth={1.5}
                  className={`${pathname === '/dash/create'? (isDark? 'text-black' : 'text-white') : (isDark? '' : 'text-black')} active:bg-[var(--wrapperColor)] transition duration-100 rounded-full active:scale-75 `}

                  fill={pathname === '/dash/create'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  
                  />
                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/chats')}
                  type="button"
                  className="flex gap-1 relative cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 rounded-full active:scale-75">
                  <MessageCircleIcon
                  size={33}
                  strokeWidth={1.5}
                  fill={pathname === '/dash/chats'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  />
                   <div className=" border-y-2 border-dashed border-[var(--bgColor)] absolute w-[15px] h-[8px] left-[25%] bottom-3"></div>
                  </button>

                  <button 
                  onClick={() => handleNavClick('/reels')}
                  type="button"
                  className="flex gap-1 relative cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 rounded-full active:scale-75">
                  <PlaySquareIcon
                  size={33}
                  strokeWidth={1.5}
                  fill={pathname === '/reels'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  />
                  
                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/calls')}
                  type="button"
                  className="flex gap-1 cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 rounded-full active:scale-75">
                  <VideoIcon
                  size={33}
                  strokeWidth={1.5}
                  fill={pathname === '/dash/calls'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  />
                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/profile')}
                  type="button" 
                  className={`flex gap-1 cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 rounded-full active:scale-75`}>
                  <User2
                  size={33}
                  strokeWidth={1.5}
                  fill={pathname === '/dash/profile'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  />
                  </button>

                  <button
                  type="button" 
                  className="flex gap-1 cursor-pointer z-10 active:bg-[var(--wrapperColor)] transition duration-100 rounded-full active:scale-75">
                    {panelOpen ? 
                    <XIcon
                    onClick={() => {
                    dispatch(setPanelOpen(false))
                  }}
                    size={33}
                    className="" 
                    strokeWidth={2}
                    /> : <MenuIcon
                    onClick={() => {
                    dispatch(setPanelOpen(true))
                    }}
                    size={33}
                    className="ease-in duration-200 cursor-pointer transform transition-all hover:scale-125"
                    />}
                  </button>
                </div>
                
              </nav>
          </div>
          <Panel/>
           <button
            className={` ease-in duration-500 cursor-pointer transform transition-all z-40 ${panelOpen? 'flex  rotate-180 scale-100 opacity-100' : 'opacity-0 scale-0'} fixed bottom-3 right-3`}
            type='button'
            onClick={() => dispatch(setPanelOpen(false))}>
              <XIcon size={33} className="text-[var(--textColor)] ease-in duration-200 cursor-pointer transform transition-all hover:scale-150"/>
           </button>

           {cameraClick? 
           <div className={`absolute backdrop-blur-sm bg-[var(--bgColor)]/5 z-10 inset-0 flex justify-center items-start ${cameraClick ? "" : "hidden"}`}>
            <button
             type="button"
             onClick={() => setCameraClick(false)}
              className="fixed top-2 z-50 left-2 active:scale-75 rounded-full  border-[var(--borderColor)] border-2 text-[var(--textColor)] cursor-pointer">
                <ArrowLeft strokeWidth={2} size={35}/>
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

