"use client";
import { useEffect, useRef } from 'react';
import { useTwitchChat } from '@/hooks/use-twitch-chat';

export default function LobotomyChatBox({ channel, className = "" }: { channel: string, className?: string }) {
  const messages = useTwitchChat(channel);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      // Added 'scrollbar-width: none' via inline style for Firefox compatibility
      // Added webkit style block for Chrome/Safari
      className={`font-mono text-sm overflow-y-auto overflow-x-hidden p-2 ${className}`}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="flex flex-col gap-1">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className="group flex items-start gap-2 border-b border-[#333]/50 pb-1 mb-1 animate-in fade-in duration-200"
          >
            <span className="text-[#333] mt-0.5 select-none text-[10px]">▶</span>

            <div className="flex-1 break-words leading-tight">
              <span className="mr-2 opacity-90 text-xs font-bold" style={{ color: msg.color }}>
                {msg.user}
                {msg.isBroadcaster && <span className="ml-1 text-[9px] bg-[#ef4444] text-black px-1 font-bold">MGR</span>}
                {msg.isMod && <span className="ml-1 text-[9px] bg-[#00bcd4] text-black px-1 font-bold">CPT</span>}
              </span>

              <span className="text-[#e5e5e5] text-xs">
                {msg.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}