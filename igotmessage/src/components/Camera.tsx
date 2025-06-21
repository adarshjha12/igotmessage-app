'use client'; // Needed in Next.js 13/14 for client-side components

import { RefreshCcwIcon, SwitchCamera } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState<null | string>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const router = useRouter()

  useEffect(() => {
    if (navigator.mediaDevices?.getUserMedia && videoRef.current) {
      let stream: MediaStream

      async function enableVideo(mode : 'user' | 'environment') {
          try {
            stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: mode}})
            if (videoRef.current) {
              videoRef.current.srcObject = stream
            }
          } catch (error) {
            console.log(error);
        }
       }
       enableVideo(facingMode)

       return (() => {
         if (stream) {
          stream.getTracks().forEach( track => track.stop())
         }
       })
    }
  }, [facingMode]);

  function handleCameraMode() {
    setFacingMode(facingMode === "user"? "environment": "user")
  }


navigator.mediaDevices
  const capture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png');
        setPhoto(dataURL);
        console.log(dataURL);
        
      }
    }
  };

  return (
    <div className='flex bg-[var(--bgColor)]/50 w-screen h-screen backdrop-blur-md fixed inset-0 z-40 overflow-y-auto sm:justify-center justify-start items-center flex-col'>
      <div className='flex flex-col py-2 justify-center items-center  relative'>
        <video className={`transform ${photo? 'hidden' : 'rounded-xl'} -scale-x-100`} ref={videoRef} autoPlay playsInline muted />

        <div className='flex w-full py-2 right-slide sm:bg-transparent rounded-xl sm:-bottom-18 absolute bottom-0 justify-center items-center bg-black/30'>
        
          <button className={`w-[60px] cursor-pointer  rounded-full h-[60px] grid place-content-center border-2 ${photo? 'hidden' : ''}`} onClick={capture}>
          <div className='w-[50px] h-[50px] rounded-full bg-white'></div>
          </button>

          <button onClick={handleCameraMode} className='ml-3 cursor-pointer active:scale-75 active:bg-white/30 ' type="button">
            <SwitchCamera/>
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {photo && (
        <div className='absolute inset-0 font-exo2 mt-4 flex flex-col justify-start gap-4 items-center'>
          <div className='flex w-full justify-center gap-8'>

            <button type='button'
            className='bg-blue-500 text-xl text-white font-semibold active:bg-blue-800 active:scale-90 cursor-pointer rounded-xl py-2 px-3'
            onClick={() => {
              
              router.push('/create-story')
              }}>
              Add to Story
            </button>

            <button
            className='bg-gradient-to-br text-white from-green-500 to to-green-800 text-xl font-semibold active:bg-green-800 active:scale-90 cursor-pointer rounded-xl py-2 px-3'
             type='button' onClick={() => setPhoto(null)}>
              Add Post
            </button>
          </div>
          <img src={photo} className={`rounded-xl -scale-x-100`} alt="Captured" />
          <button
            className='bg-[var(--wrapperColor)] border-2 border-[var(--borderColor)] cursor-pointer rounded-2xl p-3'
             type='button' onClick={() => setPhoto(null)}>
              <RefreshCcwIcon/>
          </button>
        </div>
      )}
    </div>
  );
}
