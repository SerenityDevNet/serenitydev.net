"use client";
import { useState } from 'react';

export type WorkType = 'instinct' | 'insight' | 'attachment' | 'repression';

export interface AgentStats {
  name: string;
  hp: number;
  sp: number;
}

const CURRENT_ABNO_VISUALS = {
  name: "Fragment of the Universe",
  code: "O-03-60",
  image: "#00d8ff", 
  risk: "HE",
  maxPE: 100, 
};

export function useContainmentProtocol() {
  const [peBoxes, setPeBoxes] = useState(0);
  const [lastLog, setLastLog] = useState<string>("System initialized. Online.");
  const [workingState, setWorkingState] = useState<WorkType | null>(null);
  const [activeAgent, setActiveAgent] = useState<AgentStats | null>(null);
  
  // --- WORK COMMAND ---
  const processCommand = async (username: string, type: WorkType) => {
    console.log(`[CLIENT] Processing Work: ${username} -> ${type}`); // DEBUG
    if (workingState) return; 
    setWorkingState(type);
    setLastLog(`${username} entered containment...`);

    try {
        const res = await fetch('/api/lobotomy/work', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, workType: type }),
        });
        const data = await res.json();
        
        console.log("[CLIENT] Work Result:", data); // DEBUG

        if (data.agent) {
            setActiveAgent({ name: data.agent.username, hp: data.agent.hp, sp: data.agent.sp });
        }

        await new Promise(r => setTimeout(r, 2000));

        if (!data.success && data.message) {
            setLastLog(`Command Rejected: ${data.message}`);
        } else {
            if (data.peGain > 0) setPeBoxes(prev => Math.min(prev + data.peGain, CURRENT_ABNO_VISUALS.maxPE));
            setLastLog(data.logMessage);
        }
    } catch (e) {
        console.error("[CLIENT] Work Error:", e);
        setLastLog("ERROR: Connection failure.");
    } finally {
        setWorkingState(null);
        setActiveAgent(null);
    }
  };

  // --- REROLL COMMAND ---
  const processReroll = async (username: string) => {
      console.log(`[CLIENT] Attempting Reroll for: ${username}`); // DEBUG
      setLastLog(`Processing genetic restructure for ${username}...`);
      
      try {
          // Verify this path exactly matches your file structure
          const res = await fetch('/api/lobotomy/reroll', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username }),
          });
          
          console.log(`[CLIENT] API Status: ${res.status}`); // DEBUG

          if (!res.ok) {
              const text = await res.text();
              console.error(`[CLIENT] API Error Body:`, text);
              setLastLog(`> Server Error: ${res.status}`);
              return;
          }

          const data = await res.json();
          console.log("[CLIENT] API Data:", data); // DEBUG
          
          if (data.success) {
              setLastLog(`> ${username} re-extraction complete.`);
          } else {
              setLastLog(`> Reroll Denied: ${data.message}`);
          }
      } catch (e) {
          console.error("[CLIENT] Fetch Crash:", e);
          setLastLog("> CRITICAL FAILURE");
      }
  };

  return { 
    abno: CURRENT_ABNO_VISUALS, 
    peBoxes, 
    lastLog, 
    workingState, 
    activeAgent, 
    processCommand,
    processReroll 
  };
}