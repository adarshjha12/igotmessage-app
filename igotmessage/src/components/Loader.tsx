import React from 'react'
import Brand from './Brand'

function Loader() {
  return (
    <div className=' flex justify-center fixed inset-0 backdrop-blur-xs items-center bg-blue-600/5 min-w-screen min-h-screen '>
       <Brand color='white' animate={true} scaleMd={true} />
    </div>
  )
}

export default Loader