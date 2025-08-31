"use client"
import React from 'react'
import dynamic from 'next/dynamic'
import NewLoader from '@/components/NewLoader';

const OptimizedCreatePageComponent = dynamic(() => import("@/components/dashboard/create/CreatePageComponent"), {
  ssr: false,
  loading: () => <div className='flex items-center justify-center h-screen w-full bg-[var(--bgColor)]'>
    <NewLoader color='[var(--textColor)]'/>
  </div>
});

function Page() {
  return <OptimizedCreatePageComponent/>
}

export default Page