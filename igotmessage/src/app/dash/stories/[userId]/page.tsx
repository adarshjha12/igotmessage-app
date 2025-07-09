"use client"

import StorySlider from '@/components/create story/ShowStory';
import { useParams } from 'next/navigation';
import React from 'react'

function page() {
    const { userId } = useParams();
  return (
   <StorySlider/>
  )
}

export default page