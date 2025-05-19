'use client'
import React, {useState, useRef, useEffect} from 'react'
import OtpInput from './OtpInput'
import PopupMessage from '@/components/popups/PopupMessages'
import { sendOtp } from '@/utils/api'
import Loader from '@/components/Loader'
import { useSearchParams } from 'next/navigation'
import Brand from './Brand'


function Login() {

    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [googleButtonClick, setGoogleButtonClick] = useState(false)
    const [emailButtonClick, setEmailButtonClick] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [showOtpSentSuccessPopup, setShowOtpSentSuccessPopup] = useState(false)
    const [unauthorized, setUnauthorized] = useState(false)
    const [inputFocus, setInputFocus] = useState(false)
    
    const inputRef = useRef<HTMLInputElement>(null)
    let [email, setEmail] = useState('')
    const [errorSendingEmail, setErrorSendingEmail] = useState(false)  

    const [showPopupForEmptyInput, setShowPopupForEmptyInput] = useState(false)
    let [resendTimer, setResendTimer] = useState(30)
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
    
        console.log('Prod URL:', process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL);
        console.log('Local URL:', process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL);

       const googleAuthUrl = process.env.NODE_ENV === 'production' 
       ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/google/auth/google`
       : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/google/auth/google`
    
       console.log('Full Google Auth URL:', googleAuthUrl);

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
          setResendTimer(30)
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
  <div key={`${emailButtonClick} ${otpSent} `} className='w-full min-h-screen text-[var(--textColor)] flex items-center justify-center flex-col bg-gradient-to-r from-[var(--bgColor)]  to-[var(--inputBg)]'>
    <div  key={`${emailButtonClick} ${otpSent} `} className={`${otpSent ? 'right-slide' : 'left-slide'} ${emailButtonClick ? 'test-slide' : ''} m-3 w-[90%] min-h-[90%] sm:h-full sm:min-w-[70%] border-1 py-12 px-2 border-[var(--borderColor)] rounded-xl flex flex-col justify-center items-center gap-10`}>

    <div className='flex flex-col items-center'>
      {/* <img src="/images/logo.png" className='w-[60px] h-auto rounded-2xl' alt="" /> */}
      <Brand color='var(--textColor)'/>
      <p className={` text-6xl font-medium font-montez h-fit hover:scale-125 transition-all hover:ease-in my-2`}>IGotMessage</p>
      <p className='capitalize text-2xl font-semibold font-montez text-yellow-600'>the social app</p>
    </div>
    <hr className='w-[100px] text-[var(--textColor)]'/>
    { emailButtonClick ? '' : <p className={`${otpSent ? 'hidden' : ''} text-center mb-2`}> Choose one of the options below to experience something very cool</p>
    }
    <div className={` ${otpSent ? 'hidden' : null} flex flex-col items-center justify-center gap-4`}>
    

      <button onClick={() => handleGoogleButtonClick()} className={`${googleButtonClick ? 'bg-green-700' : null} ${emailButtonClick ? 'hidden' : ''} hover:scale-105 transition-all hover:ease-in flex hover:border-yellow-400 cursor-pointer justify-center items-center border-2 border-[var(--borderColor)]-400 rounded-3xl py-0.5 px-2`}>
        
        <img src="/images/google.png" className='w-[20px] h-auto' alt="google" />
        <p className='text-xl rounded-2xl font-semibold px-1'>Continue with google</p>
      </button>

      <p className={`text-2xl ${emailButtonClick ? 'hidden' : ''}`}>or</p>
      {emailButtonClick && <form action="" className='flex flex-col gap-1 items-center'>
        <div className=''>
         
          <div className=' w-full grid grid-cols-1 sm:[grid-template-columns:2fr_1fr]  gap-4 justify-center items-center'>
            <div className='border-1 relative w-full flex items-center border-[var(--borderColor)] py-1 rounded-md'>
              <label htmlFor="email" className={` ${inputFocus ? '-translate-y-8  -translate-x-7 scale-90' : ' animate-pulse font-semibold'}  text-left transform transition-all cursor-text duration-300 ease-linear absolute top-1 left-5 font-exo2 text-[var(--textColor)] pb-2.5 text-md`} >*Please enter your email</label>
              <input type="email" 
              ref={inputRef}
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value)
              }
              } 
              id='email'
              name='email'
              autoComplete='email'
              onFocus={() => setInputFocus(true)}
              placeholder={inputFocus ? 'eg- abc@gmail.com' : ''}
              inputMode='email'
              className=' text-[var(--textColor)] pl-2 w-fit rounded-sm outline-none font-semibold tracking-widest placeholder:text-xs'/>
            </div>
            <button type='button' onClick={handleSendOtp} className=' text-white font-exo2 font-semibold tracking-wider cursor-pointer bg-gradient-to-r from-green-600 to-black hover:bg-gradient-to-r hover:from-red-500 hover:to-black border-1 rounded-full px-2 py-1'>Get otp</button>
            
          </div>
        </div>
      </form>
      }
      
      <button onClick={() => handleEmailButtonClick()} className={`${emailButtonClick ? 'hidden' : null} hover:scale-105 transition-all hover:ease-in flex hover:border-yellow-400  gap-4 cursor-pointer justify-center items-center border-2 border-[var(--borderColor)] rounded-3xl py-0.5 px-3`}>
        
        <img src="/images/gmail.png" className='w-[20px] h-auto' alt="google" />
        <p className=' text-xl rounded-2xl font-semibold px-1'>Verify with email</p>
      </button>
      
    </div>
    <OtpInput showOtpField={otpSent} email={email} resendCounter={resendTimer} setResendOtp={setResendOtp} canResend={canResend} />
  </div>
  <PopupMessage showPopup={showOtpSentSuccessPopup} message={`Otp sent successfully to ${email}`} success={true} />

  <PopupMessage showPopup={showPopupForEmptyInput} message='Please enter email address' success={false} />

  <PopupMessage showPopup={errorSendingEmail} message={`${email} is invalid`} success={false} />

  <PopupMessage showPopup={unauthorized} message={`you are unauthorized. please select option below to continue`} success={false} />
  
  <div id="recaptcha-container"></div>
  {loading && <Loader animate={true} color='white' scaleMd={true} />}
  
</div>
  )
}

export default Login