"use client"

import { useParams } from 'next/navigation';
import React from 'react'

function page() {
    const { userId } = useParams();
  return (
    <div>
        <p>hello {userId}</p>
    </div>
  )
}

export default page