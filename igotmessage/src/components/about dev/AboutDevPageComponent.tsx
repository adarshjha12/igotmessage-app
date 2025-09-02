"use client";

import { MailIcon, ArrowLeft, Sparkles } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";

function AboutDevPageComponent() {
  const isDark = useSelector((state: RootState) => state.activity.isDark);
  const router = useRouter();

  return (
    <div className="min-h-screen w-full text-[var(--textColor)] px-4 py-6 font-exo2 bg-gradient-to-br from-[var(--bgColor)] to-[var(--inputBg)]">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-[var(--bgColor)] p-2 text-[var(--textColor)] shadow-md hover:scale-105 transition active:scale-90"
      >
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="text-base font-medium">Back</span>
      </button>

      {/* Container */}
      <div className="max-w-3xl mx-auto flex flex-col gap-10 mt-20">
        {/* App Intro */}
        <div className="bg-[var(--wrapperColor)] p-8 rounded-2xl shadow-lg text-center">
          <h1 className="text-4xl font-extrabold mb-3 font-montez">
            IGotMessage
          </h1>
          <p className="text-lg leading-relaxed">
            <strong className="font-semibold">IGotMessage</strong> is not just
            another social media app. It is an{" "}
            <span
              className={`font-bold ${
                isDark ? "text-green-400" : "text-green-600"
              }`}
            >
              indigenous, AI-powered next-gen social platform
            </span>{" "}
            built for the people of India 🇮🇳. Our mission is to create a
            digital home where every Indian can connect, share, and grow —
            without relying on foreign tech giants.
          </p>
        </div>

        {/* Developer Card */}
        <div className="flex flex-col items-center gap-4 bg-[var(--wrapperColor)] p-6 rounded-2xl shadow-md">
          <Image
            src="/images/adarsh.jpg"
            alt="Adarsh"
            width={120}
            height={120}
            className="rounded-xl object-cover shadow-md"
          />
          <div className="text-center">
            <p
              className={`text-2xl font-bold ${
                isDark ? "text-amber-400" : "text-amber-700"
              }`}
            >
              Adarsh Kumar Jha
            </p>
            <p className="text-sm text-muted-foreground">
              Full Stack Web & React Native Developer
            </p>
          </div>
        </div>

        {/* Purpose Section */}
        <div className="bg-[var(--wrapperColor)] p-6 rounded-xl shadow-md space-y-5">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Sparkles size={22} /> Purpose Behind IGotMessage
          </h2>
          <p className="text-base leading-relaxed">
            Social media today is dominated by a handful of global companies.
            But India — with its{" "}
            <strong>1.4 billion voices and diverse culture</strong> — deserves a
            platform of its own.
          </p>
          <p>
            <strong>IGotMessage</strong> is built with one vision:{" "}
            <span className="font-semibold italic">
              “To empower Indians with a homegrown platform that values privacy,
              innovation, and inclusivity.”
            </span>
          </p>
          <p>
            Powered by AI, the app is designed to make interactions smarter,
            safer, and more engaging — from{" "}
            <span className="font-medium">stories with music</span> to{" "}
            <span className="font-medium">video calls, reels, chats</span> and
            even <span className="font-medium">reward systems</span>.
          </p>
          <p>
            This is more than an app.{" "}
            <strong>It’s a Make in India initiative</strong> ✨ — proof that with
            passion and skill, we can build world-class products right here.
          </p>
        </div>

        {/* Note Section */}
        <div className="bg-[var(--wrapperColor)] p-5 rounded-xl shadow-md text-center">
          <p className="text-lg leading-relaxed">
            🚀 Web app is live. Android & iOS apps are coming soon, powered by{" "}
            <strong>React Native</strong>.
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center border-t border-[var(--borderColor)] pt-6 mt-10">
          <p className="text-lg">
            Made with ❤️ by <strong>Adarsh</strong>
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} IGotMessage —{" "}
            <span
              className={`font-semibold ${
                isDark ? "text-green-400" : "text-green-600"
              }`}
            >
              JhaFusion LLC
            </span>
          </p>
          <div className="mt-2 text-sm space-y-1">
            <p className="flex items-center justify-center gap-2">
              <MailIcon size={16} />
              Email:
              <a
                href="mailto:jhaa50872@gmail.com"
                className={`hover:underline ${
                  isDark ? "text-blue-400" : "text-blue-600"
                } font-semibold`}
              >
                jhaa50872@gmail.com
              </a>
            </p>
            <p>
              📞 Phone:{" "}
              <a
                href="tel:+917079393887"
                className={`hover:underline ${
                  isDark ? "text-blue-400" : "text-blue-600"
                } font-semibold`}
              >
                +91 70793 93887
              </a>
            </p>
            <div
              className={`mt-3 flex items-center justify-center gap-2 font-semibold ${
                isDark ? "text-green-400" : "text-green-600"
              }`}
            >
              <img src="/images/lion.png" className="w-12 h-auto" alt="" />
              <p> A Make in India Initiative</p>
            </div>
          </div>
        </footer>

        {/* Logo */}
        <div className="flex flex-col items-center mt-6">
          <Image
            src="/logos/igm.png"
            width={70}
            height={70}
            alt="IGotMessage"
            className="rounded-2xl border border-[var(--borderColor)] shadow-sm"
          />
          <p className="font-montez text-2xl font-semibold mt-2">IGotMessage</p>
        </div>
      </div>
    </div>
  );
}

export default AboutDevPageComponent;
