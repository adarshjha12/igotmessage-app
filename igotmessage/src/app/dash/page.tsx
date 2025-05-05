'use client'
import { Camera, PhoneCallIcon, Icon } from "lucide-react";
import { coconut, batBall } from '@lucide/lab';
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";


import React from 'react'

function Page() {
  const authStatus = useSelector( (state: RootState) => state.auth.authenticated)

  console.log(authStatus);
  
  return (
    <div className="min-w-screen min-h-screen bg-white">
      dk
    </div>
  )
}

// <Camera size={48} fill="yellow" strokeWidth="2"  className="text-blue-600"/>
//    <PhoneCallIcon size={30} className="text-blue-600"/>

export default Page