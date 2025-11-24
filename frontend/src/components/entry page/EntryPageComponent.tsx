"use client";

import SplashScreen from "@/components/SplashScreen";
import { addCurrentUserToStore } from "@/features/authSlice";
import { checkAuth } from "@/utils/api";
import { ArrowRight, Cpu, Download, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

export default function EntryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    async function checkAuthDetails() {
      try {
        const response = await checkAuth();

        if (response.data.success === true) {
            setLoading(false);
            setChecked(true);
            setIsVerified(true);
            dispatch(addCurrentUserToStore(response.data.userData));
            router.push("/dash/feed");
        } else {
          setIsVerified(false);
            setLoading(false);
            setChecked(true);
        }
      } catch (error) {
        setIsVerified(false);
        setLoading(false);
        setChecked(true);
        console.error(error);
      }
    }

    checkAuthDetails();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  if (checked && isVerified === false) {
    router.push("/login");
  }
}
