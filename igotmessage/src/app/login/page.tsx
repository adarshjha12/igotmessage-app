'use client'
import React, {useState, useRef, useEffect} from 'react'
import OtpInput from '../../components/OtpInput'
import PopupMessage from '@/components/popups/PopupMessages'
import { sendOtp, verifyOtp } from '@/utils/api'
import Loader from '@/components/Loader'
import { useSearchParams } from 'next/navigation'
import { emit } from 'process'

function Page() {
  
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [googleButtonClick, setGoogleButtonClick] = useState(false)
  const [emailButtonClick, setEmailButtonClick] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [showOtpSentSuccessPopup, setShowOtpSentSuccessPopup] = useState(false)
  const [unauthorized, setUnauthorized] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  let [email, setEmail] = useState('')
  const [errorSendingEmail, setErrorSendingEmail] = useState(false)  

  const [showPopupForEmptyInput, setShowPopupForEmptyInput] = useState(false)
  let [resendTimer, setResendTimer] = useState(59)
  const [canResend, setCanResend] = useState(false)
  const [resendOtp, setResendOtp] = useState(false)

  const timer = function () {
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { 
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        setCanResend(false)
        return prev - 1;
      });
    }, 1000);
  }
  

  const handleGoogleButtonClick = function () {
    setGoogleButtonClick(true)

   const googleAuthUrl = process.env.NODE_ENV === 'production' 
   ? `${process.env.PRODUCTION_BACKEND_URL}/api/google/auth/google`
   : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/google/auth/google`

   window.location.href = googleAuthUrl
  }

  const handleEmailButtonClick = function () {
    setEmailButtonClick(true)
  }

  const handleSendOtp = async function () {
    if (!email) {
      setShowPopupForEmptyInput(true)
      inputRef.current?.focus()

      setTimeout(() => {
        setShowPopupForEmptyInput(false)
      }, 5000);
      return
    }
    
    setLoading(true)
    try {
      const response = await sendOtp(email)
      console.log(response);
    
      if (response?.data.success === true) {
        timer()
        setOtpSent(true)
        setShowOtpSentSuccessPopup(true)
        setTimeout(() => {
          setShowOtpSentSuccessPopup(false)
        }, 5000);
      }      

    } catch (error) {
      setErrorSendingEmail(true)
      console.log(error);
      
    } finally{
        setLoading(false)
        setTimeout(() => {
          setErrorSendingEmail(false)
        }, 5000);
    }

  }

  useEffect(() => {
    if (canResend && resendOtp) {
      handleSendOtp()
      setResendTimer(59)
      setResendOtp(false)
    }
    
  }, [canResend, resendOtp]);

  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'unauthorized') {
      setUnauthorized(true)
    }
      setTimeout(() => {
        setUnauthorized(false)
      }, 5000);
  }, [searchParams]);

  return (
    <div key={`${emailButtonClick} ${otpSent} `} className=' text-white down-slide min-h-screen bg-gradient-to-r from-black to-blue-600 px-6 gap-16'>
        
      <div className='flex justify-center items-center'>
          <div className='flex flex-col items-center justify-center gap-0.5 mt-4'>
            <div className='flex hover:scale-125 transition-all hover:ease-in items-center justify-center gap-3.5'>
              <img src="/images/logo.png" className='w-[40px] h-full rounded-md' alt="" />
              <p className={` text-3xl relative top-1 font-montez h-fit  mb-2`}>Igotmessage</p>
            </div>
            <p className='capitalize text-sm font-montez text-yellow-400'>the social app</p>
          </div>
      </div>

      <div className='flex flex-col justify-center items-center gap-12 mt-4.5'>
        
        <div className='w-fit h-fit transform transition-all duration-200 ease-linear test-slide'>
          <div  key={`${emailButtonClick} ${otpSent} `} className={`${otpSent ? 'right-slide' : ''} ${emailButtonClick ? 'test-slide' : ''} w-full h-full border-1 p-6 border-white rounded-xl flex flex-col items-center gap-10`}>

          { emailButtonClick ? '' : <p className={`${otpSent ? 'hidden' : ''} text-center mb-2`}> Choose one of the options below to experience something very cool</p>
          }
          <div className={` ${otpSent ? 'hidden' : null} flex flex-col items-center justify-center gap-4`}>


            <button onClick={() => handleGoogleButtonClick()} className={`${googleButtonClick ? 'bg-green-700' : null} ${emailButtonClick ? 'hidden' : ''} hover:scale-105 transition-all hover:ease-in flex hover:border-yellow-400 cursor-pointer justify-center items-center border-2 border-white-400 rounded-3xl py-0.5 px-2`}>
              
              <img src="/images/google.png" className='w-[20px] h-auto' alt="google" />
              <p className='text-xl rounded-2xl font-semibold px-1'>Continue with google</p>
            </button>

            <p className={`text-2xl ${emailButtonClick ? 'hidden' : ''}`}>or</p>
            {emailButtonClick && <form action="" className='flex flex-col gap-1 items-start'>
              <label htmlFor="email" className={`${emailFocus ? '-translate-y-8 scale-90' : ''} transform transition-all ease-in relative top-10 left-4 font-exo2 pb-2.5 text-sm cursor-text ${emailFocus ? 'text-white' : ' animate-pulse text-red-400'}`}>*Please enter your email</label>
              <div className='flex flex-wrap gap-4 justify-center items-center'>
                <div className='border-1 w-fit flex justify-center items-center border-white py-1 rounded-md'>
                  
                  <input type="email" 
                  ref={inputRef}
                  value={email} 
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }
                  } 
                  placeholder={emailFocus ? 'Eg- abc@gmail.com' : ''}
                  // autoComplete='email'
                  // name='email'
                  id='email'
                  onFocus={() => setEmailFocus(true)}
                  inputMode='email'
                  className=' text-white w-full pl-2 rounded-sm outline-none font-semibold tracking-widest placeholder:text-xs placeholder:pl-3'/>
                </div>
                <button type='button' onClick={handleSendOtp} className=' text-white font-exo2 font-semibold tracking-wider cursor-pointer bg-gradient-to-r from-green-600 to-green-900 hover:bg-gradient-to-r hover:from-red-500 hover:to-black border-1 rounded-full px-2 py-1'>Get otp</button>
                
              </div>
            </form>
            }
            
            <button onClick={() => handleEmailButtonClick()} className={`${emailButtonClick ? 'hidden' : null} hover:scale-105 transition-all hover:ease-in flex hover:border-yellow-400  gap-4 cursor-pointer justify-center items-center border-2 border-white rounded-3xl py-0.5 px-3`}>
              
              <img src="/images/gmail.png" className='w-[20px] h-auto' alt="google" />
              <p className=' text-xl rounded-2xl font-semibold px-1'>Verify with email</p>
            </button>
            
          </div>
          <OtpInput showOtpField={otpSent} email={email} resendCounter={resendTimer} setResendOtp={setResendOtp} canResend={canResend} />
          </div>
          
        </div>
          <PopupMessage showPopup={showOtpSentSuccessPopup} message={`Otp sent successfully to ${email}`}/>

          <PopupMessage showPopup={showPopupForEmptyInput} message='Please enter email address' firstClass='bg-red-700' secondClass='bg-red-400'/>

          <PopupMessage showPopup={errorSendingEmail} message={`${email} is invalid`} firstClass='bg-red-700' secondClass='bg-red-400'/>

          <PopupMessage showPopup={unauthorized} message={`you are unauthorized. please select option below to continue`} firstClass='bg-red-700' secondClass='bg-red-400'/>

          <div id="recaptcha-container"></div>
          {loading && <Loader/>}
      </div>
      <div className='transform transition-all mb-3 duration-200 ease-linear right-slide w-full h-auto flex flex-col justify-center items-center'>
           <div className=' rounded-3xl border-1 flex justify-center items-center border-white p-2'>
              <img src="/images/people.png" alt="" className=' rounded-3xl w-full max-w-[700px] h-auto hover:scale-110 transition-all hover:ease-in' />
           </div>
           <div  className="shadow-md p-3 bg-gradient-to-r from-black via-yellow-500 to-black border-1 border-white rounded-md bg-blue-600 flex flex-col justify-center items-center mt-9 mb-[100px] ">
              <h2 className="text-2xl p-2 bg-gradient-to-r from-black to-blue-600 rounded-3xl font-semibold text-center font-montez tracking-widest  mb-4 hover:scale-125  transition-all hover:ease-in">Welcome to Igotmessage</h2>
              <p className="text-white text-center p-3 rounded-md bg-gradient-to-r from-black to-blue-600 font-exo2 text-xs leading-relaxed">
                Igotmessage is a next-generation social media app that brings people closer than ever before. Share your moments in real-time with dynamic stories, express yourself through customizable posts and statuses, or stay in touch face-to-face with smooth, high-quality video calls. Whether you're capturing daily highlights, chatting with friends, or building your online presence, Igotmessage gives you all the tools you need in one sleek, intuitive platform.
              </p>
            </div>

        </div>
        <div className='bg-gray-700 font-exo2 fixed bottom-0 min-w-screen h-[30px] flex justify-center flex-wrap items-center text-white text-[12px] '>
          <ul className='min-w-screen flex justify-evenly text-center'>
            <li className='flex gap-1'>&copy; <p className='text-yellow-300 font-semibold'>adarsh </p> devs public project </li>
            <li>contact- jhaa50872@gmail.com</li>
            <li className='flex gap-2'>developed with ❤️ by <p className='text-green-400 font-semibold cursor-pointer'>adarsh </p> </li>
            
          </ul>
        </div>
    </div>
  )
}

export default Page