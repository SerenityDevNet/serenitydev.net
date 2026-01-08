export default function MonitorFrame({ children, label = "CAM-2B" }: { children: React.ReactNode, label?: string }) {
  return (
    // CHANGED: bg-black -> bg-transparent
    <div className="relative w-full h-full bg-transparent border-2 border-[#333] shadow-2xl">
      
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#ef4444] z-20" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#ef4444] z-20" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#ef4444] z-20" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#ef4444] z-20" />

      {/* Label Tag */}
      <div className="absolute top-0 left-10 bg-[#ef4444] text-black font-bold font-mono px-3 py-1 text-xs z-20">
        {label}
      </div>

      {/* REC Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_#ff0000]" />
        <span className="text-red-600 font-mono text-xs tracking-widest">LIVE FEED</span>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full overflow-hidden">
        {children}
        
        {/* Scanline Overlay - We keep this! It adds a cool "CRT" texture ON TOP of your game */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
      </div>
    </div>
  );
}