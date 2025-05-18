'use client'
import { ImagePlusIcon, Music } from 'lucide-react'
import React, { ChangeEvent, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { string } from 'zod'

function Page() {
    const isDark = useSelector( (state : RootState) => state.auth.isDark)
    const [imagePreview, setImagePreview] = useState<undefined | string>()

    function handleImageChange (e: ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0]

      if (file && file.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(file))
      } else {
        setImagePreview(undefined)
      }
    }

  return (
    <div className='w-full p-5 min-h-screen flex flex-col items-center justify-between gap-2.5 bg-[var(--bgColor)] text-[var(--textColor)] '>
      <form action="" className='flex gap-3'>
        <button type='button' className='bg-[var(--wrapperColor)] cursor-pointer hover:scale-105 transition-all ease-in duration-200 relative px-3 py-2 rounded-xl flex justify-center shadow-[0_1px_1px_1px_rgba(0,0,0,0.3)] border-[var(--borderColor)] items-center'>
          <div className='flex justify-center items-center gap-2'>
            <div className='font-semibold text-xl font-exo2'>Choose Image</div>
            <ImagePlusIcon size={33} fill={isDark? 'green' : 'orange'} strokeWidth={1} className={`text-[var(--textColor)]`}/>            
          </div>
          <input
           type="file" 
           onChange={handleImageChange}
           name="" 
           id="" 
           className='absolute w-full opacity-0 cursor-pointer inset-0 '/>
        </button>

        <button type='button' className='bg-[var(--wrapperColor)] cursor-pointer hover:scale-105 transition-all ease-in duration-200 relative px-3 py-2 rounded-xl flex justify-center shadow-[0_1px_1px_1px_rgba(0,0,0,0.3)] border-[var(--borderColor)] items-center gap-2'> 
          <div className='font-semibold text-xl font-exo2'>Select Music</div>
          <Music size={33} fill={isDark? '#ac05f9' : '#ac05f9'} strokeWidth={1} className={`text-[var(--textColor)]`}/>
        </button>

      </form>
      <div>
        <img src={imagePreview} className='max-w-full' alt="" />
      </div>
    </div>
  )
}

export default Page