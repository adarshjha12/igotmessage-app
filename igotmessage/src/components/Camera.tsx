'use client'; // Needed in Next.js 13/14 for client-side components

import { RefreshCcwIcon } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Stream } from 'stream';
import { string } from 'zod';

export default function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState<null | string>(null);

  useEffect(() => {
    if (navigator.mediaDevices?.getUserMedia && videoRef.current) {
      let stream: MediaStream
      async function enableVideo() {
          try {
            stream = await navigator.mediaDevices.getUserMedia({video: true})
            if (videoRef.current) {
              videoRef.current.srcObject = stream
            }
          } catch (error) {
            console.log(error);
        }
       }

       enableVideo()

       return (() => {
         if (stream) {
          stream.getTracks().forEach( track => track.stop())
         }
       })
    }
  }, []);

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
    <div className='flex w-full relative right-slide min-h-screen sm:justify-center justify-start items-center mt-2 flex-col'>
      <div className='flex flex-col justify-center items-center  relative'>
        <video className={`${photo? 'hidden' : 'rounded-xl'}`} ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: '400px', height: '100%', minHeight: '100%', transform: 'scaleX(-1)' }} />

        <div className='flex w-full py-2 sm:bg-transparent rounded-xl sm:-bottom-18 absolute bottom-0 justify-center items-center bg-black/30'>
          <button className={`w-[60px] cursor-pointer  rounded-full h-[60px] grid place-content-center border-2 ${photo? 'hidden' : ''}`} onClick={capture}>
          <div className='w-[50px] h-[50px] rounded-full bg-white'></div>
        </button>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {photo && (
        <div className='absolute inset-0 font-exo2 mt-4 flex flex-col justify-start gap-2 items-center'>
          <div className='flex w-full justify-center gap-8'>

            <button type='button'
            className='bg-blue-500 text-xl font-semibold active:bg-blue-800 active:scale-90 cursor-pointer rounded-sm py-2 px-3'
            onClick={() => setPhoto(null)}>
              Add to Story
            </button>

            <button
            className='bg-gradient-to-br from-green-500 to to-green-800 text-xl font-semibold active:bg-green-800   active:scale-90 cursor-pointer rounded-sm py-2 px-3'
             type='button' onClick={() => setPhoto(null)}>
              Add Post
            </button>
          </div>
          <img src={photo} alt="Captured" style={{ width: '100%', maxWidth: '400px',  transform: 'scaleX(-1)' }} />
          <button
            className='bg-[var(--wrapperColor)] cursor-pointer rounded-2xl p-3'
             type='button' onClick={() => setPhoto(null)}>
              <RefreshCcwIcon/>
          </button>
        </div>
      )}
    </div>
  );
}
