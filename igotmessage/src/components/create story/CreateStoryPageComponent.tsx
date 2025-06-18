'use client'

import { ChevronDown, ImagePlusIcon, Music, Music2Icon, Music3, Music4, MusicIcon, PenBoxIcon } from 'lucide-react'
import React, { ChangeEvent, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { ImageIcon } from '@phosphor-icons/react'
import ImageCropper from '../ImageCropper'
import MusicComponent from './MusicComponent'
import Image from 'next/image'
import StoryTemplates from './StoryTemplates'

function CreateStoryPageComponent() {
    const isDark = useSelector( (state : RootState) => state.activity.isDark)
    const [imagePreview, setImagePreview] = useState<undefined | string>()
    const [imageStoredLocally, setImageStoredLocally] = useState<string | undefined>()
    const [chevronActive, setChevronActive] = useState<boolean>(false)
    const [selectImageClick, setSelectImageClick] = useState<boolean>(false)
    const [musicClick, setMusicClick] = useState<boolean>(false)
    const [writeClick, setWriteClick] = useState<boolean>(false)

    function handleImageChange (e: ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0]

      if (file && file.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(file))
      } else {
        setImagePreview(undefined)
      }
    }

    const image = localStorage.getItem('')
    
    useEffect(() => {
      if (image) {
        setImageStoredLocally(image)
      }
      console.log(imagePreview);
      
    }, [imagePreview]);

  return (
    <div className='w-full p-5 min-h-screen flex flex-col items-center justify-start gap-2.5 bg-[var(--bgColor)] backdrop-blur-md text-[var(--textColor)] '>
      <div className='w-full sm:w-[50%] p-2 h-full flex flex-col items-center justify-start gap-2.5 '>
        <form action="" className='flex w-full justify-between gap-3'>
        <button
        onClick={() => setSelectImageClick(prev => !prev)}
        type="button"
        className={`relative group w-full sm:w-fit hover:bg-opacity-90  rounded-2xl px-2 py-1 flex active:bg-[var(--wrapperColor)] items-center gap-3 justify-center active:scale-95 ${selectImageClick ? 'bg-[var(--textColor)] text-[var(--bgColor)]' : ''}`}
      >
        <div className='flex flex-col items-center justify-center gap-1'>
          <ImagePlusIcon size='50' strokeWidth={1} className={`${selectImageClick ? ' text-[var(--bgColor)]' : 'text-[var(--textColor)]'}`} />
          <p className='text-md font-semibold font-exo2'>Select Image</p>
        </div>
        <input
          type="file"
          onChange={handleImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </button>

      <button
       onClick={() => {
        setMusicClick(prev => !prev)
        setChevronActive(prev => !prev)
       }}
        
        type="button"
        className={` cursor-pointer justify-center w-full sm:w-fit rounded-2xl px-2 py-1 flex items-center gap-3 active:bg-[var(--wrapperColor)] active:scale-95 ${musicClick ? 'bg-[var(--textColor)] text-[var(--bgColor)]' : ''}`}
      >
        <div className='flex relative justify-center items-center'>
          <div className='flex flex-col items-center justify-center gap-1'>
            <Music2Icon size= '50' strokeWidth={1} className={`${musicClick ? ' text-[var(--bgColor)]' : ''}`}/>
            <p className='text-md font-semibold font-exo2'>Select Music</p>
          </div>
          <div className='absolute right-2'> <ChevronDown size={30} strokeWidth={1.5} className={`transition-all duration-150 ease-in ${chevronActive ? 'rotate-180' : ''} ${musicClick ? 'text-[var(--bgColor)]' : 'text-[var(--textColor)]'}`} /></div>
        </div>
      </button>

      
      <button
       onClick={() => setWriteClick(prev => !prev)}
        type="button"
        className={` cursor-pointer justify-center w-full sm:w-fit rounded-2xl px-2 py-1 flex items-center gap-3 active:bg-[var(--wrapperColor)] active:scale-95 ${writeClick ? 'bg-[var(--textColor)] text-[var(--bgColor)]' : ''}`}
      >
        <div className='flex relative justify-center items-center'>
          <div className='flex flex-col items-center justify-center gap-1'>
            <PenBoxIcon size= '50' strokeWidth={1} className={`${writeClick ? ' text-[var(--bgColor)]' : 'text-[var(--textColor)]'}`} />
            <p className='text-md font-semibold font-exo2'>Write</p>
          </div>
        </div>
      </button>
      
        </form>
        {/* {!imagePreview && !imageStoredLocally ? <div className='w-full text-[85px] font-extrabold text-center text-gray-500/70 flex items-center justify-center'> 
        </div> : null} */}

        <div className='text-xl font-semibold'>
          <img src={image? imageStoredLocally : imagePreview} className={`${image || imagePreview ? 'max-w-full rounded-md border-1 border-[var(--borderColor)]' : ''}`} alt="" />
          {/* <audio controls src="https://res.cloudinary.com/adarsh-ka-cloudinary/video/upload/v1747678814/tera-pyar-mera-junoon-335418_onq71n.mp3"> </audio> */}
        </div>
      </div>
      {musicClick && <div className=' down-slide h-full py-2 inset-0 sm:left-8 sm:top-35 top-38  fixed w-full  overflow-y-auto flex items-start justify-center '>
        <MusicComponent/>
      </div>}
      
      <StoryTemplates/>
    </div>
  )
}

export default CreateStoryPageComponent