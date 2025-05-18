'use client'
import { Plus } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'

function Story() {
    const router = useRouter()
  return (
    <div className='w-full h-fit flex overflow-x-auto whitespace-nowrap scroll-smooth hide-scrollbar'>
        <button type='button' onClick={() => router.push('/create-story')} className='w-[100px] h-[100px] mr-2 rounded-full bg-gradient-to-r from-blue-500 to-red-600 border-1 border-black cursor-pointer grid place-items-center snap-start flex-shrink-0 '>
            <div className='w-[92px] h-[92px] grid place-items-center bg-[var(--borderColor)] rounded-full'>
                <Plus size={80} strokeWidth={1} className='text-[var(--bgColor)] '/>
            </div>
        </button>
        <div className='w-[100px] h-[100px] mr-2 rounded-full bg-gradient-to-r from-blue-500 to-red-600 border-1 border-black snap-start flex-shrink-0 '></div>
        <div className='w-[100px] h-[100px] mr-2 rounded-full bg-gradient-to-r from-blue-500 to-red-600 border-1 border-black snap-start flex-shrink-0 '></div>
        <div className='w-[100px] h-[100px] mr-2 rounded-full bg-gradient-to-r from-blue-500 to-red-600 border-1 border-black snap-start flex-shrink-0 '></div>
        <div className='w-[100px] h-[100px] mr-2 rounded-full bg-gradient-to-r from-blue-500 to-red-600 border-1 border-black snap-start flex-shrink-0 '></div>
        <div className='w-[100px] h-[100px] mr-2 rounded-full bg-gradient-to-r from-blue-500 to-red-600 border-1 border-black snap-start flex-shrink-0 '></div>
        <div className='w-[100px] h-[100px] mr-2 rounded-full bg-gradient-to-r from-blue-500 to-red-600 border-1 border-black snap-start flex-shrink-0 '></div>
        <div className='w-[100px] h-[100px] mr-2 rounded-full bg-gradient-to-r from-blue-500 to-red-600 border-1 border-black snap-start flex-shrink-0 '></div>
        <div className='w-[100px] h-[100px] mr-2 rounded-full bg-gradient-to-r from-blue-500 to-red-600 border-1 border-black snap-start flex-shrink-0 '></div>
        <div className='w-[100px] h-[100px] mr-2 rounded-full bg-gradient-to-r from-blue-500 to-red-600 border-1 border-black snap-start flex-shrink-0 '></div>
        <div className='w-[100px] h-[100px] mr-2 rounded-full bg-gradient-to-r from-blue-500 to-red-600 border-1 border-black snap-start flex-shrink-0 '></div>
        <div className='w-[100px] h-[100px] mr-2 rounded-full bg-gradient-to-r from-blue-500 to-red-600 border-1 border-black snap-start flex-shrink-0 '></div>
        <div className='w-[100px] h-[100px] mr-2 rounded-full bg-gradient-to-r from-blue-500 to-red-600 border-1 border-black snap-start flex-shrink-0 '></div>
        <div className='w-[100px] h-[100px] mr-2 rounded-full bg-gradient-to-r from-blue-500 to-red-600 border-1 border-black flex-shrink-0 '></div>
    </div>
  )
}

export default Story