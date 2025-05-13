import React from 'react'

type OtpProps = {
  showPopup?: boolean,
  message?: string,
  success?: boolean
}

function PopupMessages({ showPopup, message, success}: OtpProps) {
  return (
    <div className={`${showPopup ? 'flex down-slide' : 'hidden'} max-w-[80%]  justify-center h-auto items-center absolute top-0 border-3 ${success ? 'border-green-700' : 'border-red-700' } rounded-md `}>
      <div className={`${showPopup ? 'flex down-slide' : 'hidden'} max-w-full py-1 flex-col h-auto gap-2.5 rounded-md ${success ? 'bg-gradient-to-tr from-black to-green-600' : 'bg-gradient-to-tr from-black to-red-600'}  text-white font-semibold m-0.5`}> 
        <div className='w-full flex justify-center text-center'>
            <p className='px-3 max-w-full h-auto font-exo2 tracking-widest text-sm'>{message}</p>
        </div>
        <hr className={` ${showPopup ? 'popup-animation' : ''} border-t-0 border-r-4 border-amber-50 ${success ? 'bg-green-500' : 'bg-red-500'}  rounded-xs outline-none w-0 h-1`} />
      </div>
    </div>
  )
}

export default PopupMessages