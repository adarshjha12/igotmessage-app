'use client'
import React, {useState, useEffect, useRef} from 'react'
import OtpInput from '../../components/OtpInput'
import PopupMessage from '@/components/popups/PopupMessages'

function page() {

  const [buttonClick, setButtonClick] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [showOtpSentSuccessPopup, setShowOtpSentSuccessPopup] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const [countryCode, setCountryCode] = useState('+91')
  const [phoneNo, setPhoneNo] = useState('')  
  const [otp, setOtp] = useState('')
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [showPopupForEmptyInput, setShowPopupForEmptyInput] = useState(false)
  const [showPopupForWrongNumber, setShowPopupForWrongNumber] = useState(false)
  const testInput = /^\d+$/.test(phoneNo)

useEffect(() => {
  if (testInput) {
    console.log('nicely going');
    
  } else if(phoneNo.length > 0 && !testInput){
    console.log('stop that shit');
    setShowPopupForWrongNumber(true)
  
    setTimeout(() => {
      setShowPopupForWrongNumber(false)
    }, 5000);
  }
}, [phoneNo, testInput]);

  const handleGoogleButtonClick = function () {
    window.location.href = "http://localhost:5000/google/auth/google";
    setButtonClick(true)
  }

  const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log(typeof phoneNo);
    
    if (!phoneNo) {
      setShowPopupForEmptyInput(true)
      inputRef.current?.focus()

      setTimeout(() => {
        setShowPopupForEmptyInput(false)
      }, 5000);
      return
    }

    setOtpSent(true)
    setShowOtpSentSuccessPopup(true)

    setTimeout(() => {
      setShowOtpSentSuccessPopup(false)
    }, 5000);
  }

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col bg-gradient-to-r to-blue-600'>
        <div className={`${otpSent ? 'test-slide' : 'right-slide'} border-1 p-6 border-white rounded-xl flex flex-col items-center gap-10`}>

        <div className='flex flex-col items-center'>
          <img src="/images/logo.png" className='w-[60px] h-auto rounded-2xl' alt="" />
          <p className={` text-5xl font-montez h-fit hover:scale-125 transition-all hover:ease-in`}>Igotmessage</p>
        </div>
        <hr className='w-[100px] bg-white'/>
        <div className={` ${otpSent ? 'hidden' : null} flex flex-col items-center justify-center gap-4`}>
          <form action="" onSubmit={handleSubmit} className='flex flex-col gap-1 items-center'>
            <label htmlFor="" className=' font-exo2 text-xs pb-2.5'>Please continue with phone number</label>
            <div className='flex gap-2'>
              <div className='border-1 flex justify-center items-center border-white h-[40px] rounded-md'>
                <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className='border-none outline-none'>
                  <option className='text-black bg-green-500 font-semibold' value="+91">IND +91</option>
                  <option className='text-black' value="+1">USA +1 </option>
                  <option className='text-black' value="+32">SCT +32 </option>
                  <option className='text-black' value="+44">UK +44 </option>
                  <option className='text-black' value="+52">MXC +52 </option>
                  <option className='text-black' value="+86">CHN +86 </option>
                </select>
                <input type="text" 
                ref={inputRef}
                minLength={10} 
                value={phoneNo} 
                onChange={(e) => {
                  setPhoneNo(e.target.value)
                 }
                } 
                inputMode='numeric'
                autoFocus={true} 
                maxLength={10} 
                className='w-38 text-white pl-1 rounded-sm outline-none font-semibold tracking-widest'/>
              </div>
              <button type='submit' className='h-[40px] font-exo2 font-semibold tracking-wider cursor-pointer bg-green-700 hover:bg-amber-700 border-1 rounded-md px-2'>Get otp</button>
            </div>
          </form>
          <p className='font-exo2 px-1 rounded-sm text-3xl'>or</p>

          <button onClick={() => handleGoogleButtonClick()} className={`${buttonClick ? 'bg-green-700' : null} hover:scale-105 transition-all hover:ease-in flex hover:border-amber-700 cursor-pointer justify-between items-center border-2 rounded-2xl py-1.5 px-2`}>
            
            <img src="/images/google.png" className='w-[20px] h-auto' alt="google" />
            <p className='font-exo2 text-xs rounded-2xl font-semibold tracking-wider px-1'>Continue with google</p>
          </button>
        </div>
        <OtpInput showOtpField={otpSent} otp={setOtp}/>
      </div>
      <PopupMessage showPopup={showOtpSentSuccessPopup} message={`Otp sent successfully to ${phoneNo}`}/>
      <PopupMessage showPopup={showPopupForEmptyInput} message='Please enter phone number' firstClass='bg-red-700' secondClass='bg-red-400'/>
      <PopupMessage showPopup={showPopupForWrongNumber} message='Please enter only digits' firstClass='bg-red-700' secondClass='bg-red-400'/>
    </div>
  )
}

export default page