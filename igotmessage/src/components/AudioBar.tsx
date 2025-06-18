import React from 'react'

interface AudioBarsProps {
  isPlaying: boolean
}

const AudioBars: React.FC<AudioBarsProps> = ({ isPlaying }) => {
  return (
    <div className="">
      <div className='flex rounded-full items-end justify-center gap-1 w-6 h-6'>
        {[1, 2, 3].map((bar) => (
        <div
          key={bar}
          className={`w-1 bg-[var(--textColor)] rounded-sm transition-all duration-300
            ${isPlaying ? `animate-bar${bar}` : 'h-1'}
          `}
        />
      ))}
      </div>
    </div>
  )
}

export default AudioBars
