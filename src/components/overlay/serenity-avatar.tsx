"use client";
import { useEffect, useState, useRef } from "react";

const FRAME_SEQUENCE = [1, 2, 3, 4, 3, 2];

// Define the props we expect from the parent page
interface AvatarProps {
  bgColor?: string;
  setBgColor?: (color: string) => void;
}

export default function SerenityAvatar({ bgColor = "transparent", setBgColor }: AvatarProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isTalking, setIsTalking] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  
  // Settings
  const [threshold, setThreshold] = useState(20);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [animSpeed, setAnimSpeed] = useState(80);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const initAudio = async () => {
    if (audioContextRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false } 
      });
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.smoothingTimeConstant = 0.8; 
      analyser.fftSize = 512;
      
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      setAudioStarted(true);
      if (audioContext.state === 'suspended') await audioContext.resume();

    } catch (e) {
      console.error("Mic access denied", e);
    }
  };

  useEffect(() => {
    if (!audioStarted) return;
    const checkVolume = () => {
      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current;
      if (!analyser || !dataArray) return;

      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      const voiceBinCount = Math.floor(dataArray.length * 0.5); 
      for (let i = 0; i < voiceBinCount; i++) { sum += dataArray[i]; }
      const average = sum / voiceBinCount;

      setCurrentVolume(Math.floor(average)); 
      setIsTalking(average > threshold); 
      requestAnimationFrame(checkVolume);
    };
    const handle = requestAnimationFrame(checkVolume);
    return () => cancelAnimationFrame(handle);
  }, [audioStarted, threshold]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((currentIdx) => {
        if (currentIdx === 0) return isTalking ? 1 : 0;
        const nextIdx = (currentIdx + 1) % FRAME_SEQUENCE.length;
        if (nextIdx === 0) return isTalking ? 1 : 0;
        return nextIdx;
      });
    }, animSpeed);
    return () => clearInterval(interval);
  }, [isTalking, animSpeed]);

  const imageSrc = `/assets/avatar/Serenity-${FRAME_SEQUENCE[frameIndex]}.png`;

  return (
    <div className="w-full h-full relative group">
       
       {!audioStarted && (
         <div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 cursor-pointer"
            onClick={initAudio}
         >
            <div className="bg-red-600 text-white font-mono font-bold px-6 py-4 border-4 border-white animate-pulse">
               CLICK TO ENABLE MIC
            </div>
         </div>
       )}

       {/* SETTINGS PANEL (Hover) */}
       {audioStarted && (
         <div className="absolute top-4 left-4 z-50 bg-black/90 border border-white p-4 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto w-64 space-y-4">
            
            {/* Sensitivity & Speed Controls (Same as before) */}
            <div>
              <h3 className="text-white font-mono text-[10px] mb-1 uppercase font-bold text-[#eab308]">
                 Mic Sensitivity (Gate: {threshold})
              </h3>
              <div className="w-full h-3 bg-gray-700 rounded mb-1 relative overflow-hidden">
                 <div className="h-full bg-green-500 transition-all duration-75" style={{ width: `${Math.min(currentVolume, 100)}%` }} />
                 <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10" style={{ left: `${threshold}%` }} />
              </div>
              <input type="range" min="0" max="100" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full accent-[#eab308] cursor-pointer h-2" />
            </div>

            <div>
              <h3 className="text-white font-mono text-[10px] mb-1 uppercase font-bold text-[#eab308]">
                 Anim Speed ({animSpeed}ms)
              </h3>
              <div className="flex items-center gap-2">
                 <span className="text-[9px] text-gray-400">Fast</span>
                 <input type="range" min="30" max="200" step="10" value={animSpeed} onChange={(e) => setAnimSpeed(Number(e.target.value))} className="w-full accent-[#eab308] cursor-pointer h-2" />
                 <span className="text-[9px] text-gray-400">Slow</span>
              </div>
            </div>

            {/* CHROMA KEY CONTROLS (Updated to use setBgColor prop) */}
            {setBgColor && (
              <div>
                 <h3 className="text-white font-mono text-[10px] mb-2 uppercase font-bold text-[#eab308]">
                   Global Background
                 </h3>
                 <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => setBgColor("transparent")} className={`h-6 rounded border ${bgColor === 'transparent' ? 'border-[#eab308]' : 'border-gray-600'} bg-[url('/assets/noise.png')]`} title="Transparent" />
                    <button onClick={() => setBgColor("#00FF00")} className={`h-6 rounded border ${bgColor === '#00FF00' ? 'border-white' : 'border-transparent'} bg-[#00FF00]`} title="Green Screen" />
                    <button onClick={() => setBgColor("#0000FF")} className={`h-6 rounded border ${bgColor === '#0000FF' ? 'border-white' : 'border-transparent'} bg-[#0000FF]`} title="Blue Screen" />
                    <button onClick={() => setBgColor("#FF00FF")} className={`h-6 rounded border ${bgColor === '#FF00FF' ? 'border-white' : 'border-transparent'} bg-[#FF00FF]`} title="Magenta Screen" />
                 </div>
              </div>
            )}
         </div>
       )}

       {/* AVATAR */}
       {/* eslint-disable-next-line @next/next/no-img-element */}
       <img 
        src={imageSrc} 
        alt="Avatar" 
        className="w-full h-full object-cover pointer-events-none"
       />
    </div>
  );
}