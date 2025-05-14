import React from 'react'
import Brand from './Brand'

interface LoaderProps {
  color? : string | undefined,
  animate?: boolean,
  scaleSm? : boolean
  scaleMd? : boolean
  scaleLg? : boolean
}

function Loader({color, animate, scaleSm, scaleMd, scaleLg} : LoaderProps) {
  return (
    <div className=' flex justify-center fixed inset-0 backdrop-blur-xs items-center bg-blue-600/5 min-w-screen min-h-screen '>
       <Brand color={color} animate={animate} scaleSm={scaleSm} scaleMd={scaleMd} scaleLg={scaleLg} />
    </div>
  )
}

export default Loader