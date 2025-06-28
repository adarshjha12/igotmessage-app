import { RootState } from '@/store/store'
import React from 'react'
import { useSelector } from 'react-redux'

interface ToggleProps {
    toggleNow: boolean,
}

function Toggle ({toggleNow} : ToggleProps) {
  const isDark = useSelector( (state : RootState) => state.activity.isDark)
  return (
    <div>
        <div className={`w-[60px] rounded-full p-0.5 ${toggleNow ? 'bg-blue-600' : 'bg-[var(--bgColor)]'} flex justify-start border-1 border-[var(--textColor)]`}>
            <span className={`${toggleNow && !isDark ? 'bg-[var(--bgColor)]' : 'bg-[var(--textColor)]' } w-[25px] h-[25px] rounded-full  z-30  transform ease-linear duration-200 ${toggleNow ? ' translate-x-[28px] ' : ' translate-x-0'}`}></span>
        </div>
    </div>
  )
}

export default Toggle