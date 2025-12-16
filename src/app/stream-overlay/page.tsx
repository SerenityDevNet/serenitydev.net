"use client";
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; // "npm install framer-motion" for smooth animations

export default function OverlayPage() {
  const [alert, setAlert] = useState<any>(null);
  const [lastId, setLastId] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/alerts');
      const data = await res.json();

      // Only trigger if it's a NEW alert we haven't shown yet
      if (data.alert && data.alert.id !== lastId) {
        setAlert(data.alert);
        setLastId(data.alert.id);

        // Hide alert after 5 seconds
        setTimeout(() => setAlert(null), 5000);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [lastId]);

  return (
    <div className="h-screen w-screen bg-transparent flex items-end justify-center pb-20 overflow-hidden">
      <AnimatePresence>
        {alert && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="bg-gray-900/90 border-2 border-purple-500 p-6 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center gap-6 max-w-2xl"
          >
            {/* Dynamic Image based on Type */}
            <div className="text-5xl">
              {alert.type === 'Subscription Reward' ? '⚔️' : '🎁'}
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-white font-mono">
                <span className="text-purple-400">{alert.user}</span> just got:
              </h1>
              <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                {alert.item}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}