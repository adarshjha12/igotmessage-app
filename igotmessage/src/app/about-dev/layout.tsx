import Loader from '@/components/Loader'
import React, {ReactNode} from 'react'
import { Suspense } from 'react'

function layout({children} : {children: ReactNode}) {
  return (
    <Suspense fallback={<Loader animate={true} scaleMd={true} color='black' />} >
        {children}
    </Suspense>
  )
}

export default layout