"use client";
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function OverlayPage() {
  const [alert, setAlert] = useState<any>(null);
  const [lastId, setLastId] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/alerts');
      const data = await res.json();

      if (data.alert && data.alert.id !== lastId) {
        setAlert(data.alert);
        setLastId(data.alert.id);
        setTimeout(() => setAlert(null), 5000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastId]);

  // HELPER: Determine Content based on Event Type
  const getEventDetails = (type: string) => {
    if (type === 'channel.subscribe' || type === 'Subscription Reward') {
      return {
        label: 'NEW CONTRACT',
        icon: (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
            <path d="M13 19l6-6" />
            <path d="M16 16l4 4" />
            <path d="M19 21l2-2" />
          </svg>
        ), // Trowel/Tool
        message: 'JUST SUBSCRIBED!'
      };
    } 
    
    if (type === 'channel.follow') {
      return {
        label: 'SITE VISITOR',
        icon: (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ), // The "Eye" (Watching construction)
        message: 'JUST FOLLOWED!'
      };
    }

    // Default (Donations/Raids)
    return {
      label: 'SUPPLY DROP',
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      ), // Box
      message: 'SENT RESOURCES'
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
            {/* The Tape */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-[#eab308]/80 rotate-2 shadow-sm z-20 mask-tape" />

            <div className="bg-[#1a1a1a] border-4 border-white p-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative rotate-1">
              <div className="border-2 border-dashed border-[#eab308] p-6 flex items-center gap-8 bg-[url('/assets/noise.png')]">
                
                {/* DYNAMIC CONTENT */}
                {(() => {
                  const details = getEventDetails(alert.type);
                  return (
                    <>
                      <div className="shrink-0 text-[#eab308]">
                        {details.icon}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#eab308] text-black text-xs font-black px-2 py-0.5 uppercase tracking-wider -rotate-1">
                            {details.label}
                          </span>
                        </div>
                        
                        <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none" 
                            style={{ textShadow: '2px 2px 0px #000' }}>
                          <span className="text-[#eab308] underline decoration-wavy decoration-2 underline-offset-4">
                            {alert.user}
                          </span>
                          <span className="ml-3 text-white/90">
                            {details.message}
                          </span>
                        </h1>
                      </div>
                    </>
                  );
                })()}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}