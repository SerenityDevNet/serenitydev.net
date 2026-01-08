"use client";
import { useState } from "react";

export default function ControlsPage() {
  const [status, setStatus] = useState("NONE");

  const trigger = async (level: string) => {
    try {
      await fetch('/api/status', {
        method: 'POST',
        body: JSON.stringify({ level }),
        headers: { 'Content-Type': 'application/json' }
      });
      setStatus(level);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-8 gap-8">
      
      <h1 className="text-2xl uppercase tracking-widest text-gray-500">
        Emergency Override System
      </h1>

      <div className="grid grid-cols-1 gap-6 w-full max-w-md">
        
        {/* FIRST TRUMPET (Amber) */}
        <button 
          onClick={() => trigger('FIRST')}
          className={`p-8 text-2xl font-black border-4 uppercase tracking-widest transition-all
            ${status === 'FIRST' 
              ? 'bg-[#eab308] text-black border-[#eab308] shadow-[0_0_30px_#eab308]' 
              : 'bg-transparent text-[#eab308] border-[#eab308] hover:bg-[#eab308]/20'
            }`}
        >
          First Trumpet
        </button>

        {/* SECOND TRUMPET (Red) */}
        <button 
          onClick={() => trigger('SECOND')}
          className={`p-8 text-2xl font-black border-4 uppercase tracking-widest transition-all
            ${status === 'SECOND' 
              ? 'bg-[#ef4444] text-black border-[#ef4444] shadow-[0_0_30px_#ef4444]' 
              : 'bg-transparent text-[#ef4444] border-[#ef4444] hover:bg-[#ef4444]/20'
            }`}
        >
          Second Trumpet
        </button>

        {/* THIRD TRUMPET (Violet) */}
        <button 
          onClick={() => trigger('THIRD')}
          className={`p-8 text-2xl font-black border-4 uppercase tracking-widest transition-all
            ${status === 'THIRD' 
              ? 'bg-[#9333ea] text-black border-[#9333ea] shadow-[0_0_30px_#9333ea]' 
              : 'bg-transparent text-[#9333ea] border-[#9333ea] hover:bg-[#9333ea]/20'
            }`}
        >
          Third Trumpet
        </button>

        {/* RESET (Gray) */}
        <button 
          onClick={() => trigger('NONE')}
          className="mt-8 p-4 text-xl font-bold bg-[#333] border-4 border-[#555] text-gray-400 uppercase tracking-widest hover:bg-[#444] hover:text-white"
        >
          All Clear (Reset)
        </button>

      </div>
    </main>
  );
}