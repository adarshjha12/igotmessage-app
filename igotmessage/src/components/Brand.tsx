import React from 'react'

interface BrandProps {
  animate?: boolean,
  scaleXs?: boolean,
  scaleSm?: boolean,
  scaleMd?: boolean,
  scaleLg?: boolean,
  color?: string
}

function Brand({animate, scaleXs, scaleSm, scaleMd, scaleLg, color} : BrandProps) {
  return (
    <div>
        <div className={`border-2 w-[60px] ${scaleSm ? `scale-75` : ''} ${scaleXs ? `scale-50` : ''} ${scaleMd ? `scale-150` : ''} ${scaleLg ? `scale-200` : ''} flex justify-center items-center h-[60px] border-${color} rounded-[16px] p-2`}>
            <div className={`w-[30px] ${animate ? 'animate-bounce' : ''} border-b-3 border-x-[1px] relative flex flex-col items-center justify-center h-[50px] rounded-sm border-2 border-${color}`}>
                <div className={`w-[12px] h-[4px] absolute left-[9px] -top-[1px] rounded-[5px] border-1  bg-${color} border-${color} `}>
                </div>
                <div className={`w-[22px] ${animate ? 'brand-animation' : ''} relative h-[15px] flex flex-col gap-0.5 justify-center items-center rounded-xs border-2 border-${color} `}>
                    <div className={`w-[14px] border-t-2 border-${color}`}></div>
                    <div className={`w-[10px] ${animate ? 'animate-spin' : ''} border-t-2 border-${color}`}></div>
                    <div className={`w-0 h-0 absolute -bottom-[8px] right-0 border-l-15 border-r-1 border-${color} border-t-8 border-l-transparent border-r-transparent `}>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Brand