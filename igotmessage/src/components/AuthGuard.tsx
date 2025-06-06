'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCurrentUserToStore, setAuthStatus } from "@/features/authSlice";
import { checkAuth } from "@/utils/api";
import Loader from "./Loader";
import SplashScreen from "./SplashScreen";

function AuthGuard({children} : {children: React.ReactNode}) {
    const router = useRouter()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [verified, setVerified] = useState(false)

    useEffect( () => {
      async function getAuthDetails() {
        setLoading(true)
        try {
          const response = await checkAuth()
          if (response.data?.success === true) {
            dispatch(addCurrentUserToStore(response.data.userData))
            dispatch(setAuthStatus(true))
            console.log('user verified successfully');
            setVerified(true)
            
          }
    
        } catch (error) {
          router.replace('/login?error=unauthorized')
          console.log(error);
          throw error
          
        } finally{
          setLoading(false)
          
        }
      }
        
      getAuthDetails()
      
    }, [router]);

    if (!verified) {
      return null
    }

    if (loading) {
      return <SplashScreen />
    }

  return (
    <div className="w-full min-h-screen">
        {children}        
    </div>
  )
}

export default AuthGuard