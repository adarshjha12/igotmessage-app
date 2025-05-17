import React from 'react'

interface ToggleProps {
    dark: boolean,
}

function Toggle ({dark} : ToggleProps) {
  return (
    <div>
        <div className={`w-[40px] rounded-full bg-white flex justify-start border-1 ${dark ? 'border-white' : 'border-black p-[1px] '}`}>
            <span className={`w-[20px] h-[20px] rounded-full bg-gradient-to-r from-black to-blue-600 transform ease-linear duration-300${dark ? ' translate-x-[18px] bg-green-500' : ' translate-x-0'}`}></span>
        </div>
    </div>
  )
}

export default Toggle