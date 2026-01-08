"use client";
import { motion } from 'framer-motion';
import { useGoalData } from '@/hooks/use-goal-data'; // Import your new hook

interface GoalProps {
  label: string;
  target: number;
  dataKey: 'followers' | 'subs' | 'bits';
  className?: string;
  color?: string; // Optional override for bar color
}

export default function LobotomyGoalBar({ 
  label, 
  target, 
  dataKey, 
  className = "",
  color = "#f59e0b" // Default Amber
}: GoalProps) {
  const current = useGoalData(dataKey);
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      
      {/* Top Row: Label & Numbers */}
      <div className="flex justify-between items-end text-xs font-mono uppercase tracking-widest text-white/80">
        <span className="font-bold text-[#ef4444]">{label}</span>
        <span>
          <span className="text-white font-bold">{current}</span> 
          <span className="text-white/40"> / {target}</span>
        </span>
      </div>

      {/* The Bar Container */}
      <div className="h-3 w-full bg-[#111] border border-[#333] relative overflow-hidden">
        
        {/* The Fill */}
        <motion.div 
          className="h-full relative"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Scanline Texture inside the bar */}
          <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#000_2px,#000_4px)]" />
        </motion.div>

        {/* Ticks/Grid Lines overlay */}
        <div className="absolute inset-0 flex justify-between px-1">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-full w-[1px] bg-black/20" />
            ))}
        </div>
      </div>

    </div>
  );
}