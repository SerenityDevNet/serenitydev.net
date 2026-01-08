import SpeechBubble from "@/components/y2roll/y2roll-speech-bubble";

export default function DialogueBox() {
  return (
    <div className="relative w-full h-48 bg-[#0a0a0a]/95 border-t-4 border-[#ef4444] shadow-[0_-5px_20px_rgba(0,0,0,0.8)] flex flex-col justify-center px-8">
      
      {/* Name Tag (Angled) */}
      <div className="absolute -top-10 left-0 bg-[#00bcd4] text-white font-black text-xl px-12 py-2 transform -skew-x-12 origin-bottom-left border-r-4 border-white shadow-lg">
        MANAGER
      </div>

      {/* Decorative Tech Lines */}
      <div className="absolute top-2 right-4 w-32 h-1 bg-[#333]" />
      <div className="absolute top-4 right-4 w-24 h-1 bg-[#333]" />
      
      {/* "SKIP" UI Element */}
      <div className="absolute bottom-4 right-4 text-gray-500 font-mono text-sm flex items-center gap-2">
         <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-gray-500 border-b-[6px] border-b-transparent"></div>
         SKIP
      </div>

      {/* The Actual Speech Bubble Component */}
      {/* We pass a custom class to override the N64 style inside SpeechBubble if we wanted, 
          but for now, the component is hardcoded. Ideally, we'd update SpeechBubble 
          to accept a 'variant' prop. For this quick setup, we just place it inside. */}
      <div className="font-serif text-white text-2xl tracking-wide leading-relaxed drop-shadow-md relative z-10">
         {/* NOTE: Since SpeechBubble has its own styled box, you might want to create a 
            'clean' version of SpeechBubble that just outputs text without the blue box.
            For now, this container acts as the visual frame.
         */}
         <SpeechBubble /> 
      </div>
    </div>
  );
}