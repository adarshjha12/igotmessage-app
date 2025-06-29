import {  MoonIcon, SunIcon, GroupIcon, ShieldIcon, InfoIcon, ArrowLeftIcon, SaveIcon, DatabaseBackup, SettingsIcon, Settings2Icon, ArrowDownZa, ArrowDownUp, ArrowBigUp, ArrowRightIcon  } from 'lucide-react'
import React, { useState } from 'react'
import Toggle from './Toggle'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setDarkMode, setPanelOpen } from '@/features/activitySlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowArcRightIcon, ArrowBendUpRightIcon, ArrowCircleRightIcon, ArrowSquareRightIcon, ArrowURightUpIcon, DownloadSimpleIcon, UserCircleIcon } from '@phosphor-icons/react'

import Image from 'next/image'
import { ArrowLineRightIcon } from '@phosphor-icons/react/dist/ssr'



function Panel() {

  const isDark = useSelector( (state : RootState) => state.activity.isDark)
  const userName = useSelector( (state : RootState) => state.auth.user.title)

  const [dataSaver, setDataSaver] = useState(false)
  const panelOpen = useSelector( (state : RootState) => state.activity.panelOpen)
  const dispatch = useDispatch()
  const router = useRouter()
  const avatar = null

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
      
    <div className={`flex ${panelOpen ? 'panel-slide' : 'panel-slide-close'} z-40 text-[var(--textColor)] flex-col items-start pt-4 px-2 duration-300 border-[var(--wrapperColor)] gap-4 border-r-8 right-0 fixed inset-0 overflow-y-auto w-[85%] sm:w-[40%] bg-[var(--bgColor)]
        `}> 
            <button type='button' 
            onClick={() => dispatch(setPanelOpen(false))}
            className='flex justify-start items-center rounded-full cursor-pointer p-2 active:bg-[var(--wrapperColor)]'>
              <ArrowLeftIcon className='text-[var(--iconColor)]'/>
            </button>
            <div className='flex flex-col w-full gap-8'>
                <div className='flex flex-col gap-5'>
                  <div className='text-4xl flex gap-2 items-center font-bold'>
                    <Settings2Icon className='text-[var(--iconColor)]' size={40}
                    strokeWidth={1.5}/>
                    <p>Settings</p>
                  </div>
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
                  <div className={`flex w-full justify-between gap-2 text-[var(--textColor)] border-1 rounded-xl bg-[var(--textColor)] border-[var(--borderColor)] py-1.5 px-3`}>
                    <div className='flex gap-2 items-center'>
                      <p className='text-xl text-[var(--bgColor)] font-semibold'> Data Saver</p>
                      <ArrowDownUp size={28} className='text-[var(--bgColor)]'/>
                    </div>
                    <button type="button" onClick={() => setDataSaver(prev => !prev)} className={`cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 rounded-full active:scale-90`}>
                      <Toggle toggleNow={dataSaver}/>
                    </button> 
                  </div>
                </div>
                <div className='font-semibold w-full py-1 flex flex-col justify-center items-start gap-3'>
                  <div className='text-4xl flex gap-2 items-center font-bold'>
                    <ArrowRightIcon className='text-[var(--iconColor)] -rotate-45' size={40} strokeWidth={1.5}/>
                    <p>Visit</p>
                  </div>
                  <Link
                   href='/about-dev'
                   className='ease-in w-full flex bg-[var(--wrapperColor)] rounded-xl px-4 py-2 justify-start items-center gap-2 cursor-pointer transform   active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90'>
                    <InfoIcon className='text-[var(--iconColor)] '/>
                    About dev
                  </Link>
    
                  <Link
                  href='/privacy-policy'
                   className='ease-in w-full bg-[var(--wrapperColor)] rounded-xl px-4 py-2 flex justify-start items-center gap-2 cursor-pointer transform   active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90'>
                    <ShieldIcon className='text-[var(--iconColor)] '/>
                    Privacy Policy
                  </Link>
    
                  <Link
                    href='/community-guidelines'
                    className='ease-in w-full bg-[var(--wrapperColor)] text-left rounded-xl px-4 py-2 flex justify-start items-center gap-2 cursor-pointer transform   active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90'>

                    <GroupIcon className='text-[var(--iconColor)] '/>
                    Comunity Guidelines
                  </Link>
                  
                </div>
            </div>
            <div className='sticky bottom-0 left-2 w-full bg-[var(--bgColor)]/50 backdrop-blur-sm py-3'>
                <Link  onClick={() => dispatch(setPanelOpen(false))} href='/dash/profile' className='flex w-fit justify-center items-center gap-2.5 border-[var(--borderColor)] rounded-2xl border-2 active:bg-[var(--wrapperColor)] px-3 py-2'>
                  <p className='text-2xl font-semibold'>{userName ? userName : 'User123'}</p>
                  <div>
                    <Image
                    className='rounded-2xl'
                    src={avatar? avatar : '/logos/igm.png' } alt='userName ' height={40} width={40}/>
                  </div>
                </Link>
            </div>
    
    </div>
    </>
  )
}

export default Panel