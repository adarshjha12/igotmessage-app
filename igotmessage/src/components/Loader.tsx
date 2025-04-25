import React from 'react'

function Loader() {
  return (
    <div className=' flex justify-center fixed inset-0 backdrop-blur-xs items-center bg-blue-600/5 min-w-screen min-h-screen '>
        <div className='w-[100px] h-[100px] rotate-slide z-30 rounded-full border-8 border-t-8 border-t-transparent border-r-transparent border-white'></div>
    </div>
  )
}

export default Loader