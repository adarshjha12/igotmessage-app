'use client'

import { ChevronDown, ImagePlusIcon, Music, Music2Icon, Music3, Music4, MusicIcon, PenBoxIcon } from 'lucide-react'
import React, { ChangeEvent, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { ImageIcon } from '@phosphor-icons/react'
import ImageCropper from '../ImageCropper'
import MusicComponent from './MusicComponent'
import Image from 'next/image'
import StoryTemplates from './StoryTemplates'
import {setImageClicked, setMusicClicked, setWriteClicked} from '../../features/activitySlice'
import { useRouter } from 'next/navigation'

function CreateStoryPageComponent() {
  const router = useRouter()
    const dispatch = useDispatch()
    const isDark = useSelector( (state : RootState) => state.activity.isDark)
    const storyImageChosen = useSelector( (state : RootState) => state.activity.story.storyImage)

    const isSelectImageClicked = useSelector( (state : RootState) => state.activity.story.selectImageClicked)
    const isSelectMusicClicked = useSelector( (state : RootState) => state.activity.story.selectMusicClicked)
    const isSelectWriteClicked = useSelector( (state : RootState) => state.activity.story.selectWriteClicked)

    const [imagePreview, setImagePreview] = useState<undefined | string>()
    const [imageStoredLocally, setImageStoredLocally] = useState<string | undefined>()
    const [chevronActive, setChevronActive] = useState<boolean>(false)
    

    function handleImageChange (e: ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0]

      if (file && file.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(file))
      } else {
        setImagePreview(undefined)
      }
    }
console.log('storyImageChosen', storyImageChosen);

    const image = localStorage.getItem('')
    
    useEffect(() => {
      // if (image) {
      //   setImageStoredLocally(image)
      // }
      if (storyImageChosen) {
        setImagePreview(storyImageChosen)
      }
      console.log(imagePreview);
      
    }, [imagePreview, storyImageChosen]);

    useEffect(() => {
      dispatch(setImageClicked(false))
      dispatch(setMusicClicked(false))
      dispatch(setWriteClicked(false))
    }, [router]);

  return (
    <div className='w-full p-5 overflow-y-auto min-h-screen flex flex-col items-center justify-start gap-2.5 bg-[var(--bgColor)] backdrop-blur-md text-[var(--textColor)] '>
      <div className='w-full sm:w-[50%] px-2 py-2 h-full flex flex-col items-center justify-start gap-2.5 '>
        <form action="" className='flex w-full items-center pb-4 justify-between gap-3'>
          <button
          onClick={() => dispatch(setImageClicked(!isSelectImageClicked))}
          type="button"
          className={`relative group w-full sm:w-fit hover:bg-opacity-90  rounded-2xl px-2 py-1 flex active:bg-[var(--wrapperColor)] items-center gap-3 justify-center active:scale-95 ${isSelectImageClicked ? 'bg-[var(--textColor)] text-[var(--bgColor)]' : ''}`}
        >
          <div className='flex flex-col items-center justify-center gap-1'>
            <ImagePlusIcon size='40' strokeWidth={1} className={`${isSelectImageClicked ? ' text-[var(--bgColor)]' : 'text-[var(--textColor)]'}`} />
            <p className='text-sm font-semibold font-exo2'>Select Image</p>
          </div>
          <input
            type="file"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          </button>

          <button
          onClick={() => {
            dispatch(setMusicClicked(!isSelectMusicClicked))
            dispatch(setImageClicked(false))
            setChevronActive(prev => !prev)
          }}
            
            type="button"
            className={` cursor-pointer justify-center w-full sm:w-fit rounded-2xl px-2 py-1 flex items-center gap-3 active:bg-[var(--wrapperColor)] active:scale-95 ${isSelectMusicClicked ? 'bg-[var(--textColor)] text-[var(--bgColor)]' : ''}`}
          >
            <div className='flex relative justify-center items-center'>
              <div className='flex flex-col items-center justify-center gap-1'>
                <Music2Icon size= '40' strokeWidth={1} className={`${isSelectMusicClicked ? ' text-[var(--bgColor)]' : ''}`}/>
                <p className='text-sm font-semibold font-exo2'>Select Music</p>
              </div>
              <div className='absolute right-2'> <ChevronDown size={30} strokeWidth={1.5} className={`transition-all duration-150 ease-in ${chevronActive ? 'rotate-180' : ''} ${isSelectMusicClicked ? 'text-[var(--bgColor)]' : 'text-[var(--textColor)]'}`} /></div>
            </div>
          </button>
        
          <button
          onClick={() => dispatch(setWriteClicked(!isSelectWriteClicked))}
            type="button"
            className={` cursor-pointer justify-center w-full sm:w-fit rounded-2xl px-2 py-1 flex items-center gap-3 active:bg-[var(--wrapperColor)] active:scale-95 ${isSelectWriteClicked ? 'bg-[var(--textColor)] text-[var(--bgColor)]' : ''}`}
          >
            <div className='flex relative justify-center items-center'>
              <div className='flex flex-col items-center justify-center gap-1'>
                <PenBoxIcon size= '40' strokeWidth={1} className={`${isSelectWriteClicked ? ' text-[var(--bgColor)]' : 'text-[var(--textColor)]'}`} />
                <p className='text-sm font-semibold font-exo2'>Write</p>
              </div>
            </div>
          </button>
        </form>

        <div className='text-xl font-semibold'>
          <img src={image? imageStoredLocally : imagePreview} className={`${image || imagePreview ? 'max-w-full rounded-md ' : ''}`} alt="" />
          {/* <audio controls src="https://res.cloudinary.com/adarsh-ka-cloudinary/video/upload/v1747678814/tera-pyar-mera-junoon-335418_onq71n.mp3"> </audio> */}
        </div>
      </div>
      {isSelectMusicClicked && <div className=' down-slide h-full py-2 top-35 z-40 fixed overflow-y-auto flex pb-16 items-start justify-center '>
        <MusicComponent/>
      </div>}
      
      <div className={`w-full h-full flex-col justify-center items-center ${ isSelectMusicClicked || isSelectWriteClicked || storyImageChosen ? 'hidden' : 'flex'}`}>
          <StoryTemplates/>
      </div>
    </div>
  )
}

export default CreateStoryPageComponent