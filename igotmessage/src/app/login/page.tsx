'use client'
import React from 'react'
import OtpInput from '../components/OtpInput'

function page() {

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
          <div>
            <select name="" id="" className=''>
              <option className='text-black' value="">+91</option>
              <option className='text-black' value="">+11</option>
              <option className='text-black' value="">+32</option>
            </select>
            <input type="text" className='bg-amber-50 opacity-70 pl-2 rounded-md text-black outline-none'/>
          </div>

          <OtpInput/>

        </form>
      </div>
    </div>
  )
}

export default page