"use client";
import { useEffect, useState } from 'react';
import { useTwitchChat } from '@/hooks/use-twitch-chat';
import { motion, AnimatePresence } from 'framer-motion';
import AgentPortrait from './agent-portrait';

// 1. DATA
const DEPARTMENTS = [
  { name: "CONTROL", color: "#D8D556" },   
  { name: "INFO", color: "#81339C" },    
  { name: "TRAINING", color: "#DA7F2F" },  
  { name: "SECURITY", color: "#69A448" },  
  { name: "CENTRAL", color: "#FFC50B" },   
  { name: "DISCIPLINE", color: "#FF0000" },
  { name: "WELFARE", color: "#456FFF" },   
  { name: "EXTRACTION", color: "#2E2E2E" },
  { name: "RECORD", color: "#606060" },    
  { name: "Architecture", color: "#FFFFFF" },   
  
];

// 2. HELPER: Deterministic Generator
const getIdentity = (username: string) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const deptIndex = Math.abs(hash) % DEPARTMENTS.length;
  return { dept: DEPARTMENTS[deptIndex] };
};

export default function LobotomyChatAlerts({ channel, className = "" }: { channel: string, className?: string }) {
  const messages = useTwitchChat(channel);
  const [displayMessages, setDisplayMessages] = useState<any[]>([]);

  // 3. LOGIC: Assign Identity on Arrival
  useEffect(() => {
    if (messages.length > 0) {
      const rawLatest = messages[messages.length - 1];
      
      // Check if it's YOU (Case insensitive)
      const isOwner = rawLatest.user.toLowerCase() === 'aeaeaeaeaa' || rawLatest.user.toLowerCase() === 'aeaeaeaeaeaeaeaea';
      
      let assignedDept;
      let portraitSeed; // The "DNA" string we send to the Portrait Generator

      if (isOwner) {
          // --- RANDOM MODE (For Testing) ---
          // Pick a random department
          assignedDept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
          // Generate a random string so AgentPortrait makes a new face every time
          portraitSeed = rawLatest.user + Math.random().toString(); 
      } else {
          // --- NORMAL MODE (Deterministic) ---
          const identity = getIdentity(rawLatest.user);
          assignedDept = identity.dept;
          // Use actual username so their face stays constant forever
          portraitSeed = rawLatest.user;
      }

      // Merge this data into the message object so it doesn't change on re-renders
      const enrichedLatest = { 
          ...rawLatest, 
          finalDept: assignedDept, 
          portraitSeed: portraitSeed 
      };

      setDisplayMessages(prev => {
        const updated = [...prev, enrichedLatest];
        if (updated.length > 20) updated.shift();
        return updated;
      });
    }
  }, [messages]);

  return (
    <div className={`flex flex-col justify-end gap-2 p-2 overflow-visible relative ${className}`}>
      <AnimatePresence mode='popLayout'>
        {displayMessages.map((msg) => {
          // Use the stored data we generated above
          const dept = msg.finalDept;
          
          const stripePattern = `repeating-linear-gradient(-45deg, ${dept.color}, ${dept.color} 5px, #000 5px, #000 10px)`;

          return (
            <motion.div 
              key={msg.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full shrink-0"
            >
                {/* BORDER CONTAINER */}
                <div 
                  className="w-full relative flex"
                  style={{ 
                    backgroundColor: dept.color,
                    padding: '2px', 
                    clipPath: 'polygon(15px 0, 100% 0, 100% 100%, 0 100%, 0 15px)'
                  }}
                >
                    {/* BLACK BACKGROUND */}
                    <div className="w-full bg-[#111]/95 flex relative min-h-[50px]">
                        
                        {/* LEFT: Text Area */}
                        <div className="flex-1 pl-5 pr-2 py-1 flex flex-col justify-center relative z-10 leading-none">
                            <div className="text-xs leading-tight font-sans drop-shadow-md">
                                <span className="font-bold mr-2 uppercase tracking-tight text-sm" style={{ color: dept.color }}>
                                    {msg.user}
                                    {msg.isMod && <span className="ml-1 text-[8px] bg-white text-black px-1 align-middle">CPT</span>}
                                </span>
                                <span className="text-gray-200 font-medium">{msg.text}</span>
                            </div>
                        </div>

                        {/* RIGHT: Portrait & Stripes */}
                        <div className="w-[60px] relative shrink-0 flex">
                            
                            {/* SVG PORTRAIT */}
                            <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center border-l border-white/10 relative overflow-hidden p-0.5">
                                {/* Use portraitSeed instead of msg.user to allow randomizing */}
                                <AgentPortrait username={msg.portraitSeed} deptColor={dept.color} />
                                <div className="absolute inset-0 bg-black/10 z-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,0.5) 50%)', backgroundSize: '100% 4px' }} />
                            </div>

                            {/* HAZARD STRIPES */}
                            <div 
                                className="w-[12px] h-full"
                                style={{ backgroundImage: stripePattern, borderLeft: `1px solid ${dept.color}` }} 
                            />

                        </div>

                    </div>
                </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}