"use client";
import { useState, useEffect } from 'react';

// Possible States
export type AlertLevel = 'NONE' | 'FIRST' | 'SECOND' | 'THIRD';

export function useAlertSystem() {
  const [level, setLevel] = useState<AlertLevel>('NONE');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // We will build this API endpoint next
        const res = await fetch('/api/status'); 
        const data = await res.json();
        setLevel(data.level);
      } catch (e) {
        // console.error(e); 
      }
    };

    // Poll every 1 second
    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return level;
}