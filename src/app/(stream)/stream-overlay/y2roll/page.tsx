"use client";
import { useState } from "react";
import SerenityAvatar from "@/components/overlay/serenity-avatar";

export default function Y2RollOverlay() {
  const [bgColor, setBgColor] = useState("transparent");

  return (
    <main 
      className="w-[1920px] h-[1080px] relative transition-colors duration-300 overflow-hidden fixed inset-0" // Added fixed inset-0
      style={{ backgroundColor: bgColor }}
    >
      
      {/* LAYER 1 (Bottom): The Static Overlay Base.
         It sits ON TOP of the background color, but UNDER the Avatar.
         Any transparency in this PNG will now show the bgColor.
      */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img 
           src="/assets/overlay/Y2Roll-Overlay-Base.png" 
           alt="Overlay" 
           className="w-full h-full object-cover"
         />
      </div>

      {/* LAYER 2 (Top): The Avatar.
         We pass the controls down so the hover menu still works.
      */}
      <div className="absolute inset-0 z-10">
         <SerenityAvatar bgColor={bgColor} setBgColor={setBgColor} />
      </div>

    </main>
  );
}