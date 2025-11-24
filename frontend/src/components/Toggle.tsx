import { RootState } from '@/store/store'
import React from 'react'
import { useSelector } from 'react-redux'

interface ToggleProps {
  toggleNow: boolean
}

function Toggle({ toggleNow }: ToggleProps) {
  const isDark = useSelector((state: RootState) => state.activity.isDark)

  return (
    <div
      className={`relative w-[52px] h-[28px] flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        toggleNow ? 'bg-gradient-to-r from-blue-500 to-green-500' : 'bg-[var(--bgColor)] border border-[var(--textColor)]/40'
      }`}
    >
      <span
        className={`absolute w-[22px] h-[22px] rounded-full shadow-md transform transition-transform duration-300 ${
          toggleNow
            ? 'translate-x-[24px] bg-white'
            : isDark
            ? 'bg-[var(--textColor)] translate-x-0'
            : 'bg-gray-600 translate-x-0'
        }`}
      ></span>
    </div>
  )
}

export default Toggle
