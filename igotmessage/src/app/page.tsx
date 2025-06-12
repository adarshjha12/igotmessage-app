'use client'
import Brand from '@/components/Brand';
import SplashScreen from '@/components/SplashScreen';
import { addCurrentUserToStore } from '@/features/authSlice';
import { checkAuth } from '@/utils/api';
import { ArrowRight, Cpu, Download, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';


export default function EntryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [checked, setChecked] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    async function checkAuthDetails() {
      try {
        const response = await checkAuth();
  
        if (response.data.success === true) {
            setLoading(false)
            setChecked(true)
            setIsVerified(true)
            dispatch(addCurrentUserToStore(response.data.userData))
            router.push('/dash/feed');
        } else {
          setIsVerified(false);
          setTimeout(() => {
            setLoading(false)
            setChecked(true)
          }, 1000);
        }
      } catch (error) {
        setIsVerified(false);
          setLoading(false)
          setChecked(true)
        console.error(error);
      } 
    }
  
    checkAuthDetails();
  }, []);

  if (loading) {
    return <SplashScreen/>
  }
  
  if (checked && isVerified === false) {
    return (
      <main className="w-full min-h-screen bg-black flex items-center justify-center flex-col text-[var(--textColor)]">
          <div className='z-30 rounded-2xl w-full min-h-screen '>
            <div className='flex w-full min-h-screen left-slide justify-center items-center flex-wrap gap-1 rounded-xl '>
              <div className='flex w-full min-h-screen flex-col gap-8 justify-evenly items-center'>
                <div className=' rounded-full p-4 flex justify-center'>
                  <p className='text-6xl sm:text-9xl font-audioWide inline text-center text-white font-extrabold'>Grand Welcome!<Heart className='inline ml-2 text-violet-500' size={55} strokeWidth={2}/></p>
                </div>
  
                <div className='flex w-full flex-col  items-center backdrop-blur-sm gap-2 bg-gray-700/30'>
                  <div className='flex flex-col border-x-1 border-white items-center rounded-2xl bg-violet-900 py-8 px-8 sm:px-12 transform -skew-x-[30deg] gap-4 justify-between'>
                    <div className='flex gap-6 items-center'>
                      <img src="/logos/igm.png" alt="logo" className='w-10 h-10 skew-x-[30deg] rounded-xl ' />
                      <p className='text-3xl sm:text-5xl text-white transform skew-x-[30deg] font-montez font-bold'>IGotMessage</p>
                    </div>
                    <p className='flex font-light font-exo2 text-gray-300 items-center gap-1 skew-x-[30deg]'> <Cpu size={15}/> <span className='text-sm sm:text-lg font-light'>JhaFusion LLC</span></p>
                  </div>
                </div>
                  <div className='flex flex-col h-full w-full justify-center items-center p-4 gap-10'>
                    <p className='text-center sm:hidden font-exo2 text-xl sm:text-3xl font-extrabold text-gray-300'>For best experience, download the app</p>
                    <div className='flex sm:hidden justify-center items-center p-0.5 border-1 border-white rounded-md'>
                      <a
                      className='py-2 text-md text-3xl font-exo2 animate-pulse flex items-center border-1 border-[var(--borderColor)] text-black cursor-pointer font-semibold px-2 gap-3 justify-between rounded-md active:scale-75 hover:bg-black hover:text-white bg-white'
                      href="/download/igotmessage-signed.apk"> Download apk <Download size={30}/> </a>
                    </div>
                    <p className='text-center sm:hidden font-exo2 text-xl sm:text-3xl font-extrabold text-gray-300'>Or</p>
                    <div className='flex justify-center items-center p-0.5 border-1 border-white rounded-md'>
                      <button
                      type='button' 
                      onClick={() => router.push('/login')}
                      className='py-2 text-md sm:text-xl font-exo2 animate-pulse flex items-center border-1 border-[var(--borderColor)] text-black cursor-pointer font-semibold px-2 gap-3 justify-between rounded-md active:scale-75 hover:bg-black hover:text-white bg-white'>
                        <div className='hidden sm:block '>Continue to IGotMessage </div>
                        <div className='sm:hidden'>Continue on web</div>
                        <ArrowRight  size={20}/>
                      </button>
                    </div>
  
                    <div className='flex w-full flex-col items-center justify-center'>
                      <p className='text-center text-xl sm:text-3xl font-extrabold text-gray-300 font-exo2 '>You are just one step away from something Extraordinary!</p>
                    </div>
                
                  </div>
              </div>
            
            </div>
          </div>
  
          <div className='inset-0 px-12 fixed h-full blur-2xl w-[80%] gap-10  grid grid-cols-1 sm:grid-cols-2 rotate-12 sm:rotate-45 z-20'>
            <div className='flex flex-col rounded-b-md rounded-e-full rotate-45 blur-md rounded-full rounded-r-lg bg-violet-700'></div>
            <div className='flex flex-col rounded-b-full rotate-90 blur-md rounded-full rounded-r-lg  bg-violet-800 gap-4'></div>
            <div className=' flex-col hidden sm:flex rounded-b-md rounded-e-full -rotate-12 blur-md rounded-full rounded-r-lg  bg-violet-700 gap-4'></div>
            
          </div>
      </main>
    );
  }
}
