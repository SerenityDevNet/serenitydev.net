"use client";
import SerenityAvatar from "@/components/y2roll/serenity-avatar";
import Y2RollGoalBar from "@/components/y2roll/y2roll-goal-bar";
import Y2RollChatBox from "@/components/y2roll/y2roll-chat-box";
import Y2RollSpeechBubble from "@/components/y2roll/y2roll-speech-bubble";

export default function Y2RollOverlay() {
  return (
    <main className="w-[1920px] h-[1080px] relative overflow-hidden fixed inset-0 bg-transparent font-sans">
      
      {/* 1. BOTTOM LAYER: The Static Overlay Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img 
           src="/assets/overlay/Y2Roll-Overlay-Base.png" 
           alt="Overlay" 
           className="w-full h-full object-cover"
         />
      </div>

      {/* 2. GOALS (Left Side) */}
      <div className="absolute 
          top-[300px] 
          left-[40px] 
          w-[370px] 
          flex flex-col gap-6 z-20"
      >
         <Y2RollGoalBar label="Followers" target={30} dataKey="followers" />
         <Y2RollGoalBar label="Subscribers" target={5} dataKey="subs" />
      </div>

      {/* 3. CHAT (Right Side) */}
      <div className="absolute 
          top-[38px] 
          right-[38px] 
          w-[380px] 
          h-[600px] 
          z-20"
      >
         <Y2RollChatBox channel="serenitydev" className="w-full h-full" />
      </div>

      {/* 4. SPEECH BUBBLE (Bottom Center) */}
      {/* Positioned to float at the bottom, centered horizontally */}
      <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 w-full max-w-4xl z-30 pointer-events-none">
         <Y2RollSpeechBubble />
      </div>

      {/* 5. AVATAR LAYER */}
      <div className="absolute inset-0 z-10 pointer-events-none">
         <SerenityAvatar />
      </div>

    </main>
  );
}