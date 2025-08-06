'use client'

import { MailIcon, ArrowLeft } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import Image from 'next/image'

function AboutDevPageComponent() {
  const isDark = useSelector((state: RootState) => state.activity.isDark)
  const router = useRouter()

  return (
    <div className="min-h-screen w-full text-[var(--textColor)] px-4 py-6 font-exo2 bg-gradient-to-r from-[var(--bgColor)] to-[var(--inputBg)]">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-[var(--bgColor)] p-2 text-[var(--textColor)] shadow-md hover:scale-105 transition active:scale-90"
      >
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="text-base font-medium">Back</span>
      </button>

      {/* Container */}
      <div className="max-w-3xl mx-auto flex flex-col gap-8 mt-20">
        {/* Intro */}
        <div className="bg-[var(--wrapperColor)] p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-2 font-montez text-center">IGotMessage</h1>
          <p className="text-lg leading-relaxed">
            <strong className="font-semibold">IGotMessage</strong> is a full-featured social media app built by me to showcase my full stack development skills. It includes core features like posts, stories, chats, video calls, and more — all designed to deliver a modern, interactive experience.
          </p>
        </div>

        {/* Developer Card */}
        <div className="flex flex-col items-center gap-4 bg-[var(--wrapperColor)] p-6 rounded-2xl shadow-md">
          <Image
            src="/images/adarsh.jpg"
            alt="Adarsh"
            width={120}
            height={120}
            className="rounded-xl object-cover shadow-md"
          />
          <div className="text-center">
            <p className={`text-2xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
              Adarsh Kumar Jha
            </p>
            <p className="text-sm text-muted-foreground">Full Stack Web & React Native Developer</p>
          </div>
        </div>

        {/* Note Section */}
        <div className="bg-[var(--wrapperColor)] p-5 rounded-xl shadow-md">
          <p className="text-lg leading-relaxed">
            <strong className="text-xl font-semibold">Note:</strong> This is a web app, and soon I will be launching Android and iOS versions built with React Native.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-[var(--wrapperColor)] p-5 rounded-xl shadow-md space-y-4">
          <h2 className="text-2xl font-semibold">Why am I building iGotMessage?</h2>
          <p className="text-base leading-relaxed">
            A few weeks ago, I tried to integrate WhatsApp OTP using Meta’s API… But their requirements? GST, PAN, business registration… everything a solo developer like me doesn’t usually have.
          </p>
          <p>
            I thought — why do developers always have to depend on giants like Meta for core things like authentication? Why not build something of our own?
          </p>
          <p>
            So I took a bold step. I started building a social media app — not just for fun, but to make something real that serves users and developers.
          </p>
          <p>
            That’s how iGotMessage was born — a platform that blends stories, posts, messages, and calls with privacy-first design, and also offers powerful, developer-friendly APIs.
          </p>
          <p>
            I’m launching my own company: <strong>jhaFusion LLC 🚀</strong>
          </p>
          <p>
            I don’t have a degree — but I have hunger, passion, and an unshakable belief that I can build anything.
          </p>
          <p>
            This isn’t just an app. It’s a statement.
          </p>
          <p>
            Today, iGotMessage is 80% complete. This is just the beginning.
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center border-t border-[var(--borderColor)] pt-6 mt-10">
          <p className="text-lg">Made with ❤️ by <strong>Adarsh</strong></p>
          <p className="mt-1">© {new Date().getFullYear()} IGotMessage from <span className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>JhaFusion LLC</span></p>
          <div className="mt-2 text-sm space-y-1">
            <p className="flex items-center justify-center gap-2">
              <MailIcon size={16} />
              Email:
              <a href="mailto:jhaa50872@gmail.com" className={`hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'} font-semibold`}>
                jhaa50872@gmail.com
              </a>
            </p>
            <p>
              📞 Phone: <a href="tel:+917079393887" className={`hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'} font-semibold`}>+91 70793 93887</a>
            </p>
            <p className={`mt-2 font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              🇮🇳 A Make in India initiative
            </p>
          </div>
        </footer>

        {/* Logo */}
        <div className="flex flex-col items-center mt-6">
          <Image src="/logos/igm.png" width={70} height={70} alt="IGotMessage" className="rounded-2xl border border-[var(--borderColor)] shadow-sm" />
          <p className="font-montez text-2xl font-semibold mt-2">IGotMessage</p>
        </div>
      </div>
    </div>
  )
}

export default AboutDevPageComponent
