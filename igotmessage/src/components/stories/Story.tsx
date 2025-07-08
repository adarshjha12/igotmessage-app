'use client'
import { Plus, PlusIcon, UserIcon } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function Story() {
  
  return (
    <div className='w-full py-4 h-fit z-0 flex overflow-x-auto whitespace-nowrap scroll-smooth hide-scrollbar '>
        <div className='flex flex-col items-center justify-center gap-2'>
          <Link href='/create-story' className='w-[80px] h-[80px] relative mr-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-900  cursor-pointer grid place-items-center snap-start flex-shrink-0 '>
          <div>
            <UserIcon size={40} strokeWidth={1}className='text-white'/>
          </div>
            <div className='bg-black place-content-center absolute bottom-2 right-2 rounded-full'>
                <PlusIcon className='text-white'/>
            </div>
            
        </Link>
        <p className='text-xs'>Create Story</p>
        </div>
        
    </div>
  )
}

export default Story