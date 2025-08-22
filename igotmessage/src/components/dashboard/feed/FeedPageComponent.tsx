"use client";

import Story from "@/components/create story/StoryCircles";
import React, { useEffect, useState } from "react";
import musicTracks from "@/utils/music";
import CameraCapture from "@/components/Camera";
import NewLoader from "@/components/NewLoader";
import SplashScreen from "@/components/SplashScreen";
import { DownloadIcon } from "@phosphor-icons/react";
import MainModal from "@/components/modals/MainModal";
import Skeleton from "react-loading-skeleton";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import CreateProfile from "@/components/create profile/CreateProfile";
// import { useRouter, useSearchParams } from 'next/navigation'

function FeedPageComponent() {
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);

  return (
    <div className=" w-full ">
      <Story />
      <p className="bg-[var(--wrapperColor)] p-6 rounded-4xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum tenetur
        ipsa, minima non reiciendis voluptatum possimus amet quaerat unde
        consequatur iusto maxime molestiae aperiam id itaque. Veritatis corporis
        aperiam recusandae quidem laborum, ipsum laboriosam? Repellendus
        asperiores consequatur, est ex exercitationem officiis, architecto, eum
        fuga temporibus accusantium nisi. Eum vitae ut iste hic quo animi
        consequuntur repudiandae architecto aliquid impedit? Expedita quibusdam
        unde tempore vero iusto sapiente tenetur iste veniam laborum! Dolore,
        sunt suscipit. Sint porro atque molestias eum expedita repellat cum
        nesciunt. Temporibus hic quidem adipisci laudantium, molestiae velit
        repellat ipsa quasi officia qui excepturi rem sapiente modi molestias
        provident?
      </p>
      <p className="bg-[var(--wrapperColor)] p-6 rounded-4xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum tenetur
        ipsa, minima non reiciendis voluptatum possimus amet quaerat unde
        consequatur iusto maxime molestiae aperiam id itaque. Veritatis corporis
        aperiam recusandae quidem laborum, ipsum laboriosam? Repellendus
        asperiores consequatur, est ex exercitationem officiis, architecto, eum
        fuga temporibus accusantium nisi. Eum vitae ut iste hic quo animi
        consequuntur repudiandae architecto aliquid impedit? Expedita quibusdam
        unde tempore vero iusto sapiente tenetur iste veniam laborum! Dolore,
        sunt suscipit. Sint porro atque molestias eum expedita repellat cum
        nesciunt. Temporibus hic quidem adipisci laudantium, molestiae velit
        repellat ipsa quasi officia qui excepturi rem sapiente modi molestias
        provident?
      </p>
      <p className="bg-[var(--wrapperColor)] p-6 rounded-4xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum tenetur
        ipsa, minima non reiciendis voluptatum possimus amet quaerat unde
        consequatur iusto maxime molestiae aperiam id itaque. Veritatis corporis
        aperiam recusandae quidem laborum, ipsum laboriosam? Repellendus
        asperiores consequatur, est ex exercitationem officiis, architecto, eum
        fuga temporibus accusantium nisi. Eum vitae ut iste hic quo animi
        consequuntur repudiandae architecto aliquid impedit? Expedita quibusdam
        unde tempore vero iusto sapiente tenetur iste veniam laborum! Dolore,
        sunt suscipit. Sint porro atque molestias eum expedita repellat cum
        nesciunt. Temporibus hic quidem adipisci laudantium, molestiae velit
        repellat ipsa quasi officia qui excepturi rem sapiente modi molestias
        provident?
      </p>
      <p className="bg-[var(--wrapperColor)] p-6 rounded-4xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum tenetur
        ipsa, minima non reiciendis voluptatum possimus amet quaerat unde
        consequatur iusto maxime molestiae aperiam id itaque. Veritatis corporis
        aperiam recusandae quidem laborum, ipsum laboriosam? Repellendus
        asperiores consequatur, est ex exercitationem officiis, architecto, eum
        fuga temporibus accusantium nisi. Eum vitae ut iste hic quo animi
        consequuntur repudiandae architecto aliquid impedit? Expedita quibusdam
        unde tempore vero iusto sapiente tenetur iste veniam laborum! Dolore,
        sunt suscipit. Sint porro atque molestias eum expedita repellat cum
        nesciunt. Temporibus hic quidem adipisci laudantium, molestiae velit
        repellat ipsa quasi officia qui excepturi rem sapiente modi molestias
        provident?
      </p>
      <div></div>
    </div>
  );
}

export default FeedPageComponent;
