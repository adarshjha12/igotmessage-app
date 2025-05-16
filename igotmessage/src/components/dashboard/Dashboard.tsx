'use client'
import { Home, Search, PlusSquare, PhoneCall, MenuIcon, VideoOff, LucideDelete, MessageCircleIcon, Settings, VideoIcon, Heart, User2, HomeIcon, VideoOffIcon } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { ReactNode, useEffect, useState } from "react";
import Toggle from "@/components/Toggle";
import Brand from "@/components/Brand";
import { useRouter, usePathname } from "next/navigation";

function Dashboard({children} : {children: ReactNode}) {
  const [isDark, setIsDark] = useState(false)
  const [heartClicked, setHeartClicked] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [menuClick, setMenuClick] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

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

  useEffect(() => {
  if (heartClicked && pathname !== '/dash/likes') {
    router.push('/dash/likes');
  } else if (!heartClicked && pathname === '/dash/likes') {
    router.back();
  }

}, [heartClicked]);


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
              <button type="button" onClick={enableDarkMode} className={`text-black`}>
                <Toggle dark={isDark}/>
              </button> 
           
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
               type="button">
                <div>
                    <Heart className=""
                    strokeWidth={1.5}
                     fill={pathname === '/dash/likes'? (isDark? '#107aeb' : 'red') : (isDark? '' : 'white')}
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
                    fill={pathname === '/dash/home'? 'red' : (isDark? '' : 'white')}
                    />
                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/create')}
                  type="button"
                  className="flex gap-1 cursor-pointer">
                  <PlusSquare
                  strokeWidth={1.5}
                  fill={pathname === '/dash/create'? 'red' : (isDark? '' : 'white')}
                  
                  />
                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/chats')}
                  type="button"
                  className="flex gap-1 cursor-pointer">
                  <MessageCircleIcon
                  strokeWidth={1.5}
                  fill={pathname === '/dash/chats'? 'red' : (isDark? '' : 'white')}
                  />
                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/calls')}
                  type="button"
                  className="flex gap-1 cursor-pointer">
                  <VideoIcon
                  strokeWidth={1.5}
                  fill={pathname === '/dash/calls'? 'red' : (isDark? '' : 'white')}
                  />
                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/profile')}
                  type="button" 
                  className="flex gap-1 cursor-pointer">
                  <User2
                  strokeWidth={1.5}
                  fill={pathname === '/dash/profile'? 'red' : (isDark? '' : 'white')}
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
            
            <nav className="w-full up-slide border-t-1 pt-2 border-[var(--shadowBorder)] z-50 px-4 pb-2 sm:hidden flex fixed left-0 bottom-0 ">
                <div className="w-full items-center flex justify-between">
                  <button
                  onClick={() => handleNavClick('/dash/home')}
                  type="button"
                  className="flex gap-1 cursor-pointer">
                    <Home 
                    strokeWidth={1.5}
                    fill={pathname === '/dash/home'? 'red' : (isDark? '' : 'white')}
                    />
                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/create')}
                  type="button"
                  className="flex gap-1 cursor-pointer">
                  <PlusSquare
                  strokeWidth={1.5}
                  fill={pathname === '/dash/create'? 'red' : (isDark? '' : 'white')}
                  
                  />
                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/chats')}
                  type="button"
                  className="flex gap-1 cursor-pointer">
                  <MessageCircleIcon
                  strokeWidth={1.5}
                  fill={pathname === '/dash/chats'? 'red' : (isDark? '' : 'white')}
                  />
                  </button>

                  <button 
                  onClick={() => handleNavClick('/dash/calls')}
                  type="button"
                  className="flex gap-1 cursor-pointer">
                  <VideoIcon
                  strokeWidth={1.5}
                  fill={pathname === '/dash/calls'? 'red' : (isDark? '' : 'white')}
                  />
                  </button>

                  <button
                  onClick={() => handleNavClick('/dash/profile')}
                  type="button" 
                  className={`flex gap-1 cursor-pointer `}>
                  <User2
                  strokeWidth={1.5}
                  fill={pathname === '/dash/profile'? 'red' : (isDark? '' : 'white')}
                  />
                  </button>

                  <button
                  onClick={() => (setMenuClick(prev => !prev))}
                  type="button" 
                  className="flex gap-1 cursor-pointer z-10">
                  <MenuIcon
                  className={`${menuClick ? 'text-green-500 transition-transform rotate-180' : ''} rounded-md`}
                  strokeWidth={1.5}
                  />
                  </button>
                </div>
              </nav>
          </div>
      </div>
    </div>
   
  )
}

export default Dashboard

