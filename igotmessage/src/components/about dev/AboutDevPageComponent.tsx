'use client'

import { MailIcon, ArrowLeft } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import Image from 'next/image'

function AboutDevPageComponent() {

    const isDark = useSelector( (state : RootState) => state.activity.isDark)
    const router = useRouter()

  return (
    <div className='w-full min-h-screen text-wrap text-[var(--textColor)] py-3 px-1 flex flex-col items-center font-exo2 justify-center bg-gradient-to-r from-[var(--bgColor)]  to-[var(--inputBg)] '>
        <button type='button'  
        onClick={() => router.back()}
        className={`fixed active:bg-[var(--wrapperColor)] bg-[var(--bgColor)] transition duration-100 active:scale-75 cursor-pointer text-2xl p-2 rounded-full text[var(--textColor)] top-4 flex items-center left-4`}
        >
            <ArrowLeft size={33} strokeWidth={1.5} className=''/>
            {/* <button className=' font-semibold'>back </button> */}
        </button>
        
        <div className="text-start p-4 flex flex-col gap-4 ">
            <p className="text-lg mt-14">
                <strong className='font-montez mr-2 text-2xl'>IGotMessage</strong> is a full-featured social media app built by me to showcase my full stack development skills. It includes core features like posts, stories, chats, video calls, and more — all designed to deliver a modern, interactive experience.
            </p>
            <div className='flex flex-col gap-8 items-center'>
                <div className='overflow-hidden'>
                    <img className='w-40 h-auto rounded-md -mb-3' src="/images/adarsh.jpg" alt="" />
                </div>
                <span className='grid place-items-center w-full bg-[var(--wrapperColor)] rounded-2xl p-2'>
                    <p className={`${isDark? 'text-amber-400' : 'text-amber-700'} font-semibold text-2xl`}>Adarsh kumar jha</p>
                    <p>Full stack web and react-native developer</p>
                </span>
            </div>
            <p className='text-xl'><span className='text-2xl font-bold'>Note:</span> This is a web app, and soon i will be launching android and ios app built with react-native.</p>
            <p className='text-xl flex flex-col gap-3'>
                <span className='text-2xl font-semibold'>Why am I building iGotMessage? And why a social media app?
                </span>

                A few weeks ago, I tried to integrate WhatsApp OTP using Meta’s API…
                But their requirements? GST, PAN, business registration… everything a solo developer like me doesn’t usually have.
                And I thought — why do developers always have to depend on giants like Meta for core things like authentication?
                Why not build something of our own?
                So I took a bold step. I started building a social media app — not just for fun, but to make something real that serves users and developers.
                That’s how iGotMessage was born — a platform that blends stories, posts, messages, and calls with privacy-first design, and also offers powerful, developer-friendly APIs for easy authentication and user engagement.
                And that’s not all…
                I’m launching my own company: jhaFusion LLC 🚀
                You might laugh.
                “How can someone who just learned Next.js and TypeScript think of building a company?”
                But I’m not joking.
                I don’t have a degree — but I have hunger, passion, and an unshakable belief that I can build anything.
                This isn’t just an app. It’s a statement.
                The journey hasn’t been easy — I’ve struggled with deployment, authentication systems, development roadblocks — but I kept going.
                Today, iGotMessage is 80% complete, and what you see now is just the beginning.
                📱 Here are some early screens — but trust me, a lot will change. I don’t want quantity — I want the best quality.
                ✨ Stay tuned for this explosive project — and many more that will follow.
                I’m here to create impact.
            </p>

            <footer className="border-t flex flex-col items-start justify-center pt-4 mt-8 text-lg">
                <p>Made with ❤️ by <strong>Adarsh</strong></p>
                <span className="mt-1 inline-block text-left">© {new Date().getFullYear()} IGotMessage from <p className={`inline ${isDark? 'text-green-400' : 'text-green-600'} font-semibold`}>JhaFusion LLC</p> All rights reserved.</span>
                <p className="mt-2 flex items-center gap-1.5"><MailIcon className='text-[2px] '/> Email: <a href="mailto:jhaa50872@gmail.com" className={`${isDark? 'text-blue-400' : 'text-blue-600'} font-semibold hover:underline`}>jhaa50872@gmail.com</a></p>
            <p>📞 Phone: <a href="tel:+911234567890" className={`${isDark? 'text-blue-400' : 'text-blue-600'} font-semibold hover:underline`}>+917079393887</a></p>
                <p className={`mt-4 font-semibold ${isDark? 'text-green-400' : 'text-green-600'}`}> A <span className="">Make in India</span> initiative</p>
            </footer>
            <div className='flex flex-col items-center gap-3 justify-center'>
            <Image src='/logos/igm.png' className='rounded-3xl border-1 border-[var(--borderColor)]' width={80} height={80} alt='IGotMessage'/>
            <p className='font-montez text-2xl font-semibold'>IGotMessage</p>
            </div>
        </div>
    </div>
  )
}

export default AboutDevPageComponent