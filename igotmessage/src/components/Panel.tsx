import React from 'react'

function Panel({menuClick} : {menuClick: boolean}) {
  return (
    <div className={`${menuClick ? 'flex panel-slide': 'hidden'} transform transition-transform duration-300 ease-in-out right-0 absolute w-[90%] h-full bg-amber-400`}> 
        <div>
            <p>Dark mode </p>
            
        </div>
    </div>
  )
}

export default Panel