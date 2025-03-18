'use client'
import React, {useState} from 'react'
import OtpInput from '../components/OtpInput'

function page() {

  const [buttonClick, setButtonClick] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  
  const handleGoogleButtonClick = function () {
    setButtonClick(true)
  }

  const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setOtpSent(true)
  }

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col bg-gradient-to-r to-blue-600'>
      <div className='border-1 p-6 border-white rounded-xl flex flex-col items-center gap-10'>

        <div className='flex flex-col items-center'>
          <img src="/images/logo.png" className='w-[60px] h-auto rounded-2xl' alt="" />
          <p className='text-5xl font-montez h-fit'>Igotmessage</p>
        </div>
        <hr className='w-[100px] bg-white'/>
        <div className={` ${otpSent ? 'hidden' : null} flex flex-col items-center justify-center gap-4`}>
          <form action="" onSubmit={handleSubmit} className='flex flex-col gap-1 items-center'>
            <label htmlFor="" className=' font-exo2 pb-2.5'>Please continue with phone number</label>
            <div className='flex gap-2'>
              <div className='border-1 flex justify-center items-center border-white h-[40px] rounded-md'>
                <select name="" id="" className='border-none outline-none'>
                  <option className='text-black' value="+91">+91</option>
                  <option className='text-black' value="+11">+11</option>
                  <option className='text-black' value="+32">+32</option>
                </select>
                <input type="text" autoFocus={true} maxLength={10} className='w-38 text-white pl-1 rounded-sm outline-none font-semibold tracking-widest'/>
              </div>
              <button type='submit' className='h-[40px] font-exo2 font-semibold tracking-wider cursor-pointer bg-green-700 hover:bg-amber-700 border-1 rounded-md px-2'>Get otp</button>
            </div>
          </form>
          <p className='font-exo2 px-1 rounded-sm text-3xl'>or</p>

          <button onClick={() => handleGoogleButtonClick()} className={`${buttonClick ? 'bg-green-700' : null} flex cursor-pointer justify-center items-center border-2 rounded-2xl px-2`}>
            <p className='font-exo2 mr-2 rounded-2xl px-1'>Continue with</p>
            <img src="/images/google.png" className='w-[70px] h-auto relative top-0.5' alt="google" />
          </button>
        </div>
        <OtpInput showOtpField={otpSent}/>
      </div>
    </div>
  )
}

export default page