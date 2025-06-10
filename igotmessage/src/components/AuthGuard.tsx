'use client'
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCurrentUserToStore, setAuthStatus } from "@/features/authSlice";
import { checkAuth } from "@/utils/api";
import Loader from "./Loader";
import SplashScreen from "./SplashScreen";

function AuthGuard({children} : {children: React.ReactNode}) {
    const router = useRouter()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [verified, setVerified] = useState(false)
    const pathname = usePathname()

    useEffect( () => {
      async function getAuthDetails() {
        setLoading(true)
        try {
          const response = await checkAuth()
          if (response.data?.success === true) {
            dispatch(addCurrentUserToStore(response.data.userData))
            dispatch(setAuthStatus(true))
            console.log('user verified successfully');
            if (pathname.startsWith('/dash')) {
              setVerified(true)
              setLoading(false)
            } else {
              setTimeout(() => {
                setVerified(true)
                setLoading(false)
              }, 2000);
            }
          }
    
        } catch (error) {
          setTimeout(() => {
            router.replace('/login?error=unauthorized')
            setLoading(false)
          }, 2000);
          console.log(error);
          throw error
          
        } 
      }
        
      getAuthDetails()
      
    }, [router]);

    if (loading && !pathname.startsWith('/dash')) {
      return <SplashScreen />
    }

  return (
    <div className="w-full min-h-screen">
        {children}        
    </div>
  )
}

export default AuthGuard