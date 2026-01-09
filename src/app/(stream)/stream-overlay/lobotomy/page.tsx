"use client";
import MonitorFrame from "@/components/lobotomy/monitor-frame";
import LobotomyChatAlerts from "@/components/lobotomy/lobotomy-chat-alerts";
import LobotomyGoalBar from "@/components/lobotomy/lobotomy-goal-bar";
import ContainmentUnit from "@/components/lobotomy/containment-unit";
import AlertLayer from "@/components/lobotomy/alert-layer";

export default function LobotomyOverlay() {
  return (
    <main className="w-[1920px] h-[1080px] bg-transparent relative overflow-hidden font-sans text-white">
      
      {/* GRID LAYOUT 
        Cols: [Main Area (Flexible)] [Sidebar (380px)]
        Rows: [Header (60px)] [Game (Flexible)] [Containment Dashboard (240px)]
      */}
      <div className="absolute inset-0 grid grid-cols-[1fr_380px] grid-rows-[60px_1fr_240px]">

        {/* --- 1. HEADER --- */}
        <header className="col-span-2 row-start-1 bg-[#1a1a1a] border-b-4 border-[#ef4444] flex items-center justify-between px-6 z-20">
             <div className="flex items-baseline gap-4">
                <h1 className="text-4xl font-black text-[#ef4444] uppercase italic tracking-tighter">
                    DAY <span className="text-white">49</span>
                </h1>
                <span className="text-[#f59e0b] font-mono font-bold tracking-widest text-sm">
                    // ORDEAL: VIOLET MIDNIGHT
                </span>
             </div>

             <div className="flex gap-6 h-3/4 items-center">
                 <LobotomyGoalBar label="QUOTA" target={100} dataKey="followers" className="w-[200px]" />
                 <LobotomyGoalBar label="PE-BOX" target={50} dataKey="subs" className="w-[200px]" color="#00bcd4" />
             </div>
        </header>

        {/* --- 2. GAME WINDOW (Top Left) --- */}
        <section className="col-start-1 row-start-2 relative z-10 border-r-4 border-[#333]">
            {/* Transparent Hole for OBS - Watermark Removed */}
            <div className="w-full h-full border-4 border-dashed border-[#ef4444]/20 box-border"></div>
        </section>

        {/* --- 3. SIDEBAR (Right Column) --- */}
        <aside className="col-start-2 row-start-2 row-span-2 bg-[#111] border-l-4 border-[#ef4444] flex flex-col z-30 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
            
            {/* CHAT ALERTS */}
            <div className="flex-1 p-2 bg-[#0d0d0d] overflow-hidden relative flex flex-col">
                <LobotomyChatAlerts channel="serenity_dev" className="h-full w-full" />
                {/* Gradient Fade at top */}
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#0d0d0d] to-transparent pointer-events-none" />
            </div>

            {/* AVATAR FEED */}
            <div className="h-[380px] border-t-4 border-[#333] bg-[#0a0a0a] relative shrink-0">
                 <div className="absolute top-2 right-2 text-[#00bcd4] text-[10px] font-mono tracking-widest uppercase z-20">
                    Sephirah: Serenity
                 </div>
                 {/* This is where your VTuber/Avatar source goes in OBS */}
                 <div className="w-full h-full flex items-center justify-center opacity-20 font-mono text-xs">
                    [AVATAR SIGNAL LOST]
                 </div>
                 {/* Tech decorative lines */}
                 <div className="absolute bottom-10 left-0 w-full h-[1px] bg-[#00bcd4]/30" />
                 <div className="absolute bottom-12 left-0 w-full h-[1px] bg-[#00bcd4]/10" />
            </div>
        </aside>

        {/* --- 4. BOTTOM DASHBOARD: CONTAINMENT UNIT --- */}
        <footer className="col-start-1 row-start-3 bg-[#050505] relative z-20">
            {/* The Unit takes up the full bottom-left width */}
            <ContainmentUnit className="w-full h-full" />
        </footer>

      </div>
      
      <AlertLayer />
    </main>
  );
}