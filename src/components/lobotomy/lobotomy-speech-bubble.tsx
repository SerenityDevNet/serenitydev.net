"use client";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

export default function LobotomySpeechBubble() {
  const { text, displayedText } = useSpeechRecognition();

  // For Lobotomy, we often want the box to stay visible even if empty (for layout structure),
  // but if you want it to hide, uncomment the next line:
  // if (!text) return null; 

  return (
    <div className="relative w-full h-full bg-[#0a0a0a]/95 border-t-4 border-[#ef4444] shadow-[0_-5px_20px_rgba(0,0,0,0.8)] flex flex-col justify-center px-12 py-6">
      
      {/* Name Tag (Angled) */}
      <div className="absolute -top-10 left-0 bg-[#00bcd4] text-white font-black text-xl px-12 py-2 transform -skew-x-12 origin-bottom-left border-r-4 border-white shadow-lg">
        MANAGER
      </div>

      {/* Text Area */}
      <p className="font-serif text-white text-2xl tracking-wide leading-relaxed drop-shadow-md relative z-10 min-h-[3rem]">
         {displayedText}
         {text && <span className="inline-block w-3 h-6 bg-[#ef4444] ml-2 animate-pulse align-middle" />}
      </p>

      {/* Decorative Tech Lines */}
      <div className="absolute top-2 right-4 w-32 h-1 bg-[#333]" />
      <div className="absolute top-4 right-4 w-24 h-1 bg-[#333]" />
      
      {/* "SKIP" UI Element (Cosmetic) */}
      <div className="absolute bottom-4 right-4 text-gray-500 font-mono text-sm flex items-center gap-2 opacity-50">
         <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-gray-500 border-b-[6px] border-b-transparent"></div>
         SKIP
      </div>
    </div>
  );
}