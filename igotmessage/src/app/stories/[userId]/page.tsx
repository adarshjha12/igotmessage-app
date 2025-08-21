"use client"
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import React from 'react'
import NewLoader from '@/components/NewLoader';

const StorySlider = dynamic(() => import("@/components/create story/ShowStory"), {
  ssr: false,
  loading: () => <NewLoader color="black"/>,
})

function page() {
  return (
   <StorySlider/>
  )
}

export default page