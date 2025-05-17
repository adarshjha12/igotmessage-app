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
    <div className="w-full min-h-screen bg-[var(--bgColor)] text-[var(--textColor)]  flex items-start justify-center relative">
      <div className={` w-full flex items-start justify-center transition-colors duration-200 relative `}>
          <div className="mt-2 w-full grid grid-cols-1 sm:[grid-template-columns:1fr_3fr_2fr] items-center sm:items-start">
            {/* header starts here */}
            <header className="mb-3 down-slide border-b-2 border-[var(--shadowBorder)] sm:hidden w-full flex justify-evenly gap-3 py-2 px-3 items-center ">
           
              <p onClick={() => router.push('/dash/home')} className="font-montez text-2xl font-[600] cursor-pointer">IGotMessage</p>
              <div className="flex px-2 bg-[var(--inputBg)] rounded-md justify-center items-center">
                <Search className="w-4"/>
                <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} type="search" placeholder="search" className="outline-none rounded-2xl border-none w-full h-full text-sm placeholder:text-sm placeholder:pl-2 px-1 py-1.5" name="" id="" />
                <button className={`${searchInput.length >= 1? 'flex cursor-pointer' : 'opacity-0 '}`} type="button" onClick={() => setSearchInput('')}>
                    <LucideDelete className="w-4"/>
                </button>
              </div>
              <button
               onClick={
                () => {
                  handleNavClick('/dash/likes')
                }
              }
              className="cursor-pointer"
               type="button">
                <div>
                    <Heart className=""
                    strokeWidth={1.5}
                     fill={pathname === '/dash/likes'? (isDark? 'red' : 'red') : (isDark? '' : 'white')}
                    />
                </div>
              </button>
            </header>
            {/* header ends here */}

            {/* nav starts here */}
            <nav className=" right-slide hidden sm:flex flex-col gap-3 sm:w-fit justify-center ">
                <p className="font-montez text-3xl font-[600] ">IGotMessage</p>

                <button
                  onClick={() => handleNavClick('/dash/home')}
                  type="button"
                  className="flex gap-1 cursor-pointer">
                    <Home 
                    strokeWidth={1.5}
                    fill={pathname === '/dash/home'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                    />
                    <div className="bg-[var(--bgColor)] rounded-xs absolute w-[11px] h-[10px] left-[25%] bottom-1"></div>
                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/create')}
                  type="button"
                  className="flex gap-1 cursor-pointer">
                  <PlusSquare
                  strokeWidth={1.5}
                  fill={pathname === '/dash/create'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  className={`${pathname === '/dash/create'? (isDark? 'text-black' : 'text-white') : (isDark? '' : 'text-black')}`}
                  />

                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/chats')}
                  type="button"
                  className="flex gap-1 cursor-pointer">
                  <MessageCircleIcon
                  strokeWidth={1.5}
                  fill={pathname === '/dash/chats'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  />
                  <div className=" border-y-2 border-dashed border-[var(--bgColor)] absolute w-[11px] h-[6px] left-[25%] bottom-2"></div>
                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/calls')}
                  type="button"
                  className="flex gap-1 cursor-pointer">
                  <VideoIcon
                  strokeWidth={1.5}
                  fill={pathname === '/dash/calls'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  />
                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/profile')}
                  type="button" 
                  className="flex gap-1 cursor-pointer">
                  <User2
                  strokeWidth={1.5}
                  fill={pathname === '/dash/profile'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  />
                  </button>
            </nav>
            {/* nav ends here */}

            {/* main starts here */}
            <main className="pb-10 mb-2.5">
              {children}
              <div className="bg-amber-400">ff</div>
            </main>
            {/* main ends here */}
            
            <nav className="w-full up-slide border-t-1 pt-2 border-[var(--shadowBorder)] px-4 pb-2 sm:hidden flex fixed left-0 bottom-0 ">
                <div className="w-full items-center flex justify-between">
                  <button
                  onClick={() => handleNavClick('/dash/home')}
                  type="button"
                  className="flex relative gap-1 cursor-pointer">
                    <Home 
                    strokeWidth={1.5}
                    fill={pathname === '/dash/home'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                    />
                    <div className="bg-[var(--bgColor)] rounded-xs absolute w-[11px] h-[10px] left-[25%] bottom-1">

                    </div>

                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/create')}
                  type="button"
                  className="flex gap-1 cursor-pointer">
                  <PlusSquare
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
                  strokeWidth={1.5}
                  fill={pathname === '/dash/chats'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  />
                   <div className=" border-y-2 border-dashed border-[var(--bgColor)] absolute w-[11px] h-[6px] left-[25%] bottom-2"></div>
                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/calls')}
                  type="button"
                  className="flex gap-1 cursor-pointer">
                  <VideoIcon
                  strokeWidth={1.5}
                  fill={pathname === '/dash/calls'? (isDark? 'white' : '') : (isDark? '' : 'white')}
                  />
                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/profile')}
                  type="button" 
                  className={`flex gap-1 cursor-pointer `}>
                  <User2
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
                    className="" 
                    strokeWidth={2}
                    /> : <MenuIcon
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
              <XIcon className="text-white ease-in duration-200 cursor-pointer transform transition-all hover:scale-150"/>
           </button>
      </div>
    </div>
   
  )
}

export default Dashboard

