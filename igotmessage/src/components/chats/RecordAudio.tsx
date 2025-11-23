import React, { useState, useRef } from "react";
import { Mic, Send, X } from "lucide-react";
import { RecordIcon } from "@phosphor-icons/react";

const AudioRecorderPopup = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);

        chunksRef.current = [];
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("🎙️ Microphone permission denied:", err);
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    console.log("✅ Audio sent:", audioUrl);
    // TODO: send the audioBlob to your backend or chat socket
    setAudioUrl(null);
  };

  const handleClose = () => {
    setAudioUrl(null);
  };

  return (
    <div className="relative flex flex-col items-center justify-center ">
      {/* Record Button */}
      <button
        onClick={handleRecord}
        className={`p-3 rounded-full font-semibold text-white shadow-md transition-all ${
          isRecording
            ? "bg-red-500 animate-pulse"
            : "bg-[#6d28d9] hover:bg-blue-700"
        }`}
      >
        {isRecording ? <RecordIcon size={28}/> : <Mic size={24} />}
      </button>

      {/* 🎧 Audio Preview Popup */}
      {audioUrl && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-lg text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-fadeIn">
          <audio
            controls
            src={audioUrl}
            className="h-8 w-48"
          />

          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition-all flex items-center justify-center shadow-md"
          >
            <Send className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={handleClose}
            className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-all flex items-center justify-center shadow-md"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorderPopup;
