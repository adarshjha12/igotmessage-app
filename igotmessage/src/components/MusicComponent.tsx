import React from 'react'
import musicData from '../json/music.json'
import { LucidePause, Music2, PauseCircle, PauseIcon, PauseOctagon, PlayCircle, PlayIcon } from 'lucide-react'
import Image from 'next/image'
import { PauseCircleIcon } from '@phosphor-icons/react'

function MusicComponent() {

    const [musicPlaying, setMusicPlaying] = React.useState(false)
  return (
    <div className='flex rounded-2xl w-full flex-col items-center justify-center p-4 bg-[var(--bg-color)] text-[var(--text-color)] gap-2'>
        <p className='flex text-4xl font-semibold items-center py-4 justify-center'><Music2 size={40} strokeWidth={1.5}/> Music</p>
            {musicData.map((item, index) => (
            <span key={index} className='flex w-[80%] sm:w-[30%] items-center justify-start gap-2 px-2 py-1 border-1 border-[var(--borderColor)] rounded-md mb-3'>
               <Image src={item.image} className='rounded-sm w-8 h-8' width={40} height={40} alt="music artist" />
               <button 
               className="cursor-pointer"
                onClick={() => {
                        setMusicPlaying(prev => !prev)
                        const audio = new Audio(item.url)
                        audio.play()
                    }}>
                    
                {musicPlaying ?
                <PauseCircleIcon size={30} className="inline mr-2" />
                 
                 : 
                 <PlayIcon className="inline mr-2" strokeWidth={1.5}/> 
                }
               </button>
                <p>{item.title.split('-').slice(0, 3).join('-').split('_')[0]}</p>
            </span>
            ))}
    </div>
  )
}

export default MusicComponent