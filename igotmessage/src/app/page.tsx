import Brand from '@/components/Brand';
import { Heart } from 'lucide-react';

export default function HomePage() {

  return (
    <main className="w-full min-h-screen flex items-center justify-center flex-col bg-gradient-to-r bg-[var(--bgColor)] text-[var(--textColor)] ">
        <div className='flex left-slide justify-center items-center flex-wrap bg-[var(--wrapperColor)] gap-12 font-exo2 border-1 border-[var(--borderColor)] rounded-xl p-2 '>
          <div className='flex flex-col gap-8 justify-center items-center'>
            <div className='bg-[var(--textColor)] rounded-full p-4 flex justify-center'>
              <p className='text-4xl sm:text-8xl inline text-center bg-gradient-to-r from-red-500 via-blue-600 to-blue-700 bg-clip-text text-transparent font-[1000]'>Grand Welcome!<Heart className='inline ml-2 text-red-500' size={55} strokeWidth={4}/></p>
            </div>
            <p className='text-4xl font-montez text-red-400 font-semibold'>From</p>
            <div className='flex gap-6'>
              <Brand animate={true} />
              <p className='text-5xl font-montez font-semibold'>IGotMessage</p>
            </div>
          </div>
          <hr className='text-[var(--textColor)] h-2 w-full'/>

          <div className='flex flex-col justify-center items-center gap-4'>
            <p className='text-center'>You are just one step away from something extraordinary!</p>
            <button type='button' className='py-1 tracking-widest cursor-pointer font-semibold px-4 rounded-2xl hover:from-green-400 hover:to-green-700 bg-gradient-to-r from-blue-500 to-blue-700'>
              Continue to 
              <span className='font-montez font-semibold ml-3'>IGotMessage</span>
            </button>
          </div>

        </div>
    </main>
  );
}
