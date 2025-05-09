import React from 'react'

function Button({text} : {text: string}) {
  return (
    <div className='border-[.1px] flex justify-center items-center p-[1px] border-white w-fit rounded-full'>
        <button className='px-1 py-0.5 text-white text-xs font-exo2 bg-gradient-to-r from-blue-600 to-blue-950 rounded-full '>
            {text}
        </button>
    </div>
  )
}

export default Button