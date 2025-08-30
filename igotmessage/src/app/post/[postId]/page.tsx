"use client"
import { useParams } from 'next/navigation';
import React from 'react'

function page() {
    const param = useParams();
    const postId = param.postId
  return (
    <div className='bg-black text-white'>
        {postId}
    </div>
  )
}

export default page