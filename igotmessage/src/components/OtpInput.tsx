'use client'
import React, { useEffect, useRef, useState} from 'react'
import { verifyOtp } from '@/utils/api'
import { useRouter } from 'next/navigation'
import PopupMessages from './popups/PopupMessages'
import Loader from './Loader'
import { useDispatch } from 'react-redux'
import { addCurrentUserToStore } from '@/features/authSlice'

interface otpInputProps {
  showOtpField: boolean,
  email: string,
  resendCounter: number,
  canResend: boolean,
  setResendOtp: (value: boolean) => void
}

const OtpInput = ({showOtpField, email, resendCounter, canResend, setResendOtp} : otpInputProps) => {

  const router = useRouter()
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [inputValues, setInputValues] = useState<string[]>(['', '', '', ''])
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpExpired, setOtpExpired] = useState(false)
  
  let finalInputOtp: string;

  useEffect(() => {
     finalInputOtp = inputValues.join('')
     console.log(finalInputOtp);
    
  }, [inputValues]);

  const moveNext = function (userInput: HTMLInputElement, index: number) {
    if (userInput.value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }
  const moveBack = function (userInput: HTMLInputElement, index: number) {
    if (userInput.value.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }  

  const handlePaste  = function (e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').trim()
    setInputValues(pasteData.split(''))

    if (pasteData.length === inputRefs.current.length) {
      pasteData.split('').forEach((char: string, index: number) =>{
        if (inputRefs.current[index]) {
          inputRefs.current[index]!.value = char
        }
      })
      inputRefs.current[inputRefs.current.length - 1]?.focus()
    }
  }

  useEffect(() => {
    if (showOtpField) {
      inputRefs.current[0]?.focus()
    }
    console.log(email);
    
  }, [showOtpField])

  const handleSignin = async function () {
    setLoading(true);
    try {
      const response = await verifyOtp(email, finalInputOtp);
      console.log(response);
  
      if (response.data?.success === true) {
        setShowSuccessPopup(true);
        const dispatch = useDispatch()
        dispatch(addCurrentUserToStore(response.data.user))
        router.push('/dash');
        
      } else if (response.data.expired === true) {
          setShowErrorPopup(true)
          setOtpExpired(true)
      } else {
        window.location.reload()
        router.push('/login');
        setShowErrorPopup(true)
      }
    } catch (error) {
      console.log(error);
      window.location.reload()
      router.push('/login'); 
      setShowErrorPopup(true)

    } finally {
      setLoading(false);
      setTimeout(() => {
        setShowSuccessPopup(false);
        setShowErrorPopup(false)
        setOtpExpired(false)
      }, 5000);
    }
  };
  
  
  return (
    <div className={`${showOtpField ? 'flex': 'hidden'} flex-col items-center gap-3 justify-center`}>
      <p className='font-exo2'>please enter 4 digit otp</p>
      <form action='' className='flex flex-col gap-4.5 justify-center items-center'>
        <div className='flex gap-1.5 '>
          {Array.from({length: 4}, (_, i) => {
            return (
              <div key={i}>
                <input 
                  type="text"
                  maxLength={1}
                  required={true}
                  key={i} 
                  ref={(element) => {
                    inputRefs.current[i] = element
                  }}
                  onChange={(e) => {
                    const newInputValues = [...inputValues]
                    newInputValues[i] = e.target.value
                    setInputValues(newInputValues)
                  }}
                  className='w-[30px] pl-2 rounded-md font-bold text-white bg-blue-800 outline-none border-2 border-white  opacity-75'
                  onInput={(e) => {
                    moveNext(e.target as HTMLInputElement, i)
                  }}

                  onKeyDown={(e) =>{
                    if (e.key === 'Backspace') {
                      moveBack(e.target as HTMLInputElement, i)
                    }
                  }}
                  onPaste={handlePaste}
                />
                <span className={` ${i === 3 ? 'hidden': ''} ml-1`}>-</span>
              </div>
              
            )
          })}
        </div>
      <div className='flex gap-5'>
       <button onClick={handleSignin} type='button' className='h-[40px] text-white font-exo2 font-semibold tracking-wider cursor-pointer bg-gradient-to-r from-blue-600 to-blue-900 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-800 border-1 rounded-md px-2'> Sign in</button>

        <div className='flex flex-col  justify-center items-center'>
          <button onClick={() => {setResendOtp(true), console.log('button clicked');
          }} disabled={canResend ? false : true} className={`px-2 text-xs font-medium border-1 py-1 mt-1 mb-0.5 cursor-pointer hover:bg-gradient-to-r hover:from-red-500 hover:to-red-900 ${canResend ? 'bg-gradient-to-r from-green-600 to-green-900' : 'border-red-500'} rounded-sm`}>Resend</button>

          <span className='text-xs'>00 : {resendCounter}</span>
        </div>
      </div>
     </form>
     {showSuccessPopup && <PopupMessages showPopup={true} message='congrats! verification successfull'/>}
     {loading && <Loader/>}
     {showErrorPopup && <PopupMessages showPopup={true}  message='invalid credentials. please login again' firstClass='bg-red-700' secondClass='bg-red-400'/> }
     {otpExpired && <PopupMessages showPopup={true}  message='otp expired. click on resend' firstClass='bg-red-700' secondClass='bg-red-400'/>}
    </div>
  )
}

export default OtpInput