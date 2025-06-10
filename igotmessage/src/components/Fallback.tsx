import React from 'react'

function Fallback() {
  return (
    <div className='flex items-center justify-center z-50'>
        <div className='w-[20px] h-[20px] border-2 border-red-600 border-dotted animate-spin'>
        </div>
    </div>
  )
}

export default Fallback