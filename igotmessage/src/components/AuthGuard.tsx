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

  if (loading) {
    return (
      <div className=" w-full flex min-h-screen items-start justify-center bg-[var(--bgColor)]">
        <div className=" hidden sm:flex max-w-[500px] justify-center bg-[var(--bgColor)] gap-4 overflow-x-auto py-3">
             {[...Array(5)].map((_, i) => (
               <div key={i} className="flex flex-col items-center">
                 <Skeleton
                   baseColor={isDark ? "#2e302e" : "#ececec"}
                   highlightColor={isDark ? "#232323" : "#f5f5f5"}
                   circle
                   width={60}
                   height={60}
                 />
                 <Skeleton
                   baseColor={isDark ? "#2e302e" : "#ececec"}
                   highlightColor={isDark ? "#232323" : "#f5f5f5"}
                   width={50}
                   height={12}
                   className="mt-2 rounded"
                 />
               </div>
             ))}
           </div>
        <div className="p-4 flex whitespace-nowrap sticky top-0 overflow-y-auto scroll-hidden flex-col sm:hidden bg-[var(--bgColor)] gap-3 w-full z-50">
          <div className="flex whitespace-nowrap gap-4 overflow-x-auto scroll-hidden">
            <Skeleton
              height={80}
              width={80}
              borderRadius={100}
              baseColor={isDark ? "#2e302e" : "#ececec"}
              className=" rounded-full "
              highlightColor={isDark ? "#232323" : "#ececec"}
              count={1}
              style={{ marginBottom: "1rem" }}
            />
            <Skeleton
              height={80}
              width={80}
              borderRadius={100}
              baseColor={isDark ? "#2e302e" : "#ececec"}
              className=" rounded-full "
              highlightColor={isDark ? "#232323" : "#ececec"}
              count={1}
              style={{ marginBottom: "1rem" }}
            />
            <Skeleton
              height={80}
              width={80}
              borderRadius={100}
              baseColor={isDark ? "#2e302e" : "#ececec"}
              className=" rounded-full "
              highlightColor={isDark ? "#232323" : "#ececec"}
              count={1}
            />
            <Skeleton
              height={80}
              width={80}
              borderRadius={100}
              baseColor={isDark ? "#2e302e" : "#ececec"}
              className=" rounded-full "
              highlightColor={isDark ? "#232323" : "#ececec"}
              count={1}
            />
            <Skeleton
              height={80}
              width={80}
              borderRadius={100}
              baseColor={isDark ? "#2e302e" : "#ececec"}
              className=" rounded-full "
              highlightColor={isDark ? "#232323" : "#ececec"}
              count={1}
            />
          </div>
          <div className="flex pt-8 gap-4">
            <div className="flex gap-4">
              <Skeleton
                height={40}
                width={40}
                borderRadius={100}
                baseColor={isDark ? "#2e302e" : "#ececec"}
                className=" rounded-full "
                count={1}
                highlightColor={isDark ? "#232323" : "#ececec"}
              />
              <div className="flex flex-col gap-2">
                <Skeleton
                  height={20}
                  width={190}
                  borderRadius={10}
                  baseColor={isDark ? "#2e302e" : "#ececec"}
                  className=" rounded-full "
                  count={1}
                  highlightColor={isDark ? "#232323" : "#ececec"}
                />

                <Skeleton
                  height={20}
                  width={50}
                  borderRadius={10}
                  baseColor={isDark ? "#2e302e" : "#ececec"}
                  className=" rounded-full "
                  count={1}
                  highlightColor={isDark ? "#232323" : "#ececec"}
                />
              </div>
            </div>
          </div>
          <Skeleton
            height={300}
            borderRadius={10}
            baseColor={isDark ? "#2e302e" : "#ececec"}
            className=" rounded-full "
            highlightColor={isDark ? "#232323" : "#ececec"}
            count={1}
            style={{ marginBottom: "3rem" }}
          />
          <div className="flex pt-8 gap-4">
            <div className="flex gap-4">
              <Skeleton
                height={40}
                width={40}
                borderRadius={100}
                baseColor={isDark ? "#2e302e" : "#ececec"}
                className=" rounded-full "
                count={1}
                highlightColor={isDark ? "#232323" : "#ececec"}
              />
              <div className="flex flex-col gap-2">
                <Skeleton
                  height={20}
                  width={190}
                  borderRadius={10}
                  baseColor={isDark ? "#2e302e" : "#ececec"}
                  className=" rounded-full "
                  count={1}
                  highlightColor={isDark ? "#232323" : "#ececec"}
                />

                <Skeleton
                  height={20}
                  width={50}
                  borderRadius={10}
                  baseColor={isDark ? "#2e302e" : "#ececec"}
                  className=" rounded-full "
                  count={1}
                  highlightColor={isDark ? "#232323" : "#ececec"}
                />
              </div>
            </div>
          </div>
          <Skeleton
            height={300}
            borderRadius={10}
            baseColor={isDark ? "#2e302e" : "#ececec"}
            className=" rounded-full "
            highlightColor={isDark ? "#232323" : "#ececec"}
            count={1}
            style={{ marginBottom: "3rem" }}
          />
        </div>
      </div>
    );
  }

  return <div className="w-full h-full">{children}</div>;
}

export default AuthGuard;
