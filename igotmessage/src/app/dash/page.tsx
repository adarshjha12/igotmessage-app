'use client'
import { Camera, PhoneCallIcon, Icon, Home, MessageCircleIcon, Settings, VideoIcon } from "lucide-react";
import { coconut, batBall } from '@lucide/lab';
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Toggle from "@/components/Toggle";

function Page() {
  const [isDark, setIsDark] = useState(false)

  const enableDarkMode = function () {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      setIsDark(prev => !prev)
    } else {
      document.documentElement.classList.add('dark')
      setIsDark(prev => !prev)
    }
  }
  

  return (
    <div className="w-full min-h-screen flex items-start bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200 relative">
      <div className="">
          <div className=" grid grid-cols-[1fr_3fr_2fr] items-start [@media(max-width:600px)]:grid-cols-1">
            <nav className="hidden [@media(max-width:600px)]:inline-block w-full bg-[var(--background)] text-[var(--foreground)]">
              <button type="button" onClick={enableDarkMode} className={`text-black`}>
                <Toggle dark={isDark}/>
              </button>
            </nav>
            <div className=" flex flex-col justify-center items-start [@media(max-width:600px)]:flex-row ">
              <div className=" flex justify-center items-center">
                  <p className="font-montez text-3xl font-bold [@media(max-width:600px)]:hidden">Igotmessage</p>
                  <img src="/images/logo.png" className="hidden [@media(max-width:600px)]:inline-block rounded-md w-8 h-auto border-2 border-black" alt="" />
              </div>
              <div className={`[@media(max-width:600px)]:w-full [@media(max-width:600px)]:fixed [@media(max-width:600px)]:bottom-0 flex justify-start border-1 ${isDark ? 'border-white' : 'border-black'}`}>
                <ul className="flex flex-col items-start  [@media(max-width:600px)]:items-center [@media(max-width:600px)]:pl-0
                [@media(max-width:600px)]:flex-row [@media(max-width:600px)]:justify-evenly [@media(max-width:600px)]:w-full [@media(max-width:600px)]:bg-[var(--background)] text-[var(--foreground)] ">

                  <li className="flex items-center gap-2">
                    <Home className="[@media(max-width:600px)]:w-3"/> 
                    <span className="font-semibold [@media(max-width:600px)]:hidden">Home</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircleIcon className="[@media(max-width:600px)]:w-3"/> 
                    <span className="font-semibold [@media(max-width:600px)]:hidden">Messages</span>
                  </li>
                  <li className="flex items-center gap-2"> 
                    <VideoIcon className="[@media(max-width:600px)]:w-3"/> 
                    <span className="font-semibold [@media(max-width:600px)]:hidden">Calls</span>
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
            <div className="bg-[var(--background)] text-[var(--foreground)] flex justify-center ">
              
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni facere consectetur eum explicabo minus natus quisquam tempore delectus dolorem iste sed voluptatibus, sit fugit, cumque nobis! Consequuntur vel nemo commodi.
            </div>
          </div>
      </div>
    </div>
   
  )
}

export default Page