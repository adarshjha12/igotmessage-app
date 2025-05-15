import AuthGuard from '@/components/AuthGuard'
import Dashboard from '@/components/dashboard/Dashboard'
import React from 'react'

function layout({children} : {children: React.ReactNode}) {
  return (
    <div>
      <AuthGuard>
        <Dashboard>
          {children}
        </Dashboard>
      </AuthGuard>
    </div>
  )
}

export default layout