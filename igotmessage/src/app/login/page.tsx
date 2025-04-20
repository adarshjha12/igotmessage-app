'use client'
import React, {useState, useRef} from 'react'
import OtpInput from '../../components/OtpInput'
import PopupMessage from '@/components/popups/PopupMessages'

function Page() {

  const [googleButtonClick, setGoogleButtonClick] = useState(false)
  const [emailButtonClick, setEmailButtonClick] = useState(false)
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
    setGoogleButtonClick(true)
  }

  const handleEmailButtonClick = function () {
    setEmailButtonClick(true)
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
    <div className='w-full text-white down-slide min-h-screen flex items-center justify-center flex-col bg-gradient-to-r from-black to-blue-600'>
        <div  key={`${emailButtonClick} ${otpSent} `} className={`${otpSent ? 'right-slide' : ''} ${emailButtonClick ? 'test-slide' : ''} border-1 p-6 border-white rounded-xl flex flex-col items-center gap-10`}>

        <div className='flex flex-col items-center'>
          <img src="/images/logo.png" className='w-[60px] h-auto rounded-2xl' alt="" />
          <p className={` text-5xl font-montez h-fit hover:scale-125 transition-all hover:ease-in mb-2`}>Igotmessage</p>
          <p className='capitalize font-montez'>the social app</p>
        </div>
        <hr className='w-[100px] text-white'/>
        { emailButtonClick ? '' : <p className=' text-center mb-2'> Choose one of the options below to experience something very cool</p>
        }
        <div className={` ${otpSent ? 'hidden' : null} flex flex-col items-center justify-center gap-4`}>
        

          <button onClick={() => handleGoogleButtonClick()} className={`${googleButtonClick ? 'bg-green-700' : null} ${emailButtonClick ? 'hidden' : ''} hover:scale-105 transition-all hover:ease-in flex hover:border-amber-700 cursor-pointer justify-center items-center border-2 border-white-400 rounded-3xl py-0.5 px-2`}>
            
            <img src="/images/google.png" className='w-[20px] h-auto' alt="google" />
            <p className='text-xl rounded-2xl font-semibold px-1'>Continue with google</p>
          </button>

          <p className={`text-2xl ${emailButtonClick ? 'hidden' : ''}`}>or</p>
          {emailButtonClick && <form action="" onSubmit={handleSubmit} className='flex flex-col gap-1 items-center'>
            <label htmlFor="" className=' font-exo2 pb-2.5'>Please enter your email</label>
            <div className='grid grid-cols-[2fr_1fr] gap-1 place-items-center'>
              <div className='border-1 w-full flex justify-center items-center border-white h-[40px] rounded-md'>
                
                <input type="email" 
                ref={inputRef}
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value)
                 }
                } 
                placeholder='abc@gmail.com'
                inputMode='email'
                autoFocus={true} 
                className=' text-white w-full pl-2 rounded-sm outline-none font-semibold tracking-widest'/>
              </div>
              <button type='submit' className='h-full text-white font-exo2 font-semibold tracking-wider cursor-pointer bg-green-700 hover:bg-amber-700 border-1 rounded-md px-2'>Get otp</button>
              
            </div>
          </form>
          }
          
          <button onClick={() => handleEmailButtonClick()} className={`${emailButtonClick ? 'hidden' : null} hover:scale-105 transition-all hover:ease-in flex hover:border-amber-700  gap-4 cursor-pointer justify-center items-center border-2 border-white rounded-3xl py-0.5 px-3`}>
            
            <img src="/images/gmail.png" className='w-[20px] h-auto' alt="google" />
            <p className=' text-xl rounded-2xl font-semibold px-1'>Verify with email</p>
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