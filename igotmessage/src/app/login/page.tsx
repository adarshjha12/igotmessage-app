'use client'
import { checkAuth } from '@/utils/api'
import { useSelector, useDispatch } from "react-redux";
import { setAuthStatus } from '@/features/authSlice';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import Login from '@/components/Login';
import SplashScreen from '@/components/SplashScreen';

function Page() {
  
  const [loading, setLoading] = useState(false)
  const [authStatusChecked, setauthStatusChecked] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  
  
  useEffect(() => {
    const check = async () => {
      setLoading(true)
      try {
        const res = await checkAuth();

        if (res.data.success === true) {
          setAuthenticated(true)
          dispatch(setAuthStatus(true));
          setLoading(false)
          setauthStatusChecked(true)
          router.push('/dash/home');
        } 

      } catch (error) {
        setauthStatusChecked(true)
        setTimeout(() => {
          setLoading(false)
        }, 1000);
        dispatch(setAuthStatus(false));
      } 
    };
    check();

  }, []);

  if (loading) {
    return <SplashScreen />
  } 

  if (authStatusChecked && !authenticated) {
    return <Login/>
  }
}

export default Page