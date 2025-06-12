'use client'
import React, { ReactNode, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setDarkMode } from '@/features/activitySlice'
import { useEffect } from 'react'

function ThemeProvider({children} : {children: ReactNode}) {

  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('✅ Service worker registered', reg);
        })
        .catch((err) => {
          console.error('❌ Service worker registration failed', err);
        });
    }
  }, []);
  

    const dispatch = useDispatch()

     useEffect(() => {
        setIsMounted(true)
        const theme = localStorage.getItem('theme')
        if (theme === 'dark') {
          dispatch(setDarkMode(true))
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
          dispatch(setDarkMode(false))
        }
      }, []);

  return isMounted? children : null
  
}

export default ThemeProvider