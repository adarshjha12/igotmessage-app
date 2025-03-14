'use client'
import React from 'react'

function page() {

  const moveNext = function name(current: HTMLInputElement, index: number) {
    
  }

  return (
    <div className='font-sans w-full min-h-screen gap-2 flex items-center justify-center flex-col bg-gradient-to-r to-blue-600'>
      <div className='w-full flex flex-col items-center'>
        <img src="/images/logo.png" className='w-[60px] h-auto rounded-2xl' alt="" />
        <p className='text-5xl font-montez h-fit'>igotmessage</p>

      </div>
      <div>
        <p className='text-[15px] tracking-widest'>please <span className='text-xl'>login</span> to continue</p>
        <form action="" className='flex flex-col gap-1'>
          <label htmlFor=""></label>
          <input type="text" className='bg-amber-50'/>
          
          <div>
            <input type="text" maxLength={1} className="otp-input" onInput={(e) => moveNext(e.target as HTMLInputElement, 0)}
            />
            <input type="text" maxLength={1} className="otp-input" onInput={(e) => moveNext(e.target as HTMLInputElement, 1)}
            />
            <input type="text" maxLength={1} className="otp-input" onInput={(e) => moveNext(e.target as HTMLInputElement, 2)}
            />
            <input type="text" maxLength={1} className="otp-input" onInput={(e) => moveNext(e.target as HTMLInputElement, 3)}
            />
            
          </div>
        </form>
      </div>
    </div>
  )
}

export default page