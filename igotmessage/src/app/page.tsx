import Brand from '@/components/Brand';
import { Heart } from 'lucide-react';

export default function HomePage() {

  return (
    <main className="w-full min-h-screen flex items-center justify-center flex-col bg-gradient-to-r bg-[var(--bgColor)] text-[var(--textColor)] ">
        <div className='flex left-slide justify-center items-center flex-wrap bg-[var(--wrapperColor)] gap-12 font-exo2 border-1 border-[var(--borderColor)] rounded-xl p-4 '>
          <div className='flex flex-col gap-8 justify-center items-center'>
            <p className='text-3xl inline text-yellow-200 font-semibold'>Grand Welcome!<Heart className='inline ml-2 text-blue-400' size={55}/></p>
            <p className='text-4xl font-montez text-green-400 font-semibold'>From</p>
            <div className='flex gap-6'>
              <Brand animate={true} />
              <p className='text-5xl font-montez font-semibold'>IGotMessage</p>
            </div>
          </div>
          <hr className='text-[var(--textColor)] h-2 w-full'/>

          <div className='flex flex-col justify-center items-center gap-4'>
            <p>You are just one step away from something extraordinary!</p>
            <button type='button' className='py-1 cursor-pointer px-4 rounded-2xl bg-gradient-to-r from-black to-blue-600'>
              Contnue to 
              <span className='font-montez font-semibold ml-3'>IGotMessage</span>
            </button>
          </div>

        </div>
    </main>
  );
}
