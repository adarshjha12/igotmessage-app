import React from "react";
import { Sparkles, MessageSquare, Lightbulb, Code, Bot } from "lucide-react";
import { useUIStore } from "@/store/zustand/chatStore";



// Modern Welcome Component
export default function WelcomeScreen() {
    const {setAiChatSuggestions} = useUIStore();
  const suggestions = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      text: "Explain something complex in simple words",
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      text: "Give me ideas for my next project",
    },
    {
      icon: <Code className="w-5 h-5" />,
      text: "Help me debug my code",
    },
    {
      icon: <Bot className="w-5 h-5" />,
      text: "Generate modern UI components",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-start text-center px-6 sm:pt-1 pb-6">
      {/* Logo Section */}
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>

      <div>
        <p></p>
          <h1 className="text-4xl font-semibold mt-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          👋 Hii! from IGM AI
        </h1>
      </div>
        <p className="text-gray-400 mt-2 text-sm">Powered By MistralAi</p>
        {/* <p className="text-gray-400 mt-2 text-lg">
          I'm here to help. What would you like to do today?
        </p> */}
      </div>

      {/* Suggestions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mt-2">
        {suggestions.map((s, i) => (
          <button
            onClick={() => setAiChatSuggestions(s.text)}
            key={i}
            className="flex items-center gap-3 p-4 w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors text-left"
          >
            <div className="text-indigo-300">{s.icon}</div>
            <span className="text-gray-200 font-medium">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
