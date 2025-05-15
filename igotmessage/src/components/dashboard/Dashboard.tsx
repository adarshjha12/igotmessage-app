'use client'
import { Home, Search, LucideDelete, MessageCircleIcon, Settings, VideoIcon, Heart, User2 } from "lucide-react";
import { coconut, batBall } from '@lucide/lab';
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { ReactNode, useEffect, useState } from "react";
import Button from "@/components/Button";
import Toggle from "@/components/Toggle";
import Brand from "@/components/Brand";

function Dashboard({children} : {children: ReactNode}) {
  const [isDark, setIsDark] = useState(false)
  const [heartClicked, setHeartClicked] = useState(false)
  const [searchInput, setSearchInput] = useState('')

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
            <div className="w-full flex flex-col justify-center items-start ">
              <div className=" flex justify-center items-center">
                  <p className="font-montez font-bold hidden ">Igotmessage</p>
              </div>
              <div className={`w-full flex justify-center `}>

                {/* <ul className="flex w-full px-5 justify-between fixed bottom-0 flex-row  ">

                  <li className="flex items-center gap-2">
                    <Home className="" /> 
                    <span className="font-semibold hidden">Home</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircleIcon className=""/> 
                    <span className="font-semibold hidden">Messages</span>
                  </li>
                  <li className="flex items-center gap-2"> 
                    <VideoIcon className=""/> 
                    <span className="font-semibold hidden">Calls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <User2 className=""/> 
                    <span className="font-semibold hidden ">Settings</span>
                  </li>
                </ul> */}
                
              </div>
            </div>
            <div className="">
              
            </div>
            <div className="flex justify-center ">
              
            </div>
          </div>
      </div>
    </div>
   
  )
}

export default Dashboard

