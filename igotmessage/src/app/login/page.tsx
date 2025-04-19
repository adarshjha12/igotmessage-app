'use client'
import React, {useState, useRef} from 'react'
import OtpInput from '../../components/OtpInput'
import PopupMessage from '@/components/popups/PopupMessages'

function Page() {

  const [buttonClick, setButtonClick] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [showOtpSentSuccessPopup, setShowOtpSentSuccessPopup] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')  
  const [otp, setOtp] = useState('')
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [showPopupForEmptyInput, setShowPopupForEmptyInput] = useState(false)
  const [showPopupForWrongNumber, setShowPopupForWrongNumber] = useState(false)
  // const testInput = /^\d+$/.test(email)


  
// useEffect(() => {
//   if (testInput) {
//     console.log('nicely going');    
    
//   } else if(email.length > 0 && !testInput){
//     console.log('stop that shit');
//     setShowPopupForWrongNumber(true)
  
//     setTimeout(() => {
//       setShowPopupForWrongNumber(false)
//     }, 5000);
//   }
// }, [email, testInput]);

  const handleGoogleButtonClick = function () {
    window.location.href = "https://igotmessage-app-backend.onrender.com/google/auth/google";
    setButtonClick(true)
  }

  const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (!email) {
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
            <label htmlFor="" className=' font-exo2 text-xs pb-2.5'>Please continue with your email</label>
            <div className='grid grid-cols-[2fr_1fr] gap-3 place-items-center'>
              <div className='border-1 w-full flex justify-center items-center border-white h-[40px] rounded-md'>
                
                <input type="text" 
                ref={inputRef}
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value)
                 }
                } 
                placeholder='abc@gmail.com'
                inputMode='text'
                autoFocus={true} 
                className=' text-white w-full pl-2 rounded-sm outline-none font-semibold tracking-widest'/>
              </div>
              <button type='submit' className='h-full text-white text-xs font-exo2 font-semibold tracking-wider cursor-pointer bg-green-700 hover:bg-amber-700 border-1 rounded-md px-2'>Verify with email</button>
              
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
      <PopupMessage showPopup={showOtpSentSuccessPopup} message={`Otp sent successfully to ${email}`}/>
      <PopupMessage showPopup={showPopupForEmptyInput} message='Please enter email address' firstClass='bg-red-700' secondClass='bg-red-400'/>
      <PopupMessage showPopup={showPopupForWrongNumber} message='Please enter only digits' firstClass='bg-red-700' secondClass='bg-red-400'/>

      <div id="recaptcha-container"></div>
    </div>
  )
}

export default Page