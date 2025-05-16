
import React, { Suspense } from "react";
import Loader from "@/components/Loader";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  

  return (
    <Suspense fallback={<Loader animate={true} scaleMd={true}  />}>
      
      {children}
    </Suspense>
  );
}
