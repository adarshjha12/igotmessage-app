'use client'
import { Home, Search, PlusSquare, PhoneCall, VideoOff, LucideDelete, MessageCircleIcon, Settings, VideoIcon, Heart, User2, HomeIcon, VideoOffIcon } from "lucide-react";
import { coconut, batBall } from '@lucide/lab';
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { ReactNode, useEffect, useState } from "react";
import Button from "@/components/Button";
import Toggle from "@/components/Toggle";
import Brand from "@/components/Brand";
import { useRouter, usePathname } from "next/navigation";

function Dashboard({children} : {children: ReactNode}) {
  const [isDark, setIsDark] = useState(false)
  const [heartClicked, setHeartClicked] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    {name: 'Home', path: '/home', icon: <HomeIcon/>},
    {name: 'Create', path: '/create', icon: <PlusSquare/>},
    {name: 'Messages', path: '/message', icon: <MessageCircleIcon/>},
    {name: 'Calls', path: '/calls', icon: <VideoIcon/>},
    {name: 'Profile', path: '/profile', icon: <User2/>},
  ]

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    } else {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
    }
  }, []);

  const enableDarkMode = function () {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }
  
  return (
    <div className={`w-full bg-[var(--bgColor)] text-[var(--textColor)] min-h-screen flex items-start p-2 transition-colors duration-200 relative `}>
      <div className="">
          <div className=" grid grid-cols-1 sm:[grid-template-columns:1fr_3fr_2fr] items-start ">
            <div className="mb-3 w-full flex py-1 px-3 items-center gap-3">
              <button type="button" onClick={enableDarkMode} className={`text-black hidden`}>
                <Toggle dark={isDark}/>
              </button> 
           
              <p className="font-montez text-2xl font-[600] ">IGotMessage</p>
              <div className="flex px-2 bg-[var(--inputBg)] rounded-md justify-center items-center">
                <Search className="w-4"/>
                <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} type="search" placeholder="search" className="outline-none rounded-2xl border-none w-full h-full text-sm placeholder:text-sm placeholder:pl-2 px-1 py-1.5" name="" id="" />
                <button type="button" onClick={() => setSearchInput('')}>
                    <LucideDelete className="w-4"/>
                </button>
              </div>
              <button onClick={() => setHeartClicked((prev => !prev))} type="button">
                <div>
                    <Heart fill={heartClicked ? 'white' : ''} />
                </div>
              </button>
            </div>
            <div className="w-screen flex justify-center ">
                <div className=" flex ">
                    {navItems.map((item) => (
                    <button key={item.path} className="" onClick={() => router.push(item.path)}>
                        {item.icon}
                        {item.name}
                    </button>
                    ))}
                </div>
            </div>
            <div className="">
              {children}
            </div>
            <div className="flex justify-center ">
              
            </div>
          </div>
      </div>
    </div>
   
  )
}

export default Dashboard

