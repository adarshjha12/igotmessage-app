import React from 'react'



const AudioBars = () => {
  return (
    <div className="">
      <div className='flex rounded-full items-end justify-center gap-1 w-6 h-6'>
        {[1, 2, 3].map((bar) => (
        <div
          key={bar}
          className={`w-1 bg-[var(--textColor)] animate-bar${bar} rounded-sm transition-all duration-300
          `}
        />
      ))}
      </div>
    </div>
  )
}

export default AudioBars
