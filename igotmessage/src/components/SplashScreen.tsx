import { Home, Workflow } from 'lucide-react'
import React from 'react'

function SplashScreen() {
  return (
    <div className='flex bg-[var(--bgColor)] flex-col text-[var(--textColor)] z-50 fixed top-0 justify-center items-center h-screen w-screen'>
       <div className='flex flex-col items-center justify-center'>
        <img src="/logos/mainIcon.png" alt="logo" width={200} height={100} />
        <p className='text-5xl font-extrabold font-montez'>IgotMessage</p>
       </div>
       <div className='flex items-center pt-10 gap-2 justify-center'>
        <p className='text-md font-semibold text-[var(--textGrayColor)] font-sans'>Just a second...</p>
        <div className='w-[30px] h-[30px]  animate-spin border-6 border-dotted border-[var(--textGrayColor)] rounded-full'></div>
       </div>
       <div className='flex pt-[100px] flex-col items-center justify-center'>
        <p className='text-md font-semibold text-[var(--textGrayColor)] font-sans'>From</p>
        <div className='flex gap-1 items-center justify-center'>
         {/* <img src="/window.svg" alt="logo" width={40} height={10} /> */}
         <Workflow className='text-[var(--textGrayColor)]' />
         <p className='text-md tracking-widest text-[var(--textGrayColor)] font-semibold font-audioWide'>JhaFusion LLC</p>
        </div>
       </div>
        
    </div>
  )
}

export default SplashScreen