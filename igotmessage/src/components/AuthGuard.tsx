"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCurrentUserToStore, setAuthStatus } from "@/features/authSlice";
import { checkAuth } from "@/utils/api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { RootState } from "@/store/store";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const isDark = useSelector((state: RootState) => state.activity.isDark);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function getAuthDetails() {
      setLoading(true);
      try {
        const response = await checkAuth();
        if (response.data?.success === true) {
          dispatch(addCurrentUserToStore(response.data.userData));
          localStorage.setItem(
            "userId",
            JSON.stringify(response.data.userData._id)
          );
          dispatch(setAuthStatus(true));
          setVerified(true);
          setLoading(false);
        }
      } catch (error) {
        router.replace("/login?error=unauthorized");
        setLoading(false);
        console.log(error);
        throw error;
      }
    }
    getAuthDetails();
  }, [router]);

  if (!loading) {
    return (
      <div className="w-full flex min-h-screen items-start justify-center bg-[var(--bgColor)]">
        <div className="p-4 flex whitespace-nowrap sticky top-0 overflow-y-auto scroll-hidden flex-col bg-[var(--bgColor)] gap-3 max-w-[600px] z-50">
          {/* Top Horizontal Circles */}
          <div className="flex  whitespace-nowrap gap-4 overflow-x-auto scroll-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="rounded-full shrink-0"
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: "var(--wrapperColor)",
                }}
              ></div>
            ))}
          </div>

          {/* First profile + text */}
          <div className="flex pt-8 gap-4">
            <div className="flex gap-4">
              <div
                className="rounded-full"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "var(--wrapperColor)",
                }}
              ></div>

              <div className="flex flex-col gap-2">
                <div
                  className="rounded"
                  style={{
                    width: 190,
                    height: 20,
                    backgroundColor: "var(--wrapperColor)",
                  }}
                ></div>

                <div
                  className="rounded"
                  style={{
                    width: 50,
                    height: 20,
                    backgroundColor: "var(--wrapperColor)",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* First big post placeholder */}
          <div
            className="rounded-xl"
            style={{
              width: "100%",
              height: 300,
              backgroundColor: "var(--wrapperColor)",
              marginBottom: "3rem",
            }}
          ></div>

          {/* Second profile + text */}
          <div className="flex pt-8 gap-4">
            <div className="flex gap-4">
              <div
                className="rounded-full"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "var(--wrapperColor)",
                }}
              ></div>

              <div className="flex flex-col gap-2">
                <div
                  className="rounded"
                  style={{
                    width: 190,
                    height: 20,
                    backgroundColor: "var(--wrapperColor)",
                  }}
                ></div>

                <div
                  className="rounded"
                  style={{
                    width: 50,
                    height: 20,
                    backgroundColor: "var(--wrapperColor)",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Second big post placeholder */}
          <div
            className="rounded-xl"
            style={{
              width: "100%",
              height: 300,
              backgroundColor: "var(--wrapperColor)",
              marginBottom: "3rem",
            }}
          ></div>
        </div>
      </div>
    );
  }

  return <div className="w-full h-full">{children}</div>;
}

export default AuthGuard;
