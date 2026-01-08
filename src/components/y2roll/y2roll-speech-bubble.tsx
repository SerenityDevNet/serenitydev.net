"use client";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

export default function Y2RollSpeechBubble() {
  const { text, displayedText } = useSpeechRecognition();

  if (!text) return null;

  return (
    <div className="w-full p-4 flex justify-center">
       {/* Retro Semi-Transparent Box */}
       <div className="relative bg-[#1a0b2e]/90 border-4 border-[#6b7280] rounded-xl shadow-[8px_8px_0px_rgba(0,0,0,0.6)] p-6 min-h-[100px] min-w-[600px] max-w-4xl">
          
          {/* Label */}
          <div className="absolute -top-3 left-6 bg-[#6b7280] text-white text-xs font-black px-3 py-1 rounded border-2 border-white/50 shadow-sm uppercase">
            Serenity
          </div>

          {/* Text */}
          <p className="text-white font-sans font-bold text-xl leading-relaxed drop-shadow-md">
            {displayedText}
          </p>
       </div>
    </div>
  );
}