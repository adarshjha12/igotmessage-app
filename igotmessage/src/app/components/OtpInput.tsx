import React, {useRef} from 'react'

function OtpInput() {
  
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const moveNext = function (current: HTMLInputElement, index: number ) {
    if (current.value.length === 1 && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  return (
    <div className='flex gap-3'>
      {
        Array.from({length: 4}, (_, i) =>{
          return (
            <input 
            key={i}
            type="text"
            ref={(el) => {inputsRef.current[i] = el}}
            onInput={(e) => moveNext(e.target as HTMLInputElement, i)}
            maxLength={1}
            className='bg-amber-400 text-black rounded-sm w-[20px]' 
            />
          )
        })
      }
    </div>
  )
}

export default OtpInput