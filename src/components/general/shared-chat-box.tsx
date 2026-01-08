"use client";
import { useEffect, useRef } from 'react';
import { useSharedChat } from '@/hooks/use-shared-chat';

// Configuration for the "Source Badges"
const CHANNEL_CONFIG: Record<string, { label: string, color: string, border: string }> = {
  'serenity_dev':   { label: 'DEV', color: 'bg-sky-200', border: 'border-sky-200' },
  'ilaiyayaya':     { label: 'AYA', color: 'bg-pink-300', border: 'border-pink-300' },
  'familyneighbor': { label: 'FAM', color: 'bg-violet-600', border: 'border-violet-600' },
};

export default function SharedChatBox({ className = "" }: { className?: string }) {
  const messages = useSharedChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`flex flex-col bg-[#0f0f0f] border-2 border-[#333] rounded-lg overflow-hidden shadow-2xl ${className}`}>
      
      {/* Header */}
      <div className="bg-[#1a1a1a] p-3 border-b border-[#333] flex justify-between items-center">
        <h2 className="text-white font-bold font-sans tracking-wide text-sm uppercase">
          Shared Chat
        </h2>
        <div className="flex gap-2">
            {/* Legend */}
            <div className="w-2 h-2 rounded-full bg-sky-200" title="Serenity" />
            <div className="w-2 h-2 rounded-full bg-pink-300" title="Aya" />
            <div className="w-2 h-2 rounded-full bg-violet-600" title="Family" />
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 font-sans"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 #0f0f0f' }}
      >
        {messages.map((msg) => {
          // Get config for this channel (or default to grey if unknown)
          const config = CHANNEL_CONFIG[msg.sourceChannel] || { label: '???', color: 'bg-gray-500', border: 'border-gray-500' };

          return (
            <div 
              key={msg.id} 
              className="group flex items-start gap-3 animate-in fade-in slide-in-from-left-2 duration-200"
            >
              {/* SOURCE BADGE */}
              <div 
                className={`mt-1 px-1.5 py-0.5 rounded text-[9px] font-black text-black leading-none shrink-0 ${config.color}`}
              >
                {config.label}
              </div>

              {/* MESSAGE BODY */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span 
                    className="font-bold text-sm hover:underline cursor-pointer" 
                    style={{ color: msg.color }}
                  >
                    {msg.user}
                  </span>
                  
                  {/* Twitch Badges (Mod/Host) */}
                  {msg.isBroadcaster && <span className="text-[9px] bg-red-600 text-white px-1 rounded font-bold">BROADCASTER</span>}
                  {msg.isMod && <span className="text-[9px] bg-green-600 text-white px-1 rounded font-bold">MOD</span>}
                </div>

                <p className="text-gray-200 text-sm leading-snug break-words opacity-90 group-hover:opacity-100 transition-opacity">
                  {msg.text}
                </p>
              </div>
            </div>
          );
        })}

        {messages.length === 0 && (
          <div className="text-center text-gray-600 text-xs italic mt-10">
            Waiting for messages...
          </div>
        )}
      </div>
    </div>
  );
}