'use client'
import { Camera, PhoneCallIcon, Icon, Home, MessageCircleIcon, Settings, VideoIcon } from "lucide-react";
import { coconut, batBall } from '@lucide/lab';
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { useEffect, useState } from "react";

function Page() {


  return (
    <div className="w-full min-h-screen flex items-start bg-black text-black relative">
      <div className="">
          <div className=" grid grid-cols-[1fr_3fr_2fr] items-start [@media(max-width:600px)]:grid-cols-1">
            <nav className="hidden [@media(max-width:600px)]:inline-block w-full bg-white">nav</nav>
            <div className="bg-amber-600 flex flex-col justify-center items-start [@media(max-width:600px)]:flex-row">
              <div className=" flex justify-center items-center">
                  <p className="font-montez text-3xl font-bold [@media(max-width:600px)]:hidden text-blue-600">Igotmessage</p>
                  <img src="/images/logo.png" className="hidden [@media(max-width:600px)]:inline-block rounded-md w-8 h-auto border-2 border-black" alt="" />
              </div>
              <div className="[@media(max-width:600px)]:w-full [@media(max-width:600px)]:fixed [@media(max-width:600px)]:bottom-0 flex justify-start">
                <ul className="flex flex-col items-start  [@media(max-width:600px)]:items-center [@media(max-width:600px)]:pl-0
                [@media(max-width:600px)]:flex-row [@media(max-width:600px)]:justify-evenly [@media(max-width:600px)]:w-full [@media(max-width:600px)]:bg-white">

                  <li className="flex items-center gap-2">
                    <Home className="[@media(max-width:600px)]:w-3"/> 
                    <span className="font-semibold [@media(max-width:600px)]:hidden">Home</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircleIcon className="[@media(max-width:600px)]:w-3"/> 
                    <span className="font-semibold [@media(max-width:600px)]:hidden">Messages</span>
                  </li>
                  <li className="flex items-center gap-2"> 
                    <VideoIcon className="[@media(max-width:600px)]:w-3"/> 
                    <span className="font-semibold [@media(max-width:600px)]:hidden">Calls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Settings className="[@media(max-width:600px)]:w-3"/> 
                    <span className="font-semibold [@media(max-width:600px)]:hidden">Settings</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-amber-700">
              <p>
              consectetur adipisicing elit. Magni facere consectetur eum explicabo minus natus quisquam tempore delectus dolorem iste sed voluptatibus, sit fugit, cumque nobis! Consequuntur vel nemo commodi.
              </p>
            </div>
            <div className="bg-amber-50 flex justify-center ">
              
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni facere consectetur eum explicabo minus natus quisquam tempore delectus dolorem iste sed voluptatibus, sit fugit, cumque nobis! Consequuntur vel nemo commodi.
            </div>
          </div>
      </div>
    </div>

    // <div>
    //   <div className="min-w-screen grid grid-cols-3 gap-3 items-start">
    //     <p>
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat omnis obcaecati aliquam optio possimus itaque minima temporibus aliquid quas, voluptas iste tenetur perferendis iure, corrupti facilis. Voluptatum aut quasi nisi.
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat omnis obcaecati aliquam optio possimus itaque minima temporibus aliquid quas, voluptas iste tenetur perferendis iure, corrupti facilis. Voluptatum aut quasi nisi.
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat omnis obcaecati aliquam optio possimus itaque minima temporibus aliquid quas, voluptas iste tenetur perferendis iure, corrupti facilis. Voluptatum aut quasi nisi.
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat omnis obcaecati aliquam optio possimus itaque minima temporibus aliquid quas, voluptas iste tenetur perferendis iure, corrupti facilis. Voluptatum aut quasi nisi.
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat omnis obcaecati aliquam optio possimus itaque minima temporibus aliquid quas, voluptas iste tenetur perferendis iure, corrupti facilis. Voluptatum aut quasi nisi.
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat omnis obcaecati aliquam optio possimus itaque minima temporibus aliquid quas, voluptas iste tenetur perferendis iure, corrupti facilis. Voluptatum aut quasi nisi.
    //     </p>
    //     <p>
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat omnis obcaecati aliquam optio possimus itaque minima temporibus aliquid quas, voluptas iste tenetur perferendis iure, corrupti facilis. Voluptatum aut quasi nisi.
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat omnis obcaecati aliquam optio possimus itaque minima temporibus aliquid quas, voluptas iste tenetur perferendis iure, corrupti facilis. Voluptatum aut quasi nisi.
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat omnis obcaecati aliquam optio possimus itaque minima temporibus aliquid quas, voluptas iste tenetur perferendis iure, corrupti facilis. Voluptatum aut quasi nisi.
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat omnis obcaecati aliquam optio possimus itaque minima temporibus aliquid quas, voluptas iste tenetur perferendis iure, corrupti facilis. Voluptatum aut quasi nisi.
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat omnis obcaecati aliquam optio possimus itaque minima temporibus aliquid quas, voluptas iste tenetur perferendis iure, corrupti facilis. Voluptatum aut quasi nisi.
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat omnis obcaecati aliquam optio possimus itaque minima temporibus aliquid quas, voluptas iste tenetur perferendis iure, corrupti facilis. Voluptatum aut quasi nisi.
    //     </p>
    //     <p>
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat omnis obcaecati aliquam optio possimus itaque minima temporibus aliquid quas, voluptas iste tenetur perferendis iure, corrupti facilis. Voluptatum aut quasi nisi.
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat omnis obcaecati aliquam optio possimus itaque minima temporibus aliquid quas, voluptas iste tenetur perferendis iure, corrupti facilis. Voluptatum aut quasi nisi.
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat omnis obcaecati aliquam optio possimus itaque minima temporibus aliquid quas, voluptas iste tenetur perferendis iure, corrupti facilis. Voluptatum aut quasi nisi.
          
    //     </p>
    //   </div>
    // </div>
  )
}

export default Page