"use client";
import { useEffect, useState, useRef } from "react";

const FRAME_SEQUENCE = [1, 2, 3, 4, 3, 2];

export default function SerenityAvatar() {
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

  // 1. INITIALIZATION LOGIC
  const initAudio = async () => {
    // If we already have a context, just ensure it's running
    if (audioContextRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      setAudioStarted(true);
      return;
    }

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

    } catch (e) {
      console.error("Mic access denied", e);
      alert("Microphone access denied! Check browser settings.");
    }
  };

  // 2. AUTO-START ATTEMPT (For OBS with flags)
  useEffect(() => {
    // Try to start immediately on load. 
    // This often works in OBS if the flag is set, but fails in normal Chrome.
    const attemptAutoStart = async () => {
        try {
            await initAudio();
        } catch (e) {
            // If it fails, we just wait for the user click
        }
    };
    attemptAutoStart();
  }, []);

  // 3. VOLUME CHECK LOOP
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

  // 4. ANIMATION LOOP
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
       
       {/* CLICK OVERLAY - Now z-50 and covers everything to catch clicks */}
       {!audioStarted && (
         <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 cursor-pointer"
            onClick={initAudio}
         >
            <div className="bg-red-600 text-white font-mono font-bold px-8 py-6 border-4 border-white animate-pulse text-2xl shadow-[0_0_50px_rgba(255,0,0,0.5)]">
               CLICK ANYWHERE TO START MIC
            </div>
         </div>
       )}

       {/* SETTINGS PANEL */}
       {audioStarted && (
         <div className="absolute top-4 left-4 z-[9999] bg-black/90 border border-white p-4 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto w-64 space-y-4">
            
            {/* Sensitivity */}
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

            {/* Speed */}
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

         </div>
       )}

       {/* AVATAR IMAGE */}
       {/* eslint-disable-next-line @next/next/no-img-element */}
       <img 
        src={imageSrc} 
        alt="Avatar" 
        className="w-full h-full object-cover pointer-events-none"
       />
    </div>
  );
}