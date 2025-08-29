import AuthGuard from '@/components/AuthGuard'
import Dashboard from '@/components/dashboard/Dashboard'
import React from "react";

function layout({children} : {children: React.ReactNode}) {
  return (
    <div className='w-full min-h-screen'>
      <AuthGuard>
        <Dashboard>
          <div className='w-full h-full flex justify-center'>
            {children}
          </div>
        </Dashboard>
      </AuthGuard>
    </div>
  )
}

export default layout