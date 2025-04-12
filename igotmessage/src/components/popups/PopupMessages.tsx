import React from 'react'

type OtpProps = {
  showPopup?: boolean,
  message: string,
  classes?: string
}

function PopupMessages({ showPopup, message, classes}: OtpProps) {
  return (
    <div className={`${showPopup ? 'flex down-slide' : 'hidden'} ${classes} py-1 flex-col absolute top-0  gap-2.5 rounded-md bg-green-700 text-white font-semibold`}> 
        <div className=''>
            <p className='px-3'>{message}</p>
        </div>
        <hr className={` ${showPopup ? 'popup-animation' : ''} border-t-0 border-r-4 border-amber-50 bg-green-400 rounded-xs outline-none  w-0 h-1.5`} />
        {/* <button className='text-2xl cursor-pointer font-extralight'>x</button> */}
    </div>
  )
}

export default PopupMessages