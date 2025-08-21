"use client";
import React, { useEffect, useRef, useState } from "react";
import { verifyOtp } from "@/utils/api";
import { useRouter } from "next/navigation";
import PopupMessages from "./popups/PopupMessages";
import { useDispatch } from "react-redux";
import { addCurrentUserToStore, setAuthStatus } from "@/features/authSlice";
import {
  ArrowClockwiseIcon,
  OptionIcon,
  SignInIcon,
} from "@phosphor-icons/react";
import NewLoader from "./NewLoader";

interface otpInputProps {
  showOtpField: boolean;
  email: string;
  resendCounter: number;
  canResend: boolean;
  setResendOtp: (value: boolean) => void;
}

const OtpInput = ({
  showOtpField,
  email,
  resendCounter,
  canResend,
  setResendOtp,
}: otpInputProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [inputValues, setInputValues] = useState<string[]>(["", "", "", ""]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [canSignIn, setCanSignIn] = useState(false);

  let finalInputOtp = inputValues.join("");

  const moveNext = function (userInput: HTMLInputElement, index: number) {
    if (userInput.value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const moveBack = function (userInput: HTMLInputElement, index: number) {
    if (userInput.value.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = function (e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    setInputValues(pasteData.split(""));

    if (pasteData.length === inputRefs.current.length) {
      pasteData.split("").forEach((char: string, index: number) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index]!.value = char;
        }
      });
      inputRefs.current[inputRefs.current.length - 1]?.focus();
    }
  };

  useEffect(() => {
    if (showOtpField) {
      inputRefs.current[0]?.focus();
    }
  }, [showOtpField]);

  useEffect(() => {
    const allField = inputValues.every((val) => val.trim() !== "");
    setCanSignIn(allField);
  }, [inputValues]);

  const handleSignin = async function () {
    setLoading(true);
    try {
      const response = await verifyOtp(email, finalInputOtp);

      if (response.data?.success === true) {
        setShowSuccessPopup(true);
        dispatch(addCurrentUserToStore(response.data.user));
        dispatch(setAuthStatus(true));
        router.push("/dash/feed?verification=success");
        setLoading(false);
      } else if (response.data.expired === true) {
        setShowErrorPopup(true);
        setOtpExpired(true);
        setLoading(false);
      } else {
        window.location.reload();
        router.push("/login");
        setShowErrorPopup(true);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      window.location.reload();
      router.push("/login");
      setShowErrorPopup(true);
      setLoading(false);
    } finally {
      setTimeout(() => {
        setShowSuccessPopup(false);
        setShowErrorPopup(false);
        setOtpExpired(false);
      }, 5000);
    }
  };

  return (
    <div
      className={`${
        showOtpField ? "flex" : "hidden"
      } flex-col items-center gap-3 justify-center`}
    >
      <p className="font-exo2">please enter 4 digit otp</p>
      <form
        action=""
        className="flex flex-col gap-4.5 justify-center items-center"
      >
        <div className="flex gap-1.5 ">
          {Array.from({ length: 4 }, (_, i) => {
            return (
              <div key={i}>
                <input
                  type="text"
                  maxLength={1}
                  required={true}
                  key={i}
                  ref={(element) => {
                    inputRefs.current[i] = element;
                  }}
                  onChange={(e) => {
                    const newInputValues = [...inputValues];
                    newInputValues[i] = e.target.value;
                    setInputValues(newInputValues);
                  }}
                  className="w-[50px] h-[50px] pl-3 rounded-xl font-bold text-white bg-blue-800 outline-none border-1 border-[var(--borderColor)] text-2xl opacity-75"
                  onInput={(e) => {
                    moveNext(e.target as HTMLInputElement, i);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      moveBack(e.target as HTMLInputElement, i);
                    }
                  }}
                  onPaste={handlePaste}
                />
                <span className={` ${i === 3 ? "hidden" : ""} ml-1`}>-</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-5 justify-center items-start">
          <button
            onClick={handleSignin}
            disabled={canSignIn ? false : true}
            type="button"
            className={` text-white flex items-center font-exo2 text-xl font-semibold tracking-wider cursor-pointer bg-gradient-to-r from-blue-600 to-blue-900 hover:bg-gradient-to-r ${
              canSignIn
                ? "hover:from-green-600 hover:to-green-900"
                : "hover:from-red-500 hover:to-red-900"
            } border-1 rounded-md px-3 py-2`}
          >
            {" "}
            Sign in
            <SignInIcon size={24} weight="bold" className="ml-2" />
          </button>

          <div className="flex flex-col justify-center items-center">
            <button
              onClick={() => {
                setResendOtp(true);
                inputRefs.current.forEach((input) => {
                  if (input) input.value = "";
                });
              }}
              disabled={canResend ? false : true}
              type="button"
              className={`px-2 flex items-center text-lg font-medium border-1 py-1 mt-1 mb-0.5 cursor-pointer hover:bg-gradient-to-r hover:from-red-500 hover:to-red-900 ${
                canResend
                  ? "bg-gradient-to-r from-green-600 to-green-900"
                  : "border-red-500"
              } rounded-sm`}
            >
              Resend
              <ArrowClockwiseIcon size={24} weight="bold" className="ml-2" />
            </button>
            <span className="text-md">00 : {resendCounter}</span>
          </div>
        </div>
      </form>
      {showSuccessPopup && (
        <PopupMessages
          show={showSuccessPopup}
          message="congrats! verification successfull"
          type="success"
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
      {loading && <NewLoader />}
      {showErrorPopup && (
        <PopupMessages
          type="error"
          onClose={() => setShowErrorPopup(false)}
          show={showErrorPopup}
          message="invalid credentials. please login again"
        />
      )}
      {otpExpired && (
        <PopupMessages
          onClose={() => setOtpExpired(false)}
          type="error"
          show={otpExpired}
          message="otp expired. click on resend"
        />
      )}
    </div>
  );
};

export default OtpInput;
