import {  MoonIcon, SunIcon, GroupIcon, ShieldIcon, InfoIcon, ArrowLeftIcon  } from 'lucide-react'
import React from 'react'
import Toggle from './Toggle'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setDarkMode, setPanelOpen } from '@/features/activitySlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'



function Panel() {

  const isDark = useSelector( (state : RootState) => state.activity.isDark)
  const panelOpen = useSelector( (state : RootState) => state.activity.panelOpen)
  const dispatch = useDispatch()
  const router = useRouter()

  const enableDarkMode = function () {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      dispatch(setDarkMode(false))
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      dispatch(setDarkMode(true))
    }
  }

  return (
    <>
    {panelOpen && (
      
    <div className={`flex panel-slide z-40 text-[var(--textColor)] flex-col items-start pt-4 px-2 duration-300 border-[var(--wrapperColor)] gap-4 border-r-8 right-0 fixed inset-0 overflow-y-auto w-[80%] sm:w-[60%] bg-[var(--bgColor)]
        `}> 
            <button type='button' 
            onClick={() => dispatch(setPanelOpen(false))}
            className='flex justify-start items-center rounded-full cursor-pointer p-2 active:bg-[var(--wrapperColor)]'>
              <ArrowLeftIcon className='text-[var(--iconColor)]'/>
            </button>
            <div className='flex flex-col w-full gap-8'>
                <div className='flex flex-col gap-3'>
                  <p className='text-4xl font-bold'>Settings</p>
                  <div className={`flex w-full justify-between gap-2 text-[var(--textColor)] border-1 ${isDark ? '' : 'py-1.5'} rounded-xl bg-[var(--textColor)] border-[var(--borderColor)] px-3`}>
                    <div className='flex gap-2 items-center'>
                      <p className='text-xl text-[var(--bgColor)] font-semibold'>Dark mode</p>
                      {isDark?
                      <MoonIcon
                      fill='#393939'
                      size={40}
                      // strokeWidth={1}
                        //  className='text-[var(--iconColor)]'
                         />
                        : <SunIcon
                        size={30}
                        strokeWidth={2}
                        className='text-amber-400 active:rounded-full text-md'
                        />}
                    </div>
                    <button type="button" onClick={enableDarkMode} className={`cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 rounded-full active:scale-90`}>
                      <Toggle toggleNow={isDark}/>
                    </button> 
                  </div>
                </div>
                <div className='font-semibold w-full py-3 flex flex-col justify-center items-start gap-2'>
                  <Link
                   href='/about-dev'
                   className='ease-in w-full flex bg-[var(--wrapperColor)] rounded-xl px-4 py-2 justify-start items-center gap-2 cursor-pointer transform  hover:scale-110 sm:hover:scale-105 active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90'>
                    <InfoIcon className='text-[var(--iconColor)] '/>
                    About dev
                  </Link>
    
                  <Link
                  href='/privacy-policy'
                   className='ease-in w-full bg-[var(--wrapperColor)] rounded-xl px-4 py-2 flex justify-start items-center gap-2 cursor-pointer transform  hover:scale-110 sm:hover:scale-105 active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90'>
                    <ShieldIcon className='text-[var(--iconColor)] '/>
                    Privacy Policy
                  </Link>
    
                  <Link
                    href='/community-guidelines'
                    className='ease-in w-full bg-[var(--wrapperColor)] text-left rounded-xl px-4 py-2 flex justify-start items-center gap-2 cursor-pointer transform  hover:scale-110 sm:hover:scale-105 active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90'>

                    <GroupIcon className='text-[var(--iconColor)] '/>
                    Comunity Guidelines
                  </Link>
                  
                </div>
            </div>
    
        </div>
    )}
    </>
  )
}

export default Panel