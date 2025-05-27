'use client'
import { Plus } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'

function Story() {
    const router = useRouter()
  return (
    <div className='w-full h-fit z-0 flex overflow-x-auto whitespace-nowrap scroll-smooth hide-scrollbar'>
        <button type='button' onClick={() => router.push('/create-story')} className='w-[80px] h-[80px] mr-2 rounded-full bg-gradient-to-r from-blue-700 to-red-600 border-1 border-black cursor-pointer grid place-items-center snap-start flex-shrink-0 '>
            <div className='w-[50px] h-[50px] -z-0 backdrop-blur-lg bg-white/40 grid place-content-center  rounded-full'>
                <Plus size={60} strokeWidth={1} className='text-[var(--bgColor)] '/>
            </div>
        </button>
        
    </div>
  )
}

export default Story