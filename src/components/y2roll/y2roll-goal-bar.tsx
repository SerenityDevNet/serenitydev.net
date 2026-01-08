"use client";
import { motion } from 'framer-motion';
import { useGoalData } from '@/hooks/use-goal-data';

interface GoalProps {
  label: string;
  target: number;
  dataKey: 'followers' | 'subs' | 'bits';
  className?: string;
}

export default function Y2RollGoalBar({ 
  label, 
  target, 
  dataKey, 
  className = ""
}: GoalProps) {
  const current = useGoalData(dataKey);
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className={`flex flex-col gap-1 font-sans ${className}`}>
      
      {/* HUD Header (Like the 'TIME' box) */}
      <div className="bg-[#2d0f4bd9] border-2 border-[#a3a3a3] rounded-t-lg px-3 py-1 flex justify-between items-center shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
        <span className="text-white font-black italic tracking-wider text-sm drop-shadow-[2px_2px_0px_#000]">
          {label}
        </span>
        <span className="text-[#fbbf24] font-black text-lg drop-shadow-[2px_2px_0px_#000]">
          {current}/{target}
        </span>
      </div>

      {/* The Bar (Metallic Container) */}
      <div className="h-6 w-full bg-[#1a1a1a] border-2 border-[#555] rounded-b-lg relative overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
        
        {/* The Fill (Ruby Gradient) */}
        <motion.div 
          className="h-full relative"
          style={{ 
            background: 'linear-gradient(180deg, #ff4d4d 0%, #cc0000 50%, #990000 100%)' 
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Shine effect on the bar */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30" />
        </motion.div>

        {/* Checkerboard Pattern Overlay (Subtle) */}
        <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
                backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)`,
                backgroundSize: '10px 10px',
                backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
            }}
        />
      </div>

    </div>
  );
}