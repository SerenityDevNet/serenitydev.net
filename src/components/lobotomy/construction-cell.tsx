"use client";
import { motion } from "framer-motion";

export default function ConstructionCell() {
  return (
    <div className="w-full h-full bg-[#0a0a0a] border-2 border-[#ef4444] relative overflow-hidden flex flex-col items-center justify-center p-4">
      
      {/* Hazard Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            #ef4444,
            #ef4444 10px,
            #000 10px,
            #000 20px
          )`
        }}
      />

      {/* The "Closed" Icon */}
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-[#ef4444] text-4xl mb-2 z-10 font-bold"
      >
        ⚠ LOCKED
      </motion.div>

      {/* Text */}
      <div className="z-10 text-center">
         <h3 className="text-[#ef4444] font-black uppercase tracking-widest text-lg">
           R&D DEPT
         </h3>
         <div className="bg-[#ef4444] text-black text-[10px] font-mono font-bold px-2 py-0.5 mt-1 inline-block">
           UNDER CONSTRUCTION
         </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ef4444]" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ef4444]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ef4444]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#ef4444]" />

    </div>
  );
}