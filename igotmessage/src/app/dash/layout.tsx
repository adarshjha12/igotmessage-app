import AuthGuard from '@/components/AuthGuard'
import React from 'react'

function layout({children} : {children: React.ReactNode}) {
  return (
    <div>
        <AuthGuard>
            {children}
        </AuthGuard>
    </div>
  )
}

export default layout