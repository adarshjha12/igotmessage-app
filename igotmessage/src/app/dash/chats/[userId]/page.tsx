"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import ChatUser from '@/components/dashboard/chats/ChatUser'
import dynamic from 'next/dynamic'
import NewLoader from '@/components/NewLoader'


const Chat = dynamic(
  () => import("@/components/dashboard/chats/ChatUser"),
  {
    ssr: false,
    loading: () => <div className='w-full h-screen bg-[var(--bgColor)} text-[var(--textColor)] flex justify-center items-center'>
        <NewLoader/>
    </div>,
  }
);

function page() {
    const params = useParams()
    const userId = params.userId as string
  return (
    <Chat/>
  )
}

export default page