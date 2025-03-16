import React, {useRef} from 'react'

function OtpInput() {
  
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const moveNext = function (userInput: HTMLInputElement, index: number ) {
    if (userInput.value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const moveBack = (userInput: HTMLInputElement, index: number) => {
    if (userInput.value.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  

  return (
    <div className='flex gap-3'>
      {
        Array.from({length: 4}, (_, i) =>{
          return (
            <input 
            key={i}
            type="text"
            ref={(el) => {
              inputRefs.current[i] = el
            }}
            onInput={(e) => moveNext(e.target as HTMLInputElement, i)}
            onKeyDown={(e) =>{
              if (e.key === 'Backspace') {
                moveBack(e.target as HTMLInputElement, i)
              }
            }}
            maxLength={1}
            className='bg-amber-400 pl-1 text-black rounded-sm w-[20px]' 
            />
          )
        })
      }
    </div>
  )
}

export default OtpInput