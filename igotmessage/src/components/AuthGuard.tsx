'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCurrentUserToStore } from "@/features/authSlice";
import { checkAuth } from "@/utils/api";
import Loader from "./Loader";

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
            console.log('user verified successfully');
            setVerified(true)
          } else{
            router.replace('/login')
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
      return <Loader/>
    }

  return (
    <div>
        {children}        
    </div>
  )
}

export default AuthGuard