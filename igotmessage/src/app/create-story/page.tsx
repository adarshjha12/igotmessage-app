'use client'
import { ImagePlusIcon, Music } from 'lucide-react'
import React, { ChangeEvent, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

function Page() {
    const isDark = useSelector( (state : RootState) => state.auth.isDark)
    const [imagePreview, setImagePreview] = useState<undefined | string>()
    const [imageStoredLocally, setImageStoredLocally] = useState<string | undefined>()

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
    <div className='w-full relative p-5 min-h-screen flex flex-col items-center justify-between gap-2.5 bg-gradient-to-r from-[var(--bgColor)]  to-[var(--inputBg)] text-[var(--textColor)] '>
      <form action="" className='flex w-full justify-evenly gap-1'>
        <button
         type='button'
         onClick={() => (setImageStoredLocally(imagePreview))}
          className=' cursor-pointer hover:scale-105 transition-all ease-in duration-200 relative px-1 py-2 rounded-xl flex justify-center  border-[var(--borderColor)] active:scale-75 items-center'>
          <div className='flex justify-center items-center gap-2'>
            <div className=' text-sm font-exo2'>Choose Image</div>
            <ImagePlusIcon size={33} fill={isDark? 'green' : 'orange'} strokeWidth={1} className={`text-[var(--textColor)]`}/>            
          </div>
          <input
           type="file" 
           onChange={handleImageChange}
           name="" 
           id="" 
           className='absolute w-full opacity-0 cursor-pointer inset-0 '/>
        </button>

        <button type='button' className=' cursor-pointer hover:scale-105 transition-all ease-in duration-200 relative px-1 py-2 rounded-xl flex justify-center  border-[var(--borderColor)] items-center active:scale-75 gap-2'> 
          <div className=' text-sm font-exo2'>Select Music</div>
          <Music size={33} fill={isDark? '#ac05f9' : '#ac05f9'} strokeWidth={1} className={`text-[var(--textColor)]`}/>
        </button>

      </form>
      <div className='bg-[var(--bgColor)] text-xl font-semibold'>
        <img src={image? imageStoredLocally : imagePreview} className='max-w-full' alt="" />
        {/* <audio controls src="https://res.cloudinary.com/adarsh-ka-cloudinary/video/upload/v1747678814/tera-pyar-mera-junoon-335418_onq71n.mp3"> </audio> */}
      </div>
    </div>
  )
}

export default Page