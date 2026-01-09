"use client";
import { useEffect, useRef } from 'react';
import { useContainmentProtocol, WorkType } from '@/hooks/use-containment-protocol';
import { useTwitchChat } from '@/hooks/use-twitch-chat'; // Ensure this hook exists!
import { motion } from 'framer-motion';

export default function ContainmentUnit({ className = "" }: { className?: string }) {
  const { abno, peBoxes, lastLog, workingState, activeAgent, processCommand, processReroll } = useContainmentProtocol();
  
  // Connect to Chat
  const messages = useTwitchChat("serenity_dev");
  const processedRef = useRef<string | null>(null); // Track ID of last processed message

  // --- CHAT LISTENER ---
  useEffect(() => {
    if (messages.length === 0) return;

    const latest = messages[messages.length - 1];
    
    // 1. Avoid re-processing same message
    if (latest.id === processedRef.current) return;
    processedRef.current = latest.id;

    // 2. Parse Command
    const text = latest.text.trim().toLowerCase();
    
    if (text === '!reroll') {
        processReroll(latest.user);
        return;
    }

    // Command Map
    const validCommands: Record<string, WorkType> = {
        '!instinct': 'instinct',
        '!insight': 'insight',
        '!attachment': 'attachment',
        '!repression': 'repression',
        // Aliases
        '!red': 'instinct',
        '!white': 'insight',
        '!purple': 'attachment',
        '!blue': 'repression',
        '!cyan': 'repression'
    };

    if (validCommands[text]) {
        processCommand(latest.user, validCommands[text]);
    }

  }, [messages, processCommand, processReroll]);

  // Helper for colors
  const getWorkColor = (type: string) => {
      switch(type) {
          case 'instinct': return 'text-red-500 border-red-500';
          case 'insight': return 'text-white border-white';
          case 'attachment': return 'text-purple-400 border-purple-400';
          case 'repression': return 'text-cyan-400 border-cyan-400';
          default: return 'text-gray-500 border-gray-500';
      }
  };

  return (
    <div className={`flex bg-[#0a0a0a] border-t-4 border-[#333] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] font-mono text-white overflow-hidden ${className}`}>
        
        {/* --- LEFT: ABNO CELL --- */}
        <div className="w-[280px] border-r-4 border-[#333] relative flex flex-col">
            {/* Header */}
            <div className="bg-[#111] p-2 border-b border-[#333] flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-black text-sm border-2 border-white/50 shadow-lg
                        ${abno.risk === 'ZAYIN' ? 'bg-[#22c55e]' : 
                          abno.risk === 'TETH' ? 'bg-[#3b82f6]' : 
                          abno.risk === 'HE' ? 'bg-[#eab308]' : 
                          abno.risk === 'WAW' ? 'bg-[#a855f7]' : 'bg-[#ef4444]'}`
                    }>
                        {abno.risk[0]}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold tracking-widest">{abno.code}</span>
                    </div>
                </div>
                {/* Visual Counter */}
                <div className="bg-[#2a0a0a] text-[#ff4444] border border-[#ff4444] px-2 py-1 text-xs font-black rounded">
                    QLIPHOTH: 3
                </div>
            </div>

            {/* Chamber Visuals */}
            <div className="flex-1 relative flex items-center justify-center bg-[#050505] overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/assets/noise.png')] mix-blend-overlay" />
                
                {/* The "Ghost" */}
                <div className="relative w-32 h-32">
                    <div className="absolute inset-0 blur-2xl opacity-30 animate-pulse" style={{ backgroundColor: abno.image }} />
                    <div className="w-full h-full border-4 border-dashed border-white/10 flex items-center justify-center relative z-10">
                        {workingState ? (
                            <motion.div 
                                initial={{ scale: 0.8, rotate: 0 }}
                                animate={{ scale: 1.1, rotate: 180 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="text-5xl filter drop-shadow-[0_0_10px_white]"
                            >
                                ⚙️
                            </motion.div>
                        ) : (
                            <span className="text-5xl font-black text-white/20">?</span>
                        )}
                    </div>
                </div>

                {/* ACTIVE AGENT OVERLAY (Who is working?) */}
                {activeAgent && (
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute bottom-2 bg-black/80 border border-white/20 px-3 py-1 rounded text-xs text-white"
                    >
                        Agent {activeAgent.name}
                        <div className="flex gap-1 mt-1 h-1 w-full">
                            {/* HP Bar */}
                            <div className="flex-1 bg-gray-800"><div style={{width: `${activeAgent.hp}%`}} className="h-full bg-red-600"/></div>
                            {/* SP Bar */}
                            <div className="flex-1 bg-gray-800"><div style={{width: `${activeAgent.sp}%`}} className="h-full bg-blue-600"/></div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>

        {/* --- CENTER: COMMAND INTERFACE --- */}
        <div className="flex-1 flex flex-col border-r-4 border-[#333] relative">
            <div className="bg-[#151515] p-2 border-b border-[#333] flex items-baseline gap-4">
                <h2 className="text-xl font-black uppercase tracking-tight text-white">{abno.name}</h2>
                <span className="text-xs text-gray-500 uppercase tracking-widest animate-pulse">
                    {workingState ? ">> WORK IN PROGRESS..." : ">> STANDBY"}
                </span>
            </div>

            {/* Work Grid */}
            <div className="flex-1 grid grid-cols-2 grid-rows-2 p-2 gap-2 bg-[#080808]">
                {['instinct', 'insight', 'attachment', 'repression'].map((type) => {
                    const isActive = workingState === type;
                    const colorClass = getWorkColor(type);
                    
                    return (
                        <div key={type} className={`relative border-2 rounded flex items-center px-4 gap-4 transition-all duration-300
                            ${isActive ? `bg-[#222] ${colorClass} opacity-100` : 'border-[#333] opacity-40'}
                        `}>
                            {/* LED */}
                            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-white animate-ping' : 'bg-[#222]'}`} />
                            
                            <div className="flex flex-col">
                                <span className={`font-black uppercase text-lg ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                    {type}
                                </span>
                                <span className="text-[10px] text-gray-600 font-bold">!{type}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* PE BOX BAR */}
            <div className="h-8 bg-[#111] border-t border-[#333] relative flex items-center px-2">
                <span className="text-[#00bcd4] font-black text-xs mr-2 z-10 w-16">PE-BOX</span>
                <div className="flex-1 h-4 bg-[#000] border border-[#333] rounded-sm overflow-hidden relative">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-[#00bcd4] to-[#22d3ee]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(peBoxes / abno.maxPE) * 100}%` }}
                    />
                    <div className="absolute top-0 bottom-0 left-[66%] w-[1px] bg-yellow-500 z-20" />
                </div>
                <span className="text-white font-mono font-bold text-sm ml-2 z-10 w-16 text-right">
                    {peBoxes}/{abno.maxPE}
                </span>
            </div>
        </div>

        {/* --- RIGHT: LOG TERMINAL --- */}
        <div className="w-[300px] bg-black flex flex-col p-2 relative">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 border-b border-[#333] pb-1">
                Log Output
            </span>
            <div className="flex-1 overflow-hidden flex flex-col justify-end gap-1 text-xs font-mono">
                <div className="opacity-30 text-[10px] text-gray-600">Initializing... OK.</div>
                <div className="opacity-30 text-[10px] text-gray-600">Bio-sensors... OK.</div>
                <motion.div 
                    key={lastLog} // Animation trigger
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[#00bcd4] font-bold leading-tight bg-[#111] p-2 border-l-2 border-[#00bcd4]"
                >
                    {lastLog}
                </motion.div>
            </div>
        </div>

    </div>
  );
}