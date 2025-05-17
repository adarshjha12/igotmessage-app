import { XIcon, LightbulbIcon, MoonIcon, MoonStar, SunriseIcon, SunDim, SunIcon, LightbulbOffIcon } from 'lucide-react'
import React from 'react'
import Toggle from './Toggle'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setDarkMode } from '@/features/authSlice'
import { useRouter } from 'next/navigation'

interface PanelProps {
  menuClick: boolean,
}

function Panel({menuClick} : PanelProps) {

  const isDark = useSelector( (state : RootState) => state.auth.isDark)
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
    <div className={`${menuClick ? 'flex panel-slide': 'hidden'} text-white transform transition-transform flex-col items-start pt-4 pl-8 duration-300 border-l-8 font-exo2 border-[var(--borderColor)] ease-in-out right-0 absolute w-[80%] h-full bg-blue-800`}> 
        <div className='flex flex-col gap-2'>
            <div className='flex gap-2 border-1 py-1 rounded-md border-white px-3'>
              <p className='text-white'>Dark mode </p>
              {isDark?
               <MoonIcon
               fill='black'
               strokeWidth={1}
                className='text-white'/>
                : <SunIcon
                strokeWidth={2}
                className='text-amber-300 rounded-full text-md'
                />}
              <button type="button" onClick={enableDarkMode} className={`cursor-pointer`}>
                <Toggle dark={isDark}/>
              </button> 
            </div>
            <div>
              <button
               type='button' 
               onClick={() => router.push('/about-dev')}
               className='ease-in duration-200 cursor-pointer transform transition-all hover:scale-110'>About dev</button>
            </div>
        </div>
    </div>
  )
}

export default Panel