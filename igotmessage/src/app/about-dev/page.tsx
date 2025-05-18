'use client'
import { MailIcon, ArrowLeft } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'

function Page() {

    const isDark = useSelector( (state : RootState) => state.auth.isDark)
    const router = useRouter()

  return (
    <div className='w-full min-h-screen text-wrap text-[var(--textColor)] py-3 px-2 flex flex-col items-center font-exo2 justify-center bg-[var(--bgColor)] '>
        <button type='button'  
        onClick={() => router.back()}
        className={`fixed cursor-pointer text-2xl border-2 p-2 rounded-full ${isDark? 'border-blue-400' : 'border-blue-600'} text[var(--textColor)] top-6 flex items-center left-4 ${isDark? 'text-blue-400' : 'text-blue-600'}`}
        >
            <ArrowLeft size={33} className=''/>
            {/* <button className=' font-semibold'>back </button> */}
        </button>
        <div className='flex flex-col gap-8 items-center'>
            <div className='overflow-hidden'>
                <img className='w-40 h-auto rounded-md -mb-3' src="/images/adarsh.jpg" alt="" />
            </div>
            <span className='grid place-items-center'>
                <p className={`${isDark? 'text-amber-400' : 'text-amber-700'} font-semibold text-2xl`}>Adarsh kumar jha</p>
                <p>Full stack web developer</p>
            </span>
        </div>
        <div className="text-center p-4">
        <p className="text-lg mb-6">
            <strong className='font-montez mr-2 text-2xl'>IGotMessage</strong> is a full-featured social media app built by me to showcase my full stack development skills. It includes core features like posts, stories, chats, video calls, and more — all designed to deliver a modern, interactive experience.
        </p>

        <footer className="border-t flex flex-col items-start justify-center pt-4 mt-8 text-lg">
            <p>Made with ❤️ by <strong>Adarsh</strong></p>
            <span className="mt-1 inline-block text-left">© {new Date().getFullYear()} IGotMessage from <p className={`inline ${isDark? 'text-green-400' : 'text-green-600'} font-semibold`}>Jha Inc.</p> All rights reserved.</span>
            <p className="mt-2 flex items-center gap-1.5"><MailIcon className='text-[2px] '/> Email: <a href="mailto:jhaa50872@gmail.com" className={`${isDark? 'text-blue-400' : 'text-blue-600'} font-semibold hover:underline`}>jhaa50872@gmail.com</a></p>
        <p>📞 Phone: <a href="tel:+911234567890" className={`${isDark? 'text-blue-400' : 'text-blue-600'} font-semibold hover:underline`}>+917079393887</a></p>
            <p className={`mt-4 font-semibold ${isDark? 'text-green-400' : 'text-green-600'}`}> A <span className="underline">Make in India</span> initiative</p>
        </footer>
        </div>
    </div>
  )
}

export default Page