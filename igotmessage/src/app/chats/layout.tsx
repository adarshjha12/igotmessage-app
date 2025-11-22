import AuthGuard from '@/components/AuthGuard'
import React from "react";

function layout({children} : {children: React.ReactNode}) {
  return (
    <div className='w-full min-h-screen'>
      {/* <AuthGuard> */}
          <div className='w-full h-full flex justify-center'>
            {children}
          </div>
      {/* </AuthGuard> */}
    </div>
  )
}

export default layout