'use client'

import { PlusIcon, UserIcon } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

function Story() {
  return (
    <div className="w-full py-4 px-2 h-fit z-0 flex overflow-x-auto whitespace-nowrap scroll-smooth hide-scrollbar">
      <div className="flex flex-col items-center justify-center gap-2">
        <Link
          href="/create-story"
          className="relative w-[88px] h-[88px] mr-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-800 shadow-md hover:scale-105 transition-transform duration-300 ease-out group"
        >
          <div className="grid place-items-center w-full h-full">
            <UserIcon
              size={40}
              strokeWidth={1.2}
              className="text-white group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="absolute bottom-1.5 right-1.5 bg-black border-2 border-white rounded-full p-1 shadow-sm">
            <PlusIcon className="text-white" size={14} />
          </div>
        </Link>
        <p className="text-[13px] font-medium text-[var(--textColor)] ">
          Create Story
        </p>
      </div>
    </div>
  )
}

export default Story
