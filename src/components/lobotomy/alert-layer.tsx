"use client";
import { useAlertSystem } from "@/hooks/use-alert-system";
import { motion, AnimatePresence } from "framer-motion";

const STYLES = {
  NONE: { color: 'transparent', bg: 'transparent', text: '' },
  FIRST: { color: '#eab308', bg: 'bg-yellow-500', text: 'FIRST TRUMPET' },
  SECOND: { color: '#ef4444', bg: 'bg-red-600', text: 'SECOND TRUMPET' },
  THIRD: { color: '#9333ea', bg: 'bg-purple-600', text: 'THIRD TRUMPET' },
};

export default function AlertLayer() {
  const level = useAlertSystem();

  if (level === 'NONE') return null;

  const style = STYLES[level];

  // The Game uses very wide, bold stripes.
  const stripeGradient = `repeating-linear-gradient(
    45deg,
    ${style.color},
    ${style.color} 40px,
    #000 40px,
    #000 80px
  )`;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      
      {/* 1. THE STRIPED FRAME (Inset slightly to not be cut off) */}
      <div className="absolute inset-0 border-[30px] border-transparent"
        style={{
           borderImageSource: stripeGradient,
           borderImageSlice: 1,
        }}
      />
      
      {/* 2. TOP RIGHT INDICATOR (The Big One) */}
      <div 
        className={`absolute top-0 right-0 w-[300px] h-[300px] ${style.bg}`}
        style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
      >
         {/* Text Container - Rotated to match the angle */}
         <div className="absolute top-8 right-4 text-right transform rotate-45 translate-x-8 translate-y-4">
             <h2 className="text-black font-black text-3xl leading-none uppercase tracking-tighter">
                {style.text.split(" ")[0]}<br/>
                {style.text.split(" ")[1]}
             </h2>
             <div className="text-black font-mono font-bold text-xs tracking-[0.5em] mt-1">EMERGENCY</div>
         </div>
      </div>

      {/* 3. OTHER CORNERS (Small Alerts) */}
      
      {/* Top Left */}
      <div 
        className={`absolute top-0 left-0 w-[150px] h-[150px] ${style.bg}`}
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      >
         <div className="absolute top-4 left-4 text-black font-black text-sm -rotate-45">
            ALERT
         </div>
      </div>

      {/* Bottom Left */}
      <div 
        className={`absolute bottom-0 left-0 w-[150px] h-[150px] ${style.bg}`}
        style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
      >
         <div className="absolute bottom-4 left-4 text-black font-black text-sm rotate-45">
            ALERT
         </div>
      </div>

      {/* Bottom Right */}
      <div 
        className={`absolute bottom-0 right-0 w-[150px] h-[150px] ${style.bg}`}
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
      >
         <div className="absolute bottom-4 right-4 text-black font-black text-sm -rotate-45">
            ALERT
         </div>
      </div>

      {/* 4. PULSING RED OVERLAY (Second/Third only) */}
      {(level === 'SECOND' || level === 'THIRD') && (
        <motion.div 
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-red-600 mix-blend-overlay pointer-events-none"
        />
      )}

    </div>
  );
}