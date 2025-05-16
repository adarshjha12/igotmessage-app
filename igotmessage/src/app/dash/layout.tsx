import AuthGuard from '@/components/AuthGuard'
import Dashboard from '@/components/dashboard/Dashboard'
import React, { Suspense } from "react";
import Loader from "@/components/Loader";

function layout({children} : {children: React.ReactNode}) {
  return (
    <div className='w-full min-h-screen'>
      <Suspense fallback={<Loader animate={true} scaleMd={true} />} >
      <AuthGuard>
        <Dashboard>
          <div className='w-full min-h-screen flex justify-center'>
            {children}
          </div>
        </Dashboard>
      </AuthGuard>
      </Suspense>
    </div>
  )
}

export default layout