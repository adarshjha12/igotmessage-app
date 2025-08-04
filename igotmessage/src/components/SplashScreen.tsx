import { RootState } from '@/store/store'
import {  Cpu } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'

function SplashScreen() {

  return (
    <div className='flex bg-gradient-to-r from-[var(--wrapperColor)] to-[var(--bgColor)] flex-col text-[var(--textColor)] z-50 fixed inset-0 justify-center items-center'>
       <div className='flex flex-col items-center gap-4 justify-center'>
        <div className='px-3 py-7 bg-white/90 flex rounded-[30px] border-1 border-[var(--borderColor)]'>
          <Image src="/images/ig.png" alt="logo" className='w-[70px] h-[60px]'  width={80} height={80} />
          <Image src="/images/m.png" alt="logo" className='w-[50px] animate-bounce h-[60px] mt-3'  width={80} height={80} />
        </div>
        <p className='text-4xl font-medium font-montez'>IgotMessage</p>
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