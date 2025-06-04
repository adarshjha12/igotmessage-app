'use client'
import Brand from '@/components/Brand';
import { Heart, Inbox } from 'lucide-react';
import { useRouter } from 'next/navigation'


export default function HomePage() {
  const router = useRouter()

  return (
    <main className="w-full h-full z-40 bg-black to-[var(--inputBg)] min-h-screen flex items-center justify-center flex-col text-[var(--textColor)] px-2">
        <div className='z-50 rounded-2xl h-full backdrop-blur-lg bg-white/10'>
          <div className='flex left-slide justify-center items-center flex-wrap gap-12 rounded-xl my-8 '>
            <div className='flex flex-col gap-8 justify-center items-center'>
              <div className=' rounded-full p-4 flex justify-center'>
                <p className='text-5xl sm:text-9xl  inline text-center text-white font-extrabold'>Grand Welcome!<Heart className='inline ml-2 text-blue-300' size={55} strokeWidth={2}/></p>
              </div>
                  <p className='text-4xl font-[var(--font-montez)] font-montez text-violet-200'>From </p>
              <div className='flex gap-6 items-center'>
                <Brand animate={true} color='white'/>
                <p className='text-3xl sm:text-5xl text-white font-montez font-bold'>IGotMessage</p>
              </div>
            </div>

            <div className='flex flex-col  justify-center items-center p-4 gap-4'>
              <div className='flex justify-center items-center p-0.5 border-1 border-white rounded-md'>
                <button
                type='button' 
                onClick={() => router.push('/login')}
                className='py-0 text-md font-exo2 flex items-center border-1 border-[var(--borderColor)] text-black cursor-pointer font-semibold px-2 gap-3 justify-between rounded-md active:scale-75 hover:bg-black hover:text-white bg-white'>
                  <div>Continue to </div>
                  <div className='flex items-center justify-center'>
                    <span><Brand scaleSm={true}/></span>
                    <span className='font-montez font-semibold'>IGotMessage</span>
                  </div>
                </button>
              </div>

              <p className='text-center text-3xl font-extrabold text-transparent bg-clip-text font-exo2 bg-gradient-to-r from-green-400 via-red-600 to-violet-200'>You are just one step away from something extraordinary!</p>
              
            </div>

          </div>
        </div>

        <div className='inset-4 px-12 absolute  w-[80%] gap-5  grid grid-cols-3 rotate-12 z-20'>
          <div className='flex flex-col rounded-b-md rounded-e-full rotate-45 blur-md rounded-full rounded-r-lg bg-red-700'></div>
          <div className='flex flex-col rounded-b-full blur-md rounded-full rounded-r-lg  bg-amber-600 gap-4'></div>
          <div className='flex flex-col  rounded-b-md rounded-e-full rotate-12 blur-md rounded-full rounded-r-lg  bg-green-700 gap-4'></div>
          <div className='flex flex-col  rounded-b-md rounded-e-full rotate-45 blur-md rounded-full rounded-r-lg  bg-blue-600 gap-4'></div>
          <div className='flex flex-col  rounded-b-md rounded-e-full rotate-45 blur-md rounded-full rounded-r-lg  bg-pink-800 gap-4'></div>
          <div className='flex flex-col  rounded-b-md rounded-e-full blur-md rounded-full rounded-r-lg  bg-red-400 rotate-90 gap-4'></div>
          <div className='flex flex-col  blur-xs rounded-full bg-violet-600 gap-4'></div>
        </div>
        
    </main>
  );
}
