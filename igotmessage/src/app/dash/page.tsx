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
    <div className="w-full min-h-screen bg-amber-50  flex items-start p-2 transition-colors duration-200 relative">
      <div className="">
          <div className=" grid grid-cols-1 sm:[grid-template-columns:1fr_3fr_2fr] items-start ">
            <nav className=" w-full flex py-1 px-3 items-center gap-2 bg-[var(--background)] text-[var(--textColor)]">
              <button type="button" onClick={enableDarkMode} className={`text-black`}>
                <Toggle dark={isDark}/>
              </button> 
           
              <p className="font-montez  font-bold ">Igotmessage</p>
              <input type="search" placeholder="search" className="outline-none rounded-2xl w-full text-xs placeholder:text-xs placeholder:pl-2 border-1 px-2 py-1 border-[var(--borderColor)]" name="" id="" />
            </nav>
            <div className="w-full flex flex-col justify-center items-start ">
              <div className=" flex justify-center items-center">
                  <p className="font-montez font-bold hidden ">Igotmessage</p>
              </div>
              <div className={`w-full flex justify-center border-[var(--borderColor)] `}>
                <ul className="flex bg-[var(--background)] w-full px-5 justify-between fixed bottom-0 flex-row text-[var(--textColor)] ">

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
                    <Settings className=""/> 
                    <span className="font-semibold hidden ">Settings</span>
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

