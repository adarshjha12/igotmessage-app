'use client'
import { ImagePlusIcon } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

function Page() {
    const isDark = useSelector( (state : RootState) => state.auth.isDark)
    URL

  return (
    <div className='w-full p-3 min-h-screen flex items-start justify-center bg-[var(--bgColor)] text-[var(--textColor)] '>
      <form action="">
        <button type='button' className='bg-[var(--wrapperColor)] cursor-pointer hover:scale-105 transition-all ease-in duration-200 relative px-3 py-2 rounded-xl flex justify-center shadow-[0_1px_1px_1px_rgba(0,0,0,0.3)] border-[var(--borderColor)] items-center'>
          <div className='flex justify-center items-center gap-2'>
            <div className='font-semibold text-xl font-exo2'>Choose Image</div>
            <ImagePlusIcon size={33} fill={isDark? 'green' : 'orange'} strokeWidth={1} className={`text-[var(--textColor)]`}/>
          </div>
          <input type="file" name="" id="" className='absolute w-full opacity-0 cursor-pointer inset-0 '/>
        </button>
      </form>
    </div>
  )
}

export default Page