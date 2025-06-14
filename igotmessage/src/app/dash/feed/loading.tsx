// app/dash/feed/loading.tsx
"use client"

export default function FeedLoading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-red-500  text-[var(--bgColor)]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-[var(--bgColor)]" />
    </div>
  )
}
