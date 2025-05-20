'use client'
import Brand from '@/components/Brand';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation'


export default function HomePage() {
  const router = useRouter()

  return (
    <main className="w-full bg-gradient-to-r from-[var(--bgColor)]  to-[var(--inputBg)] min-h-screen flex items-center justify-center flex-col text-[var(--textColor)] px-2">
        <div className='flex left-slide justify-center items-center flex-wrap gap-12 border-1 border-[var(--borderColor)] rounded-xl my-8 '>
          <div className='flex flex-col gap-8 justify-center items-center'>
            <div className=' rounded-full p-4 flex justify-center'>
              <p className='text-4xl sm:text-9xl  inline text-center bg-gradient-to-r from-red-700 via-blue-600 font-audioWide to-pink-700 bg-clip-text text-transparent font-[1000]'>Grand Welcome!<Heart className='inline ml-2 text-red-500' size={55} strokeWidth={2}/></p>
            </div>
            <p className='text-4xl font-montez text-red-400 font-semibold'>From</p>
            <div className='flex gap-6 items-center'>
              <Brand animate={true} />
              <p className='text-3xl sm:text-5xl font-montez font-bold'>IGotMessage</p>
            </div>
          </div>
          <hr className='text-[var(--textColor)] h-2 w-full'/>

          <div className='flex flex-col  justify-center items-center p-4 gap-4'>
            <button
             type='button' 
             onClick={() => router.push('/login')}
             className='py-1 text-2xl tracking-widest text-white cursor-pointer font-semibold px-4 rounded-full active:scale-75 hover:from-green-400 hover:to-green-700 bg-gradient-to-r from-blue-500 to-blue-700'>
              Continue to 
              <span className='font-montez font-semibold ml-3'>IGotMessage</span>
            </button>

            <p className='text-center text-3xl font-extrabold text-transparent bg-clip-text font-exo2 bg-gradient-to-r from-red-700 via-blue-600 to-pink-700'>You are just one step away from something extraordinary!</p>
            
          </div>

        </div>
    </main>
  );
}
