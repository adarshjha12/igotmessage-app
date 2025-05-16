'use client'
import { checkAuth } from '@/utils/api'
import { useSelector, useDispatch } from "react-redux";
import { setAuthStatus } from '@/features/authSlice';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import Login from '@/components/Login';

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
          router.push('/dash/home');
        } 

      } catch (error) {
        setLoading(false)
        dispatch(setAuthStatus(false));
      } finally{
        setLoading(false)
        setauthStatusChecked(true)
      }
    };

    check();

  }, []);

  if (loading) {
    return <Loader color='black' scaleMd={true} animate={true} />
  } 

  if (authStatusChecked && !authenticated) {
    return <Login/>
  }
}

export default Page