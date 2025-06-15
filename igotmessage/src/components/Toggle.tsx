import React from 'react'

interface ToggleProps {
    toggleNow: boolean,
}

function Toggle ({toggleNow} : ToggleProps) {
  return (
    <div>
        <div className={`w-[60px] rounded-full p-0.5 bg-[var(--bgColor)] flex justify-start border-1 ${toggleNow ? 'border-white' : 'border-black  '}`}>
            <span className={`w-[25px] h-[25px] rounded-full bg-[var(--textColor)] z-30 border-2 border-[var(--textColor)] transform ease-linear duration-100${toggleNow ? ' translate-x-[28px] ' : ' translate-x-0'}`}></span>
        </div>
    </div>
  )
}

export default Toggle