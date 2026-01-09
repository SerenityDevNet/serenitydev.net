"use client";
import SerenityAvatar from "@/components/y2roll/serenity-avatar";
import Y2RollGoalBar from "@/components/y2roll/y2roll-goal-bar";
import Y2RollChatBox from "@/components/y2roll/y2roll-chat-box";
// import Y2RollSpeechBubble from "@/components/y2roll/y2roll-speech-bubble"; 

export default function Y2RollOverlay() {
  return (
    <main className="w-[1920px] h-[1080px] fixed inset-0 font-sans bg-[#11051B]">
      
      {/* 1. BACKGROUND PATTERN */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #000 25%, transparent 25%), 
            linear-gradient(-45deg, #000 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #000 75%), 
            linear-gradient(-45deg, transparent 75%, #000 75%)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
        }}
      />

      {/* 2. MAIN LAYOUT (3 Independent Columns) */}
      <div className="relative z-10 w-full h-full flex gap-4 p-6">

        {/* --- LEFT COLUMN (Fixed Width 350px) --- */}
        <div className="w-[350px] flex flex-col gap-4 h-full">
            
            {/* GOALS (Fills remaining top space) */}
            <div className="flex-1 bg-[#1a0b2e]/95 border-4 border-[#555] rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] p-4 relative overflow-hidden flex flex-col gap-4 min-h-0">
                <h2 className="font-black text-xl text-[#fbbf24] uppercase tracking-widest border-b-2 border-[#555] pb-2 mb-2">
                    GOALS
                </h2>
                <Y2RollGoalBar label="FOLLOWERS" target={30} dataKey="followers" />
                <Y2RollGoalBar label="SUBSCRIBERS" target={5} dataKey="subs" />
                <Y2RollGoalBar label="BITS" target={1000} dataKey="bits" />
                
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none" />
            </div>

            {/* BOTTOM LEFT: UNDER CONSTRUCTION (Fixed 350px Height -> Square) */}
            <div className="h-[350px] shrink-0 bg-[#1a0b2e] border-4 border-[#555] rounded-lg flex items-center justify-center relative overflow-hidden p-2">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img 
                   src="/assets/overlay/under-const-placeholder.png" 
                   alt="Under Construction" 
                   className="h-full w-auto mx-auto object-contain opacity-90" 
                 />
            </div>
        </div>

        {/* --- CENTER COLUMN (Flexible Width) --- */}
        <div className="flex-1 flex flex-col gap-4 h-full">
            
            {/* GAME CAPTURE ZONE (Fills remaining top space - Taller than sides) */}
            <div className="flex-1 flex items-center justify-center relative min-h-0">
                {/* 4:3 Aspect Ratio Container */}
                <div className="aspect-[4/3] h-full max-h-full border-4 border-dashed border-[#ffffff20] rounded-lg flex items-center justify-center bg-black/20 w-auto max-w-full">
                    <span className="text-white/10 font-black text-4xl uppercase">Game Capture Zone (4:3)</span>
                </div>
            </div>

            {/* BOTTOM CENTER BAR (Fixed 250px Height - Shorter than corners) */}
            <div className="h-[250px] shrink-0 bg-[#2d0f4bd9] border-4 border-[#555] rounded-lg shadow-[0_0_20px_rgba(163,163,163,0.3)] relative overflow-visible flex items-center justify-center">
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 10px, transparent 10px, transparent 20px)' }} />
                 
                 {/* SPEECH BUBBLE PLACEHOLDER 
                 <div className="absolute bottom-full mb-4 w-[90%] z-50 pointer-events-none flex justify-center">
                    <Y2RollSpeechBubble />
                 </div> 
                 */}
            </div>
        </div>

        {/* --- RIGHT COLUMN (Fixed Width 350px) --- */}
        <div className="w-[350px] flex flex-col gap-4 h-full">
            
            {/* CHAT (Fills remaining top space) */}
            <div className="flex-1 bg-[#1a0b2e]/95 border-4 border-[#555] rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden min-h-0">
                 <div className="absolute inset-0 p-2">
                    <Y2RollChatBox channel="serenity_dev" className="w-full h-full" />
                 </div>
            </div>

            {/* BOTTOM RIGHT: AVATAR (Fixed 350px Height -> Square) */}
            <div className="h-[350px] shrink-0 bg-[#1a0b2e] border-4 border-[#555] rounded-lg flex items-end justify-center relative overflow-hidden">
                 <div className="w-full h-full relative">
                     <SerenityAvatar />
                 </div>
            </div>
        </div>

      </div>
    </main>
  );
}