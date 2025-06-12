import {  MoonIcon, SunIcon, GroupIcon, ShieldIcon, InfoIcon  } from 'lucide-react'
import React from 'react'
import Toggle from './Toggle'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setDarkMode } from '@/features/activitySlice'
import { useRouter } from 'next/navigation'



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
    <div className={`${panelOpen? 'flex panel-slide': 'hidden'} z-40 text-[var(--textColor)] flex-col items-start pt-4 px-8 duration-300 font-exo2 border-[var(--borderColor)] right-0 fixed inset-0 overflow-y-auto w-[80%] sm:w-[60%] bg-[var(--bgColor)] 
`}> 
        <div className='flex flex-col w-full gap-8'>
            <div className='flex w-fit justify-start font-bold gap-2 text-[var(--textColor)] border-1 py-1 rounded-md bg-[var(--wrapperColor)] border-[var(--borderColor)] px-3'>
              <p className=''>Dark mode </p>
              {isDark?
               <MoonIcon
               fill='#393939'
               strokeWidth={1}
                className='text-amber-300'/>
                : <SunIcon
                strokeWidth={3}
                className='text-amber-600 active:rounded-full text-md'
                />}
              <button type="button" onClick={enableDarkMode} className={`cursor-pointer active:bg-[var(--wrapperColor)] transition duration-100 rounded-full active:scale-90`}>
                <Toggle dark={isDark}/>
              </button> 
            </div>
            <div className='font-semibold w-full py-3 flex flex-col justify-center items-start gap-2'>
              <button
               type='button' 
               onClick={() => router.push('/about-dev')}
               className='ease-in w-full flex bg-[var(--wrapperColor)] rounded-xl px-4 py-2 justify-start items-center gap-2 cursor-pointer transform  hover:scale-110 sm:hover:scale-105 active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90'>
                <InfoIcon className='text-[var(--iconColor)] '/>
                About dev
              </button>

              <button
               type='button' 
               onClick={() => router.push('/privacy-policy')}
               className='ease-in w-full bg-[var(--wrapperColor)] rounded-xl px-4 py-2 flex justify-start items-center gap-2 cursor-pointer transform  hover:scale-110 sm:hover:scale-105 active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90'>
                <ShieldIcon className='text-[var(--iconColor)] '/>
                Privacy Policy
              </button>

              <button
               type='button' 
               onClick={() => router.push('/community-guidelines')}
               className='ease-in w-full bg-[var(--wrapperColor)] text-left rounded-xl px-4 py-2 flex justify-start items-center gap-2 cursor-pointer transform  hover:scale-110 sm:hover:scale-105 active:bg-[var(--wrapperColor)] transition duration-100 active:rounded-full active:scale-90'>
                <GroupIcon className='text-[var(--iconColor)] '/>
                Comunity Guidelines
              </button>
              
            </div>
        </div>

        {/* violet background starts here */}
      {/* <div className='inset-0 px-12 fixed h-full w-[60%] gap-10  grid grid-cols-1 sm:grid-cols-2 rotate-12 sm:rotate-45 -z-10'>
        <div className='flex flex-col rounded-b-md rounded-e-full rotate-45 blur-2xl rounded-full rounded-r-lg bg-violet-700'></div>
        <div className='flex flex-col rounded-b-full rotate-90 blur-2xl rounded-full rounded-r-lg  bg-violet-800 gap-4'></div>
        <div className=' flex-col sm:flex rounded-b-md rounded-e-full -rotate-12 blur-2xl rounded-full rounded-r-lg  bg-violet-700 gap-4'></div>
      </div> */}
    </div>
  )
}

export default Panel