import Brand from '@/components/Brand';
import CoverflowSwiper from '@/components/CustomSwiper';

export default function HomePage() {
  const slides = [
    <div className="bg-red-300 h-[300px] w-[300px] flex items-center justify-center rounded-lg">Slide 1</div>,
    <div className="bg-blue-300 h-[300px] w-[300px] flex items-center justify-center rounded-lg">Slide 2</div>,
    <div className="bg-red-500 h-[300px] w-[300px] flex items-center justify-center rounded-lg ">Slide 3</div>,
    <div className="bg-yellow-300 h-[300px] w-[300px] flex items-center justify-center rounded-lg ">Slide 3</div>,
    <div className="bg-gray-300 h-[300px] w-[300px] flex items-center justify-center rounded-lg ">Slide 3</div>,
    
  ];

  return (
    <main className="min-w-screen min-h-screen flex items-center justify-center flex-col bg-gradient-to-r from-black to-blue-600 ">
      <h1 className="text-2xl font-bold mb-4">Coverflow Carousel</h1>
        <div className='flex flex-wrap'>
          <CoverflowSwiper slides={slides} />
        </div>
    </main>
  );
}
