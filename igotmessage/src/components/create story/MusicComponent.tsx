import React, { useEffect } from 'react'
import musicData from '../../json/music.json'
import { LucidePause, Music2, PauseCircle, PauseIcon, PauseOctagon, Play, PlayCircle, PlayIcon, Plus } from 'lucide-react'
import Image from 'next/image'
import { PauseCircleIcon, PlusIcon } from '@phosphor-icons/react'
import { number } from 'zod'
import { useRef } from 'react';
import AudioBars from '../AudioBar'

function MusicComponent() {
    const [music, setMusic] = React.useState({
      playing: false,
      index: -1
    });


    const audioRef = useRef<HTMLAudioElement | null>(null);
console.log(audioRef);

    const handlePlayPause = (url: string, index: number) => {
      if (audioRef.current && !audioRef.current.paused && index === music.index) {
        audioRef.current.pause();
        setMusic({ playing: false, index });
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        const newAudio = new Audio(url);
        audioRef.current = newAudio;

        newAudio.play();
        setMusic({ playing: true, index });
      }
    };


  return (
    <div className='flex rounded-2xl  sm:w-[60%] md:w-[40%] w-[90%] border-1 py-2 flex-col items-center px-4 justify-center  bg-[var(--bg-color)]/15 backdrop-blur-sm text-[var(--text-color)] gap-2'>
        <p className='flex text-2xl text-center bg-[var(--bgColor)] rounded-2xl px-2 font-semibold items-center py-4 justify-center'><Music2 size={40} strokeWidth={1.5}/> Select your favourite music</p>
            {musicData.map((item, index) => (
            <span key={index} className='flex w-full h-fit items-center justify-between gap-2 px-2 border-1 border-[var(--borderColor)] rounded-xl mb-3'>
               <div className='flex items-center gap-2 px-2'>
                <Image src={item.image} className='rounded-sm w-8 h-8' width={40} height={40} alt="music artist" />
              
                <button
                  type='button'
                  onClick={(e) => handlePlayPause(item.url, index)}
                  className='flex items-center justify-center cursor-pointer' >
                  {music.index === index && music.playing ?
                  <PauseIcon size={30} strokeWidth={1} className="" />
                  :
                  <Play size={30} strokeWidth={1} className="" />
                  }
                </button>
                <div className={`${music.playing && music.index === index ? 'scale-100 opacity-100 z-30' : 'scale-100 opacity-0'}`}>
                  <AudioBars isPlaying={music.playing && music.index === index} />
                </div>

               </div>
              
                <div className='overflow-hidden'>
                   <p className={`text-end text-nowrap text-xs ${music.index === index && music.playing ? 'translate-animation' : ''}`}>{item.title.split('-').slice(0, 3).join('-').split('_')[0].slice(0, 20) + "..."}</p>
                </div>
                <button
                 className='flex rounded-full active:bg-[var(--wrapperColor)] active:scale-50 p-1 items-center justify-center cursor-pointer'>
                  <Plus size={35} strokeWidth={1} className="inline ml-auto" />
                </button>
            </span>
            ))}
    </div>
  )
}

export default MusicComponent