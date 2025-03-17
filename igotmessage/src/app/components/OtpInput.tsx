import React, {useRef, useEffect} from 'react'

function OtpInput() {

  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

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

  return (
    <div className='flex gap-2.5'>
        {Array.from({length: 4}, (_, i) => {
          return (
            <input 
            type="text"
            maxLength={1}
            key={i} 
            ref={(element) => {
              inputRefs.current[i] = element
            }}
            className='w-[30px] pl-2 rounded-md  bg-blue-800 outline-none border-2 border-white  opacity-75'
            onInput={(e) => {
              moveNext(e.target as HTMLInputElement, i)
            }}

            onKeyDown={(e) =>{
              if (e.key === 'Backspace') {
                moveBack(e.target as HTMLInputElement, i)
              }
            }}
            />
          )
        })}
    </div>
  )
}

export default OtpInput