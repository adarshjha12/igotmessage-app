"use client";

import React from "react";
import { ShieldCheck, Heart, MessageSquare, Ban } from "lucide-react";

export default function CommunityGuidelines() {
  return (
    <div
      style={{
        backgroundColor: "var(--bgColor)",
        color: "var(--textColor)",
      }}
      className="min-h-screen w-full flex flex-col items-center py-12 px-6 sm:px-10 md:px-20 lg:px-32"
    >
      <div className="max-w-4xl w-full text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Community Guidelines</h1>
        <p className="text-lg opacity-80">
          Welcome to our community! We want to create a friendly, inclusive, and inspiring space for everyone. Our guidelines are designed to make sure every member feels safe, valued, and respected while using our app for chatting, posting, or making video calls.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="rounded-2xl shadow-lg p-8 bg-[var(--cardBg)]/60 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-7 h-7 text-green-500" />
            <h2 className="text-xl font-semibold">1. Stay Respectful</h2>
          </div>
          <p className="opacity-80">
            Respect is the foundation of our community. We expect all users to communicate kindly and respectfully with others. Any form of hate speech, harassment, discrimination, or bullying is strictly prohibited. Remember that behind every profile is a real person with feelings—be mindful of your words and actions. Violations may result in warnings, temporary suspension, or permanent removal from the platform.
          </p>
        </div>

        <div className="rounded-2xl shadow-lg p-8 bg-[var(--cardBg)]/60 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-7 h-7 text-blue-500" />
            <h2 className="text-xl font-semibold">2. Communicate Thoughtfully</h2>
          </div>
          <p className="opacity-80">
            Whether you’re in a private chat or a public post, use language that promotes understanding and positivity. Avoid spamming, trolling, or flooding chats with repetitive content. Constructive discussions and friendly debates are welcome, but personal attacks, false information, or manipulation of other users are not. Always strive to make the platform a space people enjoy returning to.
          </p>
        </div>

        <div className="rounded-2xl shadow-lg p-8 bg-[var(--cardBg)]/60 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-7 h-7 text-pink-500" />
            <h2 className="text-xl font-semibold">3. Share Responsibly</h2>
          </div>
          <p className="opacity-80">
            Share only content that is your own or that you have rights to post. Refrain from sharing NSFW (not safe for work), violent, or illegal material. Protect your privacy and that of others—never share private messages, images, or personal information without consent. Be a responsible creator and contribute to making our platform a positive and creative space for all.
          </p>
        </div>

        <div className="rounded-2xl shadow-lg p-8 bg-[var(--cardBg)]/60 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <Ban className="w-7 h-7 text-red-500" />
            <h2 className="text-xl font-semibold">4. Zero Tolerance for Abuse</h2>
          </div>
          <p className="opacity-80">
            We have a strict zero-tolerance policy for any form of abuse, exploitation, or impersonation. Users found engaging in malicious activities, such as scamming, doxxing, or spreading harmful content, will face immediate action. Our moderation team actively reviews reports to ensure community safety. Together, we can create a respectful and secure digital environment.
          </p>
        </div>
      </div>

      <div className="max-w-3xl text-center mt-12 opacity-90">
        <p>
          By using our app, you agree to abide by these guidelines. Let’s work together to maintain a space where creativity, connection, and kindness can thrive. Thank you for being a valued part of our community.
        </p>
      </div>
    </div>
  );
}