"use client";
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function OverlayPage() {
  const [alert, setAlert] = useState<any>(null);
  const [lastId, setLastId] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/alerts');
        const data = await res.json();

        // Check if new alert exists
        if (data.alert && data.alert.id !== lastId) {
          setAlert(data.alert);
          setLastId(data.alert.id);
          
          // Duration: Raids stay longer (7s), others 5s
          const duration = data.alert.type === 'channel.raid' ? 7000 : 5000;
          setTimeout(() => setAlert(null), duration);
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastId]);

  // HELPER: Determine Content based on Event Type
  const getEventDetails = (data: any) => {
    const type = data.type;

    // 1. RAIDS (The "Work Crew")
    if (type === 'channel.raid') {
      return {
        label: 'SITE MERGER',
        color: '#ef4444', // Red (Urgent)
        icon: (
          // Crane Hook / Wrecking Ball Vibe
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v14" />
            <path d="m17 11-5 5-5-5" />
            <circle cx="12" cy="19" r="2" />
            <path d="M2 22h20" />
          </svg>
        ),
        // "User brought X workers"
        message: (
          <>
            BROUGHT <span className="text-red-500 font-bold">{data.viewers || 'A'}</span> WORKERS
          </>
        )
      };
    }

    // 2. CHEERS / BITS (The "Materials")
    if (type === 'channel.cheer') {
      return {
        label: 'RAW MATERIALS',
        color: '#06b6d4', // Cyan
        icon: (
          // Hex Nut / Bolt
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z" />
            <circle cx="12" cy="11" r="3" />
          </svg>
        ),
        message: (
          <>
            DELIVERED <span className="text-cyan-400 font-bold">{data.bits || '0'}</span> UNITS
          </>
        )
      };
    }

    // 3. CHANNEL POINTS (The "Change Order")
    if (type === 'channel.channel_points_custom_reward_redemption.add') {
      return {
        label: 'CHANGE ORDER',
        color: '#22c55e', // Green
        icon: (
          // Clipboard
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            <path d="M9 12h6" />
            <path d="M9 16h6" />
          </svg>
        ),
        message: (
          <span className="text-green-400">
            "{data.rewardName || 'REDEEMED'}"
          </span>
        )
      };
    }

    // 4. FOLLOW (The "Visitor")
    if (type === 'channel.follow') {
      return {
        label: 'SITE VISITOR',
        color: '#ffffff', // White
        icon: (
          // Eye
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ),
        message: 'JUST FOLLOWED!'
      };
    }

    // 5. SUBSCRIPTION (The "Contract") - Default Fallback
    return {
      label: 'NEW CONTRACT',
      color: '#eab308', // Yellow
      icon: (
        // Trowel / Tool
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
          <path d="M13 19l6-6" />
          <path d="M16 16l4 4" />
          <path d="M19 21l2-2" />
        </svg>
      ),
      message: 'JUST SUBSCRIBED!'
    };
  };

  return (
    <div className="h-full w-full bg-transparent flex items-end justify-center pb-20 overflow-hidden font-mono">
      <AnimatePresence mode='wait'>
        {alert && (
          <motion.div 
            initial={{ y: 200, rotate: -5, scale: 0.8, opacity: 0 }}
            animate={{ 
              y: 0, 
              rotate: Math.random() * 4 - 2,
              scale: 1, 
              opacity: 1,
              transition: { type: "spring", stiffness: 300, damping: 15 } 
            }}
            exit={{ y: 200, rotate: 10, opacity: 0, transition: { duration: 0.3 } }}
            className="relative max-w-3xl w-full mx-4"
          >
            
            {/* DYNAMIC CONTENT GENERATION */}
            {(() => {
              const details = getEventDetails(alert);
              const accentColor = details.color;

              return (
                <>
                  {/* The Tape (Uses Accent Color) */}
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 rotate-2 shadow-sm z-20 mask-tape flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <span className="text-[10px] font-black text-black/50">NOTICE</span>
                  </div>

                  <div className="bg-[#1a1a1a] border-4 border-white p-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative rotate-1">
                    <div 
                      className="border-2 border-dashed p-6 flex items-center gap-8 bg-[url('/assets/noise.png')]"
                      style={{ borderColor: accentColor }}
                    >
                      
                      {/* ICON */}
                      <div className="shrink-0 drop-shadow-md" style={{ color: accentColor }}>
                        {details.icon}
                      </div>

                      {/* TEXT CONTENT */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-black text-xs font-black px-2 py-0.5 uppercase tracking-wider -rotate-1"
                            style={{ backgroundColor: accentColor }}
                          >
                            {details.label}
                          </span>
                        </div>
                        
                        <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none" 
                            style={{ textShadow: '2px 2px 0px #000' }}>
                          <span 
                            className="underline decoration-wavy decoration-2 underline-offset-4"
                            style={{ color: accentColor }}
                          >
                            {alert.user}
                          </span>
                          <span className="ml-3 text-white/90">
                            {details.message}
                          </span>
                        </h1>
                      </div>

                    </div>
                  </div>
                </>
              );
            })()}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}