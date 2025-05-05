import React from 'react'

type OtpProps = {
  showPopup?: boolean,
  message?: string,
  firstClass?: string,
  secondClass?: string
}

function PopupMessages({ showPopup, message, firstClass, secondClass}: OtpProps) {
  return (
    <div className={`${showPopup ? 'flex down-slide' : 'hidden'} absolute top-0 border-3 ${firstClass ? 'border-red-700' : 'border-green-700' } rounded-md `}>
      <div className={`${showPopup ? 'flex down-slide' : 'hidden'}  py-1 flex-col   gap-2.5 rounded-md ${firstClass ? firstClass : 'bg-green-700'}  text-white font-semibold m-0.5`}> 
        <div className=''>
            <p className='px-3'>{message}</p>
        </div>
        <hr className={` ${showPopup ? 'popup-animation' : ''} border-t-0 border-r-4 border-amber-50 ${secondClass ? secondClass : 'bg-green-400'}  rounded-xs outline-none  w-0 h-1`} />
      </div>
    </div>
  )
}

export default PopupMessages