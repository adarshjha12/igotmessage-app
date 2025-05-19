import Story from '@/components/stories/Story'
import React from 'react'
import musicTracks from '@/utils/music'

function Page() {
  console.log(musicTracks);
  
  return (
    <div className=' w-full pl-1 h-full'>
     <Story/>
     {/* <div className=' flex justify-center fixed w-[200px] h-[300px] backdrop-blur-xs items-center bg-black/5 min-w-screen min-h-screen '>
       lskjfldjfldj
    </div> */}
    </div>
  )
}

export default Page