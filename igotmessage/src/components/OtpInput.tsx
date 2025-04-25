'use client'
import React, { useEffect, useRef, useState} from 'react'
import { verifyOtp } from '@/utils/api'
import { useRouter } from 'next/navigation'
import PopupMessages from './popups/PopupMessages'

interface otpInputProps {
  showOtpField: boolean,
  // otp: (value : string) => void,
  email: string
}

const OtpInput = ({showOtpField, email} : otpInputProps) => {
  const router = useRouter()
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [inputValues, setInputValues] = useState<string[]>(['', '', '', ''])
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

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
    try {
      const response = await verifyOtp(email, finalInputOtp)
      console.log(response);
      if (response.data?.success === true) {
        setShowSuccessPopup(true)
        router.push('/dash')
        setTimeout(() => {
          setShowSuccessPopup(false)
        }, 5000);
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  
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
        <button onClick={handleSignin} type='button' className='h-[40px] text-white font-exo2 font-semibold tracking-wider cursor-pointer bg-green-700 hover:bg-amber-700 border-1 rounded-md px-2'> Sign in</button>
     </form>
     {showSuccessPopup && <PopupMessages showPopup={true} message='congrats! verification successfull'/>}
    </div>
  )
}

export default OtpInput