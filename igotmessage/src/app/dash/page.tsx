'use client'
import { Camera, PhoneCallIcon, Icon, Home, MessageCircleIcon, Settings, VideoIcon } from "lucide-react";
import { coconut, batBall } from '@lucide/lab';
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Toggle from "@/components/Toggle";
import Brand from "@/components/Brand";

function Page() {
  const [isDark, setIsDark] = useState(false)
  const theme = localStorage.getItem('theme')

  const enableDarkMode = function () {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(prev => !prev)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(prev => !prev)
    }
  }
  

  return (
    <div className="w-full bg-blue-600 sm:bg-amber-500 min-h-screen flex items-start p-2 transition-colors duration-200 relative">
      <div className="">
          <div className=" grid grid-cols-[1fr_3fr_2fr] sm:grid-cols-1 items-start ">
            <nav className=" py-1 px-3 items-center gap-2 w-full bg-[var(--background)] text-[var(--textColor)]">
              <button type="button" onClick={enableDarkMode} className={`text-black`}>
                <Toggle dark={isDark}/>
              </button> 
           
              <p className="font-montez  font-bold ">Igotmessage</p>
              <input type="search" placeholder="search" className="outline-none rounded-2xl w-full text-xs placeholder:text-xs placeholder:pl-2 border-1 px-2 py-1 border-[var(--borderColor)]" name="" id="" />
            </nav>
            <div className=" flex flex-col justify-center items-start ">
              <div className=" flex justify-center items-center">
                  <p className="font-montez font-bold ">Igotmessage</p>
              </div>
              <div className={` flex justify-start border-1 ${isDark ? 'border-white' : 'border-black'}`}>
                <ul className="flex flex-col items-start text-[var(--textColor)] ">

                  <li className="flex items-center gap-2">
                    <Home className=""/> 
                    <span className="font-semibold">Home</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircleIcon className=""/> 
                    <span className="font-semibold">Messages</span>
                  </li>
                  <li className="flex items-center gap-2"> 
                    <VideoIcon className=""/> 
                    <span className="font-semibold">Calls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Settings className="[@media(max-width:600px)]:w-3"/> 
                    <span className="font-semibold [@media(max-width:600px)]:hidden">Settings</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="">
              <p className="mb-3">
              consectetur adipisicing elit. Magni facere consectetur eum explicabo minus natus quisquam tempore delectus dolorem iste sed voluptatibus, sit fugit, cumque nobis! Consequuntur vel nemo commodi.
              </p>
              <Button text="Send"/>
            </div>
            <div className="bg-[var(--background)] text-[var(--textColor)] flex justify-center ">
              
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni facere consectetur eum explicabo minus natus quisquam tempore delectus dolorem iste sed voluptatibus, sit fugit, cumque nobis! Consequuntur vel nemo commodi.
            </div>
          </div>
      </div>
    </div>
   
  )
}

export default Page

