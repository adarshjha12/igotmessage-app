'use client'
import Brand from '@/components/Brand';
import SplashImage from '@/components/SplashScreen';
import { Heart, Inbox } from 'lucide-react';
import { useRouter } from 'next/navigation'


export default function HomePage() {
  const router = useRouter()

  return (
    <main className="w-full h-full p z-40 bg-black min-h-screen flex items-center justify-center flex-col text-[var(--textColor)]">
        <div className='z-30 rounded-2xl h-full '>
          <div className='flex w-full left-slide justify-center items-center flex-wrap gap-12 rounded-xl my-8 '>
            <div className='flex w-full flex-col gap-8 justify-center items-center'>
              <div className=' rounded-full p-4 flex justify-center'>
                <p className='text-5xl sm:text-9xl font-audioWide inline text-center text-white font-extrabold'>Grand Welcome!<Heart className='inline ml-2 text-blue-300' size={55} strokeWidth={2}/></p>
              </div>

              <div className='flex w-full flex-col   border-white items-center backdrop-blur-md gap-2 bg-gray-700/50'>
                <div className='flex flex-col items-center border-x-1 border-white bg-black/50 py-8 px-8 sm:px-12 transform -skew-x-[30deg]'>
									<p className='text-4xl font-[var(--font-montez)] transform skew-x-[30deg] font-montez text-violet-200'>From </p>
									<div className='flex gap-6 items-center'>
										<Brand animate={true} color='white' className='transform skew-x-[30deg]'/>
										<p className='text-3xl sm:text-5xl text-white transform skew-x-[30deg] font-montez font-bold'>IGotMessage</p>
									</div>
								</div>
              </div>
            </div>

            <div className='flex flex-col w-full justify-center items-center p-4 gap-4'>
              <div className='flex justify-center items-center p-0.5 border-1 border-white rounded-md'>
                <button
                type='button' 
                onClick={() => router.push('/login')}
                className='py-2 text-md sm:text-xl font-exo2 animate-pulse flex items-center border-1 border-[var(--borderColor)] text-black cursor-pointer font-semibold px-2 gap-3 justify-between rounded-md active:scale-75 hover:bg-black hover:text-white bg-white'>
                  <div>Continue to </div>
                  <div className='flex items-center justify-center'>
                    <span className='font-montez font-semibold'>IGotMessage</span>
                  </div>
                </button>
              </div>

              <div className='flex w-full flex-col items-center justify-center bg-black/50 backdrop-blur-md'>
								<p className='text-center text-xl sm:text-3xl font-extrabold text-gray-300 font-exo2 '>You are just one step away from something extraordinary!</p>
							</div>
              
            </div>

          </div>
        </div>

        <div className='inset-4 px-12 fixed h-full blur-2xl w-[80%] gap-10  grid grid-cols-1 sm:grid-cols-2 rotate-12 sm:rotate-45 z-20'>
          <div className='flex flex-col rounded-b-md rounded-e-full rotate-45 blur-md rounded-full rounded-r-lg bg-red-700'></div>
          <div className='flex flex-col rounded-b-full rotate-90 blur-md rounded-full rounded-r-lg  bg-amber-600 gap-4'></div>
          <div className='flex flex-col  rounded-b-md rounded-e-full -rotate-12 blur-md rounded-full rounded-r-lg  bg-green-700 gap-4'></div>
          {/* <div className='flex flex-col  rounded-b-md rounded-e-full rotate-45 blur-md rounded-full rounded-r-lg  bg-blue-600 gap-4'></div>
          <div className='flex flex-col  rounded-b-md rounded-e-full rotate-45 blur-md rounded-full rounded-r-lg  bg-pink-800 gap-4'></div>
          <div className='flex flex-col  rounded-b-md rounded-e-full blur-md rounded-full rounded-r-lg  bg-red-400 rotate-90 gap-4'></div>
          <div className='flex flex-col  blur-xs rounded-full bg-violet-600 gap-4'></div>
          <div className='flex flex-col  rounded-b-md rounded-e-full blur-md rounded-full rounded-r-lg  bg-red-400 rotate-90 gap-4'></div>
          <div className='flex flex-col  blur-xs rounded-full bg-green-600 gap-4'></div> */}
        </div>
        <SplashImage/>
    </main>
  );
}
