'use client'
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCurrentUserToStore, setAuthStatus } from "@/features/authSlice";
import { checkAuth } from "@/utils/api";
import Loader from "./Loader";
import SplashScreen from "./SplashScreen";
import Fallback from "./NewLoader";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { RootState } from "@/store/store";


function AuthGuard({children} : {children: React.ReactNode}) {
    const isDark = useSelector( (state : RootState) => state.activity.isDark)
    const router = useRouter()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
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
                    setLoading(false)
          }
    
        } catch (error) {
            router.replace('/login?error=unauthorized')
            setLoading(false)
          console.log(error);
          throw error
          
        } 
      }        
      getAuthDetails()
      
    }, [router]);

    if (loading) {
      return <div>
        <div className="p-4 hidden sm:flex justify-between fixed inset-0 bg-[var(--bgColor)] gap-5 w-full z-50">
                <Skeleton height={1000} width={300} borderRadius={20} baseColor={isDark? '#2e302e' : '#ececec'} className=" rounded-full " highlightColor='gray' count={1} style={{ marginBottom: '3rem' }} />
                <Skeleton height={1000} width={700} borderRadius={20} baseColor={isDark? '#2e302e' : '#ececec'} className=" rounded-full " count={1} highlightColor='gray' style={{ marginBottom: '3rem' }}/>
                <Skeleton height={1000} width={300} borderRadius={20} baseColor={isDark? '#2e302e' : '#ececec'} className=" rounded-full " highlightColor='gray' count={1} style={{ marginBottom: '3rem' }} />
              </div>
              <div className="p-4 flex flex-col sm:hidden fixed inset-0 bg-[var(--bgColor)] gap-5 w-full z-50">
                <Skeleton height={60} borderRadius={20} baseColor={isDark? '#2e302e' : '#ececec'} className=" rounded-full " highlightColor='gray' count={1} style={{ marginBottom: '3rem' }} />
                <Skeleton height={500} borderRadius={20} baseColor={isDark? '#2e302e' : '#ececec'} className=" rounded-full " count={1} highlightColor='gray' style={{ marginBottom: '3rem' }}/>
                <Skeleton height={60} borderRadius={20} baseColor={isDark? '#2e302e' : '#ececec'} className=" rounded-full " highlightColor='gray' count={1} style={{ marginBottom: '3rem' }} />
              </div>
      </div>
    }

  return (
    <div className="w-full min-h-screen">
        {children}        
    </div>
  )
}

export default AuthGuard