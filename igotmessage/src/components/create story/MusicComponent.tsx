import React, { useEffect } from 'react'
import musicData from '../../json/music.json'
import { CheckIcon, DrumIcon, FilterIcon, Guitar, LucidePause, Music2, PauseCircle, PauseIcon, PauseOctagon, Piano, Play, PlayCircle, PlayIcon, Plus, SortAsc, SortAscIcon, SortDesc, SortDescIcon, Speaker } from 'lucide-react'
import Image from 'next/image'
import { PauseCircleIcon, PlusIcon } from '@phosphor-icons/react'
import { number } from 'zod'
import { useRef } from 'react';
import AudioBars from '../AudioBar'
import { RootState } from '@/store/store'
import { useSelector, useDispatch } from 'react-redux'
import { setMusicData } from '@/features/activitySlice'
import NewLoader from '../NewLoader'
import { useRouter } from 'next/navigation'

interface Props {
  setMusicModal?: (value: boolean) => void
  setChevronActive?: (value: boolean) => void
  muteMusicOfParent?: (value: "yes" | "no") =>  void
}
function MusicComponent({ setMusicModal, setChevronActive, muteMusicOfParent }: Props) {
    const dispatch = useDispatch()
    const router = useRouter()

    const [showSortPopup, setShowSortPopup] = React.useState(false);
    const [showFilterPopup, setShowFilterPopup] = React.useState(false);
    const [allButtonActive, setAllButtonActive] = React.useState(true);
    const [bollywoodButtonActive, setBollywoodButtonActive] = React.useState(false);
    const [rockButtonActive, setRockButtonActive] = React.useState(false);

    const [aToZActive, setAToZActive] = React.useState(true);
    const [zToAActive, setZToAActive] = React.useState(false);
    const [doneClick, setDoneClick] = React.useState(false);

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
        muteMusicOfParent && muteMusicOfParent("yes")
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          muteMusicOfParent && muteMusicOfParent("yes")
        }

        const newAudio = new Audio(url);
        audioRef.current = newAudio;

        newAudio.play();
        setMusic({ playing: true, index });
      }
    };

    useEffect(() => {
        audioRef.current?.pause();
      }, [router]);

  return (
    <div className='flex scroll-smooth h-full overflow-y-auto rounded-2xl w-full sm:w-full border-1 py-2 flex-col items-center px-2 sm:px-4 justify-start  bg-[var(--bgColor)]/50 backdrop-blur-md  text-[var(--text-color)] gap-2'>
        <div className='flex flex-col justify-center items-center'>
          <p className='flex text-xl text-center bg-[var(--bgColor)]/50 rounded-2xl px-2 font-semibold items-center py-2 mb-4 justify-center'><Music2 size={40} strokeWidth={1.5}/> Select your favourite music</p>
          <div className='flex gap-2 w-full justify-evenly items-start'>
            <div className='relative'>
              <button
              onClick={() => {
                setShowSortPopup(prev => !prev)
                setShowFilterPopup(false)
              }}
              className='flex flex-col cursor-pointer p-2 active:scale-75 gap-1 justify-center items-center'
              > <div className='flex gap-2 justify-center items-center'>
                {aToZActive ? <SortAsc size={30} strokeWidth={1}/> : <SortDesc size={25} strokeWidth={1}/>}
                  <p className='text-2xl'>Sort</p>
                </div>
              <p className='border-1 px-2 text-[12px] border-[var(--borderColor)] rounded-md'>
                {aToZActive ? 'A-Z' : 'Z-A'}
              </p>
              </button>
              {showSortPopup && 
              <div className='fixed w-full z-40 py-6 px-12 rounded-2xl top-[40%] left-0 bg-[var(--wrapperColor)] text-[var(--textColor)] backdrop-blur-sm flex flex-col justify-center items-center'>
                  <button
                    onClick={() => {
                      setAToZActive(true)
                      setZToAActive(false)
                    }}
                    className={`mb-2 w-[200px] flex justify-center items-center gap-2 border border-[var(--borderColor)] py-2 rounded-xl cursor-pointer active:scale-90 transition-all duration-150 ${
                      aToZActive ? 'bg-[var(--textColor)] text-[var(--bgColor)] font-semibold text-xl' : ''
                    }`}
                  >
                    <SortAsc size={30} strokeWidth={1} />
                    <p>A-Z</p>
                  </button>

                  <button
                    onClick={() => {
                      setZToAActive(true)
                      setAToZActive(false)
                    }} 
                    className={`mb-2 w-[200px] px-10 flex justify-center items-center gap-2 border border-[var(--borderColor)] py-2 rounded-xl cursor-pointer active:scale-90 transition-all duration-150 ${
                      zToAActive ? 'bg-[var(--textColor)] text-[var(--bgColor)] font-semibold text-xl' : ''
                    }`}
                  >
                    <SortDescIcon size={30} strokeWidth={1} />
                    <p>Z-A</p>
                  </button>

                  <button
                  onClick={() => {
                    setShowFilterPopup(false)
                    setDoneClick(true)
                    setShowSortPopup(false)
                  }}
                   className='flex justify-center items-center gap-2 border-1 border-[var(--bgColor)] bg-blue-700 cursor-pointer active:scale-75 py-1 px-3 w-fit rounded-md text-white mt-4'> <CheckIcon strokeWidth={1} size={20} /> Done</button>
              </div>
            }
            </div>
            
            <div className='relative'>
              <button
              onClick={() => {
                setShowFilterPopup(prev => !prev)
                setShowSortPopup(false)
              }}
              className='flex flex-col cursor-pointer p-2 active:scale-75 gap-1 justify-end items-center'
              > <div className='flex gap-2 justify-center items-center'>
                  <FilterIcon size={25} strokeWidth={1}/> 
                  <p className='text-2xl'>Filter</p>
                </div>
              <p className='border-1 px-2 text-[12px] border-[var(--borderColor)] rounded-md'>
                {allButtonActive ? 'All' : bollywoodButtonActive ? 'Bollywood' : 'Rock'}
              </p>
              </button>
              {showFilterPopup && 
              <div className='fixed z-40 py-6 px-12 w-full rounded-2xl left-0 top-[40%] bg-[var(--wrapperColor)] text-[var(--textColor)] backdrop-blur-sm flex flex-col justify-center items-center'>
                  <button
                  onClick={() => {
                    setAllButtonActive(true)
                    setBollywoodButtonActive(false)
                    setRockButtonActive(false)
                  }}
                  className={`mb-2 border-1 w-full flex justify-start items-center gap-2 border-[var(--borderColor)] cursor-pointer active:scale-95 py-2 pr-28 pl-2 rounded-md ${allButtonActive ? 'bg-[var(--textColor)] text-[var(--bgColor)] font-semibold text-xl' : ''}`}
                  ><Piano size={30} strokeWidth={1}/> All</button>
                  <button
                   onClick={() => {
                    setBollywoodButtonActive(true)
                    setAllButtonActive(false)
                    setRockButtonActive(false)
                  }}
                  className={`mb-2 pr-28 pl-2 border-1 flex justify-start items-center gap-2 border-[var(--borderColor)] ${bollywoodButtonActive ? 'bg-[var(--textColor)] text-[var(--bgColor)] font-semibold text-xl' : ''} cursor-pointer active:scale-95 py-2 w-full rounded-md`}
                  ><Speaker size={30} strokeWidth={1}/> BollyWood</button>
                  <button
                  onClick={() => {
                    setBollywoodButtonActive(false)
                    setAllButtonActive(false)
                    setRockButtonActive(true)
                  }}
                  className={`mb-2 pr-28 pl-2 flex w-full justify-start items-center gap-2 border-1 border-[var(--borderColor)] ${rockButtonActive ? 'bg-[var(--textColor)] text-[var(--bgColor)] font-semibold text-xl' : ''} cursor-pointer active:scale-95 py-2  rounded-md`}
                  ><Guitar size={30} strokeWidth={1}/>  Rock</button>
                  <button
                  onClick={() => {
                    setShowFilterPopup(false)
                    setDoneClick(true)
                    setShowSortPopup(false)
                  }}
                   className='flex justify-center items-center gap-2 border-1 border-[var(--bgColor)] bg-blue-800 cursor-pointer active:scale-75 py-1 px-3 w-fit rounded-md text-white mt-4'> <CheckIcon strokeWidth={1} size={20} /> Done</button>
              </div>
            }
            </div>
          </div>
        </div>
           <div>
              {musicData
              .filter(item => {
                if (allButtonActive) return true;
                if (bollywoodButtonActive) return item.genre.startsWith('Bollywood');
                if (rockButtonActive) return item.genre.startsWith('Rock');
                return false;
              })
              .sort((a, b) =>
                aToZActive
                  ? a.title.localeCompare(b.title)
                  : b.title.localeCompare(a.title)
              )
              .map((item, index) => (
                <span
                  key={index}
                  className='flex w-full h-fit items-center justify-between gap-2 px-2 border-1 border-[var(--borderColor)] bg-[var(--bgColor)]/15 rounded-xl mb-3'
                >
                  <div className='flex items-center gap-2 px-2'>
                    <Image
                      src={item.image}
                      className='rounded-sm w-8 h-8'
                      width={40}
                      height={40}
                      alt='music artist'
                    />

                    <button
                      type='button'
                      onClick={(e) => handlePlayPause(item.url, index)}
                      className='flex items-center justify-center cursor-pointer'
                    >
                      {music.index === index && music.playing ? (
                        <PauseIcon size={30} strokeWidth={1} />
                      ) : (
                        <Play size={30} strokeWidth={1} />
                      )}
                    </button>

                    <div
                      className={`${
                        music.playing && music.index === index
                          ? 'scale-100 opacity-100 z-30'
                          : 'scale-100 opacity-0'
                      }`}
                    >
                      {audioRef.current && !audioRef.current?.paused ? <AudioBars isPlaying={music.playing && music.index === index} /> : 
                      <NewLoader/>}
                    </div>
                  </div>

                  <div className='overflow-hidden'>
                    <p
                      className={`text-end text-nowrap text-[15px] ${
                        music.index === index && music.playing ? 'translate-animation' : ''
                      }`}
                    >
                      {item.title
                        .split('-')
                        .slice(0, 3)
                        .join('-')
                        .split('_')[0]
                        .slice(0, 20) + '...'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setMusicModal && setMusicModal(false)
                      setChevronActive && setChevronActive(false)
                      dispatch(setMusicData(item))
                    }}
                    className='flex rounded-full active:bg-[var(--wrapperColor)] active:scale-50 p-1 items-center justify-center cursor-pointer'
                  >
                    <Plus size={35} strokeWidth={1} className='inline ml-auto' />
                  </button>
                </span>
              ))}

            </div>

            {/* {bollywoodButtonActive ? <div>
               {musicData.filter((item) => item.genre.startsWith('Bollywood') || item.genre === 'Bollywood').sort(aToZActive? (a, b) => a.title.localeCompare(b.title) : (a, b) => b.title.localeCompare(a.title)).map((item, index) => (
            <span key={index} className='flex w-full h-fit items-center justify-between gap-2 px-2 border-1 border-[var(--borderColor)] bg-[var(--bgColor)]/15 rounded-xl mb-3'>
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
                   <p className={`text-end text-nowrap text-[15px] ${music.index === index && music.playing ? 'translate-animation' : ''}`}>{item.title.split('-').slice(0, 3).join('-').split('_')[0].slice(0, 20) + "..."}</p>
                </div>
                <button
                onClick={() => dispatch(setMusicData(item))}
                 className='flex rounded-full active:bg-[var(--wrapperColor)] active:scale-50 p-1 items-center justify-center cursor-pointer'>
                  <Plus size={35} strokeWidth={1} className="inline ml-auto" />
                </button>
            </span>
            ))}
            </div> : null}

            {rockButtonActive ? <div>
               {musicData.filter((item) => !item.genre.startsWith('Bollywood')).sort(aToZActive? (a, b) => a.title.localeCompare(b.title) : (a, b) => b.title.localeCompare(a.title)).map((item, index) => (
            <span key={index} className='flex w-full h-fit items-center justify-between gap-2 px-2 border-1 border-[var(--borderColor)] bg-[var(--bgColor)]/15 rounded-xl mb-3'>
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
                   <p className={`text-end text-nowrap text-[15px] ${music.index === index && music.playing ? 'translate-animation' : ''}`}>{item.title.split('-').slice(0, 3).join('-').split('_')[0].slice(0, 20) + "..."}</p>
                </div>
                <button
                onClick={() => dispatch(setMusicData(item))}
                 className='flex rounded-full active:bg-[var(--wrapperColor)] active:scale-50 p-1 items-center justify-center cursor-pointer'>
                  <Plus size={35} strokeWidth={1} className="inline ml-auto" />
                </button>
            </span>
            ))}
            </div> : null} */}
            
            {showSortPopup || showFilterPopup ? (
              <div
              onClick={() => 
                {
                  setShowSortPopup(false) 
                   setShowFilterPopup(false)
                  } }
              className='fixed w-full h-screen inset-0 z-30 bg-black/70'
              ></div>
            ) : null}
            
    </div>
  )
}

export default MusicComponent