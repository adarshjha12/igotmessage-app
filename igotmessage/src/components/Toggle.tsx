import React from 'react'

interface ToggleProps {
    toggleNow: boolean,
}

function Toggle ({toggleNow} : ToggleProps) {
  return (
    <div>
        <div className={`w-[60px] rounded-full p-0.5 bg-[var(--wrapperColor)] flex justify-start border-1 ${toggleNow ? 'border-white' : 'border-black  '}`}>
            <span className={`w-[25px] h-[25px] rounded-full bg-[var(--textColor)] z-30 border-2 border-[var(--textColor)] transform ease-linear duration-300${toggleNow ? ' translate-x-[29px] ' : ' translate-x-0'}`}></span>
        </div>
    </div>
  )
}

export default Toggle