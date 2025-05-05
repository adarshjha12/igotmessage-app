
import React, { Suspense } from "react";
import Loader from "@/components/Loader";
import AuthGuard from "@/components/AuthGuard";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  

  return (
    <Suspense fallback={<Loader/>}>
      
      {children}
    </Suspense>
  );
}
