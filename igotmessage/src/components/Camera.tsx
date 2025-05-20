'use client'; // Needed in Next.js 13/14 for client-side components

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
    <div className='flex w-full relative min-h-screen justify-center items-center mt-4 flex-col'>
      <video className={`${photo? 'hidden' : ''}`} ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: '400px', height: '100%', minHeight: '100%', transform: 'scaleX(-1)' }} />

      <button className={`w-[60px] cursor-pointer mt-5 rounded-full h-[60px] grid place-content-center border-2 ${photo? 'hidden' : ''}`} onClick={capture}>
        <div className='w-[50px] h-[50px] rounded-full bg-white'></div>
      </button>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {photo && (
        <div className='absolute inset-0 flex flex-col justify-center items-center'>
          <img src={photo} alt="Captured" style={{ width: '100%', maxWidth: '400px',  transform: 'scaleX(-1)' }} />
          <button type='button' onClick={() => setPhoto(null)}>
            Click again
          </button>

          <button type='button' onClick={() => setPhoto(null)}>
            Add to Story
          </button>

          <button type='button' onClick={() => setPhoto(null)}>
            Add Post
          </button>
        </div>
      )}
    </div>
  );
}
