"use client";
import { useState, useEffect } from 'react';

export function useGoalData(dataKey: 'followers' | 'subs' | 'bits') {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/goals', { cache: 'no-store' });

        if (!res.ok) {
          console.error(`Goal fetch failed with status: ${res.status}`);
          return;
        }

        const text = await res.text();
        if (!text) {
          console.warn("Goal API returned empty response");
          return;
        }

        const data = JSON.parse(text);
        setCurrent(data[dataKey] || 0);
      } catch (e) {
        console.error("Goal fetch failed:", e);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, [dataKey]);

  return current;
}