import React from 'react'

function NewLoader({color}: {color?: string}) {
  return (
    <div className="flex items-center justify-center">
      <div className={`w-8 h-8 border-4 border-${color} rotate-loader border-r-transparent rounded-full `}></div>
    </div>
  
  )
}

export default NewLoader