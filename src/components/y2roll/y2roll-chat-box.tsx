"use client";
import { useEffect, useRef } from 'react';
import { useTwitchChat } from '@/hooks/use-twitch-chat';

export default function Y2RollChatBox({ channel, className = "" }: { channel: string, className?: string }) {
  const messages = useTwitchChat(channel);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      className={`relative p-1 ${className}`}
    >
      {/* Retro Container Frame */}
      <div className="absolute inset-0 bg-[#1a0b2e]/90 border-4 border-[#6b7280] rounded-xl shadow-[8px_8px_0px_rgba(0,0,0,0.6)] z-0" />
      
      {/* Header Label */}
      <div className="absolute -top-3 left-4 bg-[#6b7280] text-white text-xs font-black px-3 py-1 rounded border-2 border-white/50 shadow-sm z-20">
        CHAT LOG
      </div>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="relative z-10 h-full overflow-y-auto p-4 space-y-3 font-sans"
        style={{ scrollbarWidth: 'none' }}
      >
        <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className="bg-black/40 rounded p-2 border border-white/10 animate-in slide-in-from-bottom-2 fade-in duration-200"
          >
            {/* User */}
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="font-black text-sm drop-shadow-md tracking-wide" 
                style={{ color: msg.color, textShadow: '1px 1px 0 #000' }}
              >
                {msg.user}
              </span>
              {msg.isBroadcaster && <span className="text-[10px] bg-red-500 text-white px-1 rounded font-bold shadow-sm">HOST</span>}
              {msg.isMod && <span className="text-[10px] bg-green-500 text-white px-1 rounded font-bold shadow-sm">MOD</span>}
            </div>
            
            {/* Text (Chunky White Font) */}
            <p className="text-white text-sm font-bold leading-tight drop-shadow-md">
              {msg.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}