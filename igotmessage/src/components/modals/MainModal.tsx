import { MoonIcon, SunIcon, ArrowLeftIcon, ArrowRightIcon, ShieldIcon, InfoIcon, GroupIcon, Settings2Icon, ArrowDownUp, Cross, X } from 'lucide-react'
import React, { useState } from 'react'
import Toggle from '../Toggle'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setDarkMode, setPanelOpen } from '@/features/activitySlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CrosshairIcon, CrossIcon } from '@phosphor-icons/react'

function MainModal() {
  const isDark = useSelector((state: RootState) => state.activity.isDark)
  const userName = useSelector((state: RootState) => state.auth.user.title)

  const [dataSaver, setDataSaver] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const avatar = null

  const enableDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      dispatch(setDarkMode(false))
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      dispatch(setDarkMode(true))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[90%]  max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--bgColor)] text-[var(--textColor)] p-6 shadow-2xl transition-all duration-300">

        {/* Close Button */}
        <button
          onClick={() => dispatch(setPanelOpen(false))}
          className="absolute top-4 right-4 p-2 rounded-full active:bg-[var(--wrapperColor)] active:scale-75 cursor-pointer"
        >
          <X size={30} className="text-[var(--iconColor)]" />
        </button>

        {/* Settings Header */}
        <div className="text-4xl mb-6 flex gap-2 items-center font-bold">
          <Settings2Icon className="text-[var(--iconColor)]" size={40} strokeWidth={1.5} />
          <p>Settings</p>
        </div>

        {/* Dark Mode Toggle */}
        <div className="mb-4 flex justify-between items-center rounded-xl px-4 py-1 border border-[var(--borderColor)]">
          <div className="flex items-center gap-2">
            <p className="text-xl font-semibold text-[var(--textColor)]">Dark Mode</p>
            {isDark ? (
              <MoonIcon fill="#393939" strokeWidth={1.5} size={40} />
            ) : (
              <SunIcon size={38} strokeWidth={2} className="text-amber-600" />
            )}
          </div>
          <button onClick={enableDarkMode} className="rounded-full active:scale-90">
            <Toggle toggleNow={isDark} />
          </button>
        </div>

        {/* Data Saver Toggle */}
        <div className="mb-8 flex justify-between items-center rounded-xl px-4 py-2 border border-[var(--borderColor)]">
          <div className="flex items-center gap-2">
            <p className="text-xl font-semibold text-[var(--textColor)]">Data Saver</p>
            <ArrowDownUp size={28} className="text-[var(--textColor)]" />
          </div>
          <button onClick={() => setDataSaver(prev => !prev)} className="rounded-full active:scale-90">
            <Toggle toggleNow={dataSaver} />
          </button>
        </div>

        {/* Visit Links */}
        <div className="mb-6 pt-6">
          <div className="text-4xl mb-4 flex gap-2 items-center font-bold">
            <ArrowRightIcon className="text-[var(--iconColor)] -rotate-45" size={40} strokeWidth={1.5} />
            <p>Visit</p>
          </div>
          <div className="space-y-3">
            <Link href="/about-dev" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--wrapperColor)] hover:scale-95 transition">
              <InfoIcon className="text-[var(--iconColor)]" />
              About Dev
            </Link>
            <Link href="/privacy-policy" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--wrapperColor)] hover:scale-95 transition">
              <ShieldIcon className="text-[var(--iconColor)]" />
              Privacy Policy
            </Link>
            <Link href="/community-guidelines" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--wrapperColor)] hover:scale-95 transition">
              <GroupIcon className="text-[var(--iconColor)]" />
              Community Guidelines
            </Link>
          </div>
        </div>

        {/* User Info Button
        <div className="pt-3 border-t border-[var(--borderColor)]">
          <Link
            href="/dash/profile"
            onClick={() => dispatch(setPanelOpen(false))}
            className="flex items-center gap-3 px-4 py-2 border-2 border-[var(--borderColor)] rounded-2xl hover:scale-95 transition"
          >
            <p className="text-xl font-semibold">{userName ? userName : 'User123'}</p>
            <Image
              className="rounded-2xl"
              src={avatar || '/logos/igm.png'}
              alt="avatar"
              width={40}
              height={40}
            />
          </Link>
        </div> */}
      </div>
    </div>
  )
}

export default MainModal
