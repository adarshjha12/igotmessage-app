import React from 'react'
import musicData from '../json/music.json'
import { PauseIcon, PlayCircle, PlayIcon } from 'lucide-react'

function MusicComponent() {

    const [musicPlaying, setMusicPlaying] = React.useState(false)
  return (
    <div className='flex rounded-2xl flex-col items-center justify-center p-4 bg-[var(--bg-color)] text-[var(--text-color)]'>
        <h2>Music</h2>
            {musicData.map((item, index) => (
            <span key={index} className='flex items-center justify-between p-2 border-1 rounded-md mb-3'>
               <img src={item.image} alt="music artist" />
               <button 
               className="inline mr-2 cursor-pointer"
                onClick={() => {
                        setMusicPlaying(prev => !prev)
                        const audio = new Audio(item.url)
                        audio.play()
                    }}>
                
                    
                {musicPlaying ? <PlayIcon className="inline mr-2" /> : <PauseIcon className="inline mr-2" />}
               </button>
               <p>{item.title}</p>
            </span>
            ))}
    </div>
  )
}

export default MusicComponent