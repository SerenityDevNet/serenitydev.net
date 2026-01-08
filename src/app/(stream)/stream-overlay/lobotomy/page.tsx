import MonitorFrame from "@/components/lobotomy/monitor-frame";
import SystemPanel from "@/components/lobotomy/system-panel";
import ConstructionCell from "@/components/lobotomy/construction-cell";
import LobotomyChatAlerts from "@/components/lobotomy/lobotomy-chat-alerts"; // <--- NEW IMPORT
import LobotomyGoalBar from "@/components/lobotomy/lobotomy-goal-bar";
import LobotomySpeechBubble from "@/components/lobotomy/lobotomy-speech-bubble";
import AlertLayer from "@/components/lobotomy/alert-layer";

export default function LobotomyOverlay() {
  return (
    <main className="w-[1920px] h-[1080px] bg-transparent relative overflow-hidden font-sans text-white">
      
      {/* MAIN LAYOUT GRID */}
      <div className="absolute inset-0 grid grid-cols-[1520px_400px] grid-rows-[80px_855px_145px]">

        {/* --- 1. HEADER (Top Left) --- */}
        <header className="col-start-1 row-start-1 flex items-center justify-between px-6 border-b-4 border-r-4 border-[#ef4444] bg-[#1a1a1a] z-20">
            <div className="flex items-baseline gap-6 min-w-fit">
                <h1 className="text-5xl font-black text-[#ef4444] uppercase italic tracking-tighter transform -skew-x-12">
                    DAY <span className="text-white">47</span>
                </h1>
                <div className="h-8 w-[2px] bg-[#333]" />
                <div className="text-[#f59e0b] font-mono text-sm uppercase tracking-widest flex flex-col leading-tight">
                    <span>Current Ordeal</span>
                    <span className="text-white font-bold text-lg">VIOLET NOON</span>
                </div>
            </div>

            <div className="flex gap-8 items-center h-full pb-1 pr-4">
                 <LobotomyGoalBar label="QUOTA (FLW)" target={100} dataKey="followers" className="w-[250px]" />
                 <LobotomyGoalBar label="PE-BOXES (SUB)" target={50} dataKey="subs" className="w-[250px]" color="#00bcd4"/>
            </div>
        </header>

        {/* --- 2. GAME WINDOW (Center Left) --- */}
        <section className="col-start-1 row-start-2 relative p-4 z-10">
            <MonitorFrame label="MAIN_CONTAINMENT">
                <div className="w-full h-full bg-transparent" />
            </MonitorFrame>
        </section>

        {/* --- 3. FOOTER ROW (Bottom Left) --- */}
        <footer className="col-start-1 row-start-3 flex">
            <div className="w-[300px] h-full p-2 border-r border-[#333] bg-[#0f0f0f]">
                <ConstructionCell />
            </div>
            <div className="flex-grow relative z-20">
                <div className="w-full h-full">
                   <LobotomySpeechBubble />
                </div>
            </div>
        </footer>

        {/* --- 4. SIDEBAR (Right Column) --- */}
        <aside className="col-start-2 row-start-1 row-span-3 border-l-4 border-[#ef4444] bg-transparent flex flex-col z-30">
            
            {/* CHAT ALERTS (Top Half) - Removed SystemPanel to let alerts float freely */}
            <div className="h-[50%] p-4 flex flex-col justify-end">
                {/* NEW: Replaces the old log box with floating alerts */}
                <LobotomyChatAlerts channel="serenity_dev" className="w-full" />
            </div>

            {/* AVATAR SLOT (Bottom Half) */}
            <div className="h-[50%] relative border-t-2 border-[#333] bg-[#0d0d0d]">
                 <div className="absolute top-2 right-2 text-[#00bcd4] text-[10px] font-mono tracking-widest uppercase z-20">
                    Sephirah Unit: Serenity
                 </div>
                 
                 <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
                     <div className="w-full h-full border-2 border-dashed border-[#00bcd4]/20 flex items-center justify-center opacity-30">
                        <span className="text-[#00bcd4] font-mono text-xs">[AVATAR_FEED_ACTIVE]</span>
                     </div>
                 </div>

                 <div className="absolute bottom-10 left-0 w-full h-[1px] bg-[#00bcd4]/30" />
                 <div className="absolute bottom-12 left-0 w-full h-[1px] bg-[#00bcd4]/10" />
            </div>
        </aside>

      </div>
      
      <AlertLayer />
    </main>
  );
}