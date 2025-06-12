import { RootState } from '@/store/store'
import {  Cpu } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

function SplashScreen() {
  const isDark = useSelector((state: RootState) => state.activity.isDark)

  return (
    <div className='flex bg-gradient-to-r from-[var(--wrapperColor)] to-[var(--bgColor)] flex-col text-[var(--textColor)] z-50 fixed inset-0 justify-center items-center'>
       <div className='flex flex-col items-center gap-4 justify-center'>
        {isDark ? <img src="/logos/whiteIcon.png" alt="logo" width={150} height={100} /> : <img src="/logos/blackIcon.png" alt="logo" width={150} height={100} />}
        <p className='text-4xl font-extrabold font-montez'>IgotMessage</p>
       </div>
       <div className='flex absolute bottom-32 items-center pt-10 gap-2 justify-center'>
        <div className='w-[25px] h-[25px]  animate-spin border-6 border-dotted border-[var(--textGrayColor)] rounded-full'></div>
       </div>
       <div className='flex absolute bottom-6 flex-col items-center justify-center'>
        <p className='text-sm font-semibold text-[var(--textGrayColor)] font-sans'>from</p>
        <div className='flex gap-1 items-center justify-center'>
         {/* <img src="/window.svg" alt="logo" width={40} height={10} /> */}
         <Cpu className='text-[var(--textGrayColor)]' />
         <p className='text-sm tracking-widest text-[var(--textGrayColor)] font-semibold font-audioWide'>JhaFusion LLC</p>
        </div>
       </div>
        
    </div>
  )
}

export default SplashScreen