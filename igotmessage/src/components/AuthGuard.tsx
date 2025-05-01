'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCurrentUserToStore } from "@/features/authSlice";
import { checkAuth } from "@/utils/api";
import Loader from "./Loader";
import PopupMessages from "./popups/PopupMessages";

function AuthGuard({children} : {children: React.ReactNode}) {
    const router = useRouter()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorPopup, setErrorPopup] = useState(false)

    useEffect( () => {
      async function getAuthDetails() {
        try {
          setLoading(true)
          const response = await checkAuth()
          if (response.data?.success === true) {
            dispatch(addCurrentUserToStore(response.data.userData))
            console.log('user verified successfully');
          } 

          router.replace('/login')
  
        } catch (error) {
          router.replace('/login')
          setErrorPopup(true)
          console.log(error);
          throw error
          
        } finally{
          setLoading(false)
          setTimeout(() => {
            setErrorPopup(false)
          }, 5000);
        }
      }
        
      getAuthDetails()
      
    }, [router]);

  return (
    <div>
        {children}
        {loading && <Loader/>}
        {errorPopup && <PopupMessages firstClass="bg-red-700" showPopup={errorPopup} secondClass="bg-red-400" message="please signin to continue"/>}
    </div>
  )
}

export default AuthGuard