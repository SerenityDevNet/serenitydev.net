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
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. INITIALIZATION LOGIC
  const initAudio = async () => {
    // If running, do nothing
    if (audioStarted) return;

    // If context exists but suspended, try to resume
    if (audioContextRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        try {
            await audioContextRef.current.resume();
            setAudioStarted(true);
        } catch (e) {
            // Resume failed, waiting for user interaction
        }
      } else if (audioContextRef.current.state === 'running') {
          setAudioStarted(true);
      }
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
      console.error("Mic access denied or pending interaction", e);
    }
  };

  // 2. AGGRESSIVE AUTO-START LOOP
  // This tries to start the audio engine every 1 second until it works.
  // This solves the issue where OBS loads the page before the audio device is ready.
  useEffect(() => {
    const attemptStart = () => {
        if (!audioStarted) {
            initAudio();
        }
    };

    // Try immediately
    attemptStart();

    // Retry every second
    const interval = setInterval(attemptStart, 1000);

    return () => clearInterval(interval);
  }, [audioStarted]);

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
       
       {/* INVISIBLE CLICK LAYER 
          We removed the red background and text. 
          It is now invisible (opacity-0) but still covers the screen (fixed inset-0).
          If auto-start fails, you can Right Click Source -> Interact -> Click Anywhere to fix it,
          but your viewers won't see a giant error box.
       */}
       {!audioStarted && (
         <div 
            className="fixed inset-0 z-[9999] cursor-pointer opacity-0"
            onClick={initAudio}
            title="Click to start audio"
         />
       )}

       {/* SETTINGS PANEL (Only visible on hover + audio started) */}
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