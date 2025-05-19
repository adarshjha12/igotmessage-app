'use client'
import { Home, CrossIcon, Search, PlusSquare, PhoneCall, MenuIcon, VideoOff, LucideDelete, MessageCircleIcon, XIcon, Settings, VideoIcon, Heart, User2, HomeIcon, VideoOffIcon } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { ReactNode, useEffect, useState } from "react";
import Toggle from "@/components/Toggle";
import Brand from "@/components/Brand";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import Panel from "../Panel";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";

function Dashboard({children} : {children: ReactNode}) {

  const isDark = useSelector( (state : RootState) => state.auth.isDark)
  const [heartClicked, setHeartClicked] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [searchInputClick, setSearchInputClick] = useState(false)
  const [menuClick, setMenuClick] = useState(false)
  const [isPending, startTransition] = useTransition()

  const router = useRouter()
  const pathname = usePathname()


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
          <div className="mt-2 w-full grid grid-cols-1 sm:[grid-template-columns:1fr_3fr_2fr] items-center sm:items-start">
            {/* header starts here */}
            <header className=" down-slide border-b-2 border-[var(--shadowBorder)] sm:hidden w-full flex justify-evenly gap-4 py-2 px-3 items-center ">
           
              <p onClick={() => router.push('/dash/home')} className={` font-montez text-3xl font-[600] cursor-pointer transition-all ease-in duration-200 ${searchInputClick? 'text-xl text-left' : 'inline'}`}>IGotMessage</p>
              {/* <Brand scaleSm={true} /> */}
              <div className="flex transition-all ease-in duration-200 px-2 bg-[var(--inputBg)] rounded-md justify-center items-center">
                <Search size={33} className=""/>
                <input 
                value={searchInput} 
                onClick={() => setSearchInputClick(prev => !prev)}
                onBlur={() => setSearchInputClick(prev => !prev)}
                onChange={(e) => setSearchInput(e.target.value)} 
                type="search" 
                placeholder="Search" 
                className="outline-none rounded-2xl border-none w-full h-full text-xl placeholder:text-md placeholder:pl-2 px-2 py-1.5" name="" id="" />
                <button className={`${searchInput.length >= 1? 'flex cursor-pointer' : 'opacity-0 '}`} type="button" onClick={() => setSearchInput('')}>
                    <LucideDelete className=""/>
                </button>
              </div>
              <button
               onClick={
                () => {
                  handleNavClick('/dash/likes')
                }
              }
              className={`cursor-pointer ${searchInputClick? 'hidden' : 'inline'} transition-all ease-in duration-200`}
               type="button">
                <div>
                    <Heart size={33} className=""
                    strokeWidth={1.5}
                     fill={pathname === '/dash/likes'? (isDark? 'red' : 'red') : (isDark? '' : 'white')}
                    />
                </div>
              </button>
            </header>
            {/* header ends here */}

            {/* nav starts here */}
            <nav className="px-2 right-slide hidden sm:flex flex-col gap-3 sm:w-fit justify-center ">
                <p className="font-montez text-3xl font-[600] ">IGotMessage</p>

                <button
                  onClick={() => handleNavClick('/dash/home')}
                  type="button"
                  className="flex font-semibold cursor-pointer">
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
                  className="flex font-semibold cursor-pointer">
                  <PlusSquare
                  strokeWidth={1.5}
                  fill={pathname === '/dash/create'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  className={`mr-2 ${pathname === '/dash/create'? (isDark? 'text-black' : 'text-white') : (isDark? '' : 'text-black')}`}
                  /> Create

                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/chats')}
                  type="button"
                  className="flex font-semibold cursor-pointer">
                  <div className="relative">
                    <MessageCircleIcon
                    strokeWidth={1.5}
                    className="mr-2 inline"
                    fill={pathname === '/dash/chats'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                    /> Messages
                    <div className=" border-y-2 border-dashed border-[var(--bgColor)] absolute w-[11px] h-[6px] left-[5%] bottom-2"></div>
                  </div>
                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/calls')}
                  type="button"
                  className="flex font-semibold cursor-pointer">
                  <VideoIcon
                  className="mr-2"
                  strokeWidth={1.5}
                  fill={pathname === '/dash/calls'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  /> Calls
                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/profile')}
                  type="button" 
                  className="flex font-semibold cursor-pointer">
                  <User2
                  className="mr-2"
                  strokeWidth={1.5}
                  fill={pathname === '/dash/profile'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  /> Profile
                  </button>

                  <button
                  onClick={() => (setMenuClick(prev => !prev))}
                  type="button" 
                  className="flex font-semibold cursor-pointer z-10">
                    <div className={`${menuClick? 'flex gap-2 opacity-100 scale-100' : 'opacity-0 scale-0 hidden'}`}>
                      <XIcon
                        className={`transform transition-all duration-200 ease-in hover:scale-125 ${
                        menuClick ? 'rotate-180' : 'rotate-0'
                      }`}
                    strokeWidth={2}
                    />  <span className="text-red-600">Close</span>
                    </div>
                    <div className={`${!menuClick? 'flex gap-2 opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                      <MenuIcon
                      className="ease-in duration-200 cursor-pointer transform transition-all hover:scale-125"
                    /> Menu
                    </div>
                  </button>

            </nav>
            {/* nav ends here */}

            {/* main starts here */}
            <main className="pb-10 sm:p-2 my-2.5">
              {children}
            </main>
            {/* main ends here */}
            
            <nav className="w-full up-slide bg-[var(--bgColor)] border-y-1 py-3 border-[var(--shadowBorder)] px-4 pb-2 sm:hidden flex fixed left-0 bottom-0 ">
                <div className="w-full items-center flex justify-between">
                  <button
                  onClick={() => handleNavClick('/dash/home')}
                  type="button"
                  className="flex relative gap-1 cursor-pointer">
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
                  className={`${pathname === '/dash/create'? (isDark? 'text-black' : 'text-white') : (isDark? '' : 'text-black')}`}

                  fill={pathname === '/dash/create'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  
                  />
                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/chats')}
                  type="button"
                  className="flex gap-1 relative cursor-pointer">
                  <MessageCircleIcon
                  size={33}
                  strokeWidth={1.5}
                  fill={pathname === '/dash/chats'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  />
                   <div className=" border-y-2 border-dashed border-[var(--bgColor)] absolute w-[15px] h-[8px] left-[25%] bottom-3"></div>
                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/calls')}
                  type="button"
                  className="flex gap-1 cursor-pointer">
                  <VideoIcon
                  size={33}
                  strokeWidth={1.5}
                  fill={pathname === '/dash/calls'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  />
                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/profile')}
                  type="button" 
                  className={`flex gap-1 cursor-pointer `}>
                  <User2
                  size={33}
                  strokeWidth={1.5}
                  fill={pathname === '/dash/profile'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  />
                  </button>

                  <button
                  onClick={() => (setMenuClick(prev => !prev))}
                  type="button" 
                  className="flex gap-1 cursor-pointer z-10">
                    {menuClick? 
                    <XIcon
                    size={33}
                    className="" 
                    strokeWidth={2}
                    /> : <MenuIcon
                    size={33}
                    className="ease-in duration-200 cursor-pointer transform transition-all hover:scale-125"
                    />}
                  </button>
                </div>
                
              </nav>
          </div>
          <Panel menuClick={menuClick}/>
           <button
            className={` ease-in duration-500 cursor-pointer transform transition-all z-40 ${menuClick? 'flex  rotate-180 scale-100 opacity-100' : 'opacity-0 scale-0'} fixed bottom-3 right-3`}
            type='button'
            onClick={() => setMenuClick(false)}>
              <XIcon size={33} className="text-white ease-in duration-200 cursor-pointer transform transition-all hover:scale-150"/>
           </button>
      </div>
    </div>
   
  )
}

export default Dashboard

