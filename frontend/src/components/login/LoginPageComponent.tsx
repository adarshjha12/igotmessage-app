"use client";
import React, { useState, useRef, useEffect } from "react";
import OtpInput from "./OtpInput";
import PopupMessage from "@/components/popups/PopupMessages";
import { handleGuest, sendOtp } from "@/utils/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import NewLoader from "@/components/NewLoader";
import {
  ArrowArcRightIcon,
  ArrowBendDownLeftIcon,
  ArrowBendDownRightIcon,
  DeviceMobileIcon,
  OptionIcon,
  UserGearIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { User } from "lucide-react";
import SplashScreen from "../SplashScreen";
import Image from "next/image";

function Login() {
  const isDark = useSelector((state: RootState) => state.activity.isDark);
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [googleButtonClick, setGoogleButtonClick] = useState(false);
  const [emailButtonClick, setEmailButtonClick] = useState(false);
  const [guestButtonClick, setGuestButtonClick] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpSentSuccessPopup, setShowOtpSentSuccessPopup] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  let [email, setEmail] = useState("");
  const [errorSendingEmail, setErrorSendingEmail] = useState(false);
  const baseButton = `
  flex items-center justify-center gap-3
  w-full max-w-[320px] py-2 px-5
  rounded-2xl border-2
  transition-all duration-200 ease-in-out
  text-lg font-medium
  hover:scale-[1.03] active:scale-[0.97]
  shadow-md hover:shadow-lg
  hover:border-yellow-400 cursor-pointer
  bg-gray-800 text-white
  border-gray-600 
`;

  const [showPopupForEmptyInput, setShowPopupForEmptyInput] = useState(false);
  let [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const router = useRouter();

  const timer = function () {
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        setCanResend(false);
        return prev - 1;
      });
    }, 1000);
  };

  const handleGoogleButtonClick = function () {
    setGoogleButtonClick(true);

    console.log("Prod URL:", process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL);
    console.log("Local URL:", process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL);

    const googleAuthUrl =
      process.env.NODE_ENV === "production"
        ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/google/auth/google`
        : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/google/auth/google`;

    console.log("Full Google Auth URL:", googleAuthUrl);

    window.location.href = googleAuthUrl;
  };

  const handleEmailButtonClick = function () {
    setEmailButtonClick(true);
  };

  const handleGuestSignin = async function () {
    setGuestButtonClick(true);
    const res = await handleGuest();
    console.log("++++++++++++++++++++++", res);
    if (res?.data.success === true) {
      router.push("/dash/feed");
    }
  };

  const handleSendOtp = async function () {
    if (!email) {
      setShowPopupForEmptyInput(true);
      inputRef.current?.focus();

      setTimeout(() => {
        setShowPopupForEmptyInput(false);
      }, 5000);
      return;
    }

    setLoading(true);
    try {
      const response = await sendOtp(email);

      if (response?.data.success === true) {
        timer();
        setOtpSent(true);
        setShowOtpSentSuccessPopup(true);
        setTimeout(() => {
          setShowOtpSentSuccessPopup(false);
        }, 5000);
      }
    } catch (error) {
      setErrorSendingEmail(true);
      console.log(error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setErrorSendingEmail(false);
      }, 5000);
    }
  };

  useEffect(() => {
    if (canResend && resendOtp) {
      handleSendOtp();
      setResendTimer(30);
      setResendOtp(false);
    }
  }, [canResend, resendOtp]);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "unauthorized") {
      setUnauthorized(true);
    }
    setTimeout(() => {
      setUnauthorized(false);
    }, 5000);
  }, [searchParams]);

  return (
    <div
      key={`${emailButtonClick} ${otpSent} `}
      className="w-full min-h-screen text-white flex items-center justify-center flex-col bg-black"
    >
      <div
        key={`${emailButtonClick} ${otpSent} `}
        className={`${otpSent ? "right-slide" : "left-slide"} ${
          emailButtonClick ? "test-slide" : ""
        } m-3 w-[90%] min-h-[90%] sm:h-full sm:min-w-[70%] border-1 py-12 px-2 border-white bg-black/15 backdrop-blur-sm z-20 rounded-xl flex flex-col justify-center items-center gap-10`}
      >
        <div className="flex flex-col items-center">
          <img
            src="/logos/igm.png"
            className="w-[60px] h-auto rounded-2xl border-1 border-white"
            alt=""
          />
          <p
            className={` text-6xl font-medium font-montez h-fit hover:scale-125 transition-all hover:ease-in my-2`}
          >
            IGotMessage
          </p>
          <p
            className={`capitalize text-2xl text-yellow-400 font-medium font-montez `}
          >
            the social app
          </p>
        </div>
        <hr className="w-[100px] text-white" />
        {emailButtonClick ? (
          ""
        ) : (
          <div
            className={`mt-3 flex items-center justify-center gap-2 font-medium text-white/80`}
          >
            <Image width={60} height={60} className="h-auto"  src="/images/lion.png" alt="img" />
            <p> A Make in India Initiative</p>
          </div>
        )}
        <div
          className={` ${
            otpSent ? "hidden" : null
          } flex flex-col items-center justify-center gap-4`}
        >
          {/* Guest Button */}
          <button
            type="button"
            onClick={handleGuestSignin}
            className={`flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-gray-300 bg-gray-800/80 backdrop-blur-sm
    shadow-sm hover:shadow-md hover:bg-gray-800 transition-all duration-300 ease-in-out
    text-white font-medium text-base sm:text-lg active:scale-95
    ${emailButtonClick && "hidden"}`}
          >
            <User className="w-6 h-6 text-green-500" />
            <span className="flex flex-wrap text-center leading-snug">
              {guestButtonClick ? (
                <NewLoader color="black" />
              ) : (
                "Continue as Guest"
              )}
            </span>
          </button>

          <p
            className={`text-base sm:text-lg font-medium text-gray-300 my-3 ${
              emailButtonClick ? "hidden" : ""
            }`}
          >
            or
          </p>

          {/* Google Button */}
          <button
            onClick={handleGoogleButtonClick}
            className={`flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-gray-300 bg-gray-800/80 backdrop-blur-sm
    shadow-sm hover:shadow-md hover:bg-gray-800 transition-all duration-300 ease-in-out
    text-white font-medium text-base sm:text-lg active:scale-95
    ${googleButtonClick ? "w-[260px]" : ""} ${
              emailButtonClick ? "hidden" : ""
            }`}
          >
            {!googleButtonClick && (
              <img src="/images/google.png" alt="Google" className="w-6 h-6" />
            )}
            <span className="flex flex-wrap text-center leading-snug">
              {googleButtonClick ? (
                <NewLoader color="black" />
              ) : (
                "Continue with Google"
              )}
            </span>
          </button>

          {/* Email Button */}
          <button
            onClick={handleEmailButtonClick}
            className={`flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-gray-300 bg-gray-800/80 backdrop-blur-sm
    shadow-sm hover:shadow-md hover:bg-gray-800 transition-all duration-300 ease-in-out
    text-white font-medium text-base sm:text-lg active:scale-95
    ${emailButtonClick ? "hidden" : ""}`}
          >
            <img src="/images/gmail.png" alt="Gmail" className="w-6 h-6" />
            <span className="flex flex-wrap text-center leading-snug">
              Continue with Email
            </span>
          </button>

          {emailButtonClick && (
            <form action="" className="flex flex-col gap-1 items-center">
              <div className="">
                <div className=" w-full grid grid-cols-1 sm:[grid-template-columns:2fr_1fr]  gap-4 my-8 justify-center items-end">
                  <div className="px-2 flex-col flex justify-end   rounded-md">
                    <label
                      htmlFor="email"
                      className={`  w-full flex items-center text-left transform transition-all cursor-text duration-300 ease-linear  font-exo2 text-white pb-2.5 text-xl`}
                    >
                      Please enter your email
                    </label>
                    <div className="border-1 px-2 border-white py-2 rounded-xl">
                      <input
                        type="email"
                        ref={inputRef}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        id="email"
                        autoFocus
                        name="email"
                        autoComplete="email"
                        onFocus={() => setInputFocus(true)}
                        placeholder={inputFocus ? "eg- abc@gmail.com" : ""}
                        inputMode="email"
                        className=" text-white py-1 px-2 rounded-sm border-transparent outline-none font-semibold tracking-widest placeholder:text-white/50 placeholder:text-lg"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className={`${baseButton} text-black`}
                  >
                    {loading ? <NewLoader color="white" /> : "Get otp"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
        <OtpInput
          showOtpField={otpSent}
          email={email}
          resendCounter={resendTimer}
          setResendOtp={setResendOtp}
          canResend={canResend}
        />
      </div>
      <PopupMessage
        show={showOtpSentSuccessPopup}
        onClose={() => setShowOtpSentSuccessPopup(false)}
        type="success"
        message={`Otp sent successfully to ${email}`}
      />

      <PopupMessage
        onClose={() => setShowPopupForEmptyInput(false)}
        show={showPopupForEmptyInput}
        type="error"
        message="Please enter email address"
      />

      <PopupMessage
        onClose={() => setErrorSendingEmail(false)}
        show={errorSendingEmail}
        type="error"
        message={`${email} is invalid`}
      />

      <PopupMessage
        onClose={() => setUnauthorized(false)}
        type="error"
        show={unauthorized}
        message={`you are unauthorized. please select option below to continue`}
      />

      {loading && <NewLoader />}

      {/* this is the start of violet background */}
      <div className="inset-0 px-12 fixed h-full w-[80%] gap-10  grid grid-cols-1 sm:grid-cols-2 rotate-12 sm:rotate-45 z-10">
        <div className="flex flex-col rounded-b-md rounded-e-full rotate-45 blur-2xl rounded-full rounded-r-lg bg-blue-700"></div>
        <div className="flex flex-col rounded-b-full rotate-90 blur-2xl rounded-full rounded-r-lg  bg-blue-800 gap-4"></div>
        <div className=" flex-col hidden sm:flex rounded-b-md rounded-e-full -rotate-12 blur-2xl rounded-full rounded-r-lg  bg-blue-700 gap-4"></div>
      </div>
    </div>
  );
}

export default Login;
