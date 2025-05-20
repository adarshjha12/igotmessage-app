'use client'
import Story from '@/components/stories/Story'
import React, {useEffect} from 'react'
import musicTracks from '@/utils/music'
import CameraCapture from '@/components/Camera';
// import { useRouter, useSearchParams } from 'next/navigation'

function Page() {
  console.log(musicTracks);
  // const searchParams = useSearchParams()

  // useEffect(() => {
  //   const panel = searchParams.get('panel-open')
    
  // }, [searchParams]);

  
  return (
    <div className=' w-full pl-1 h-full'>
     <Story/>
    </div>
  )
}

export default Page