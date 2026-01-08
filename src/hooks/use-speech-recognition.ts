"use client";
import { useState, useEffect, useRef } from 'react';

// --- CONFIGURATION ---
const CORRECTIONS: { [key: string]: string } = {
  "Mesmalai": "Mesmalie",
  "Mesmalli": "Mesmalie",
  "Mesmelee": "Mesmalie",
  "Mesmele": "Mesmalie",
  "Mesmallow": "Mesmalie",
  "Mismallah": "Mesmalie",
  "Mesemali": "Mesmalie",
  "Mesmline": "Mesmalie",
  "Mesmalade": "Mesmalie",
  "Mismally": "Mesmalie",
  "Ms Mali": "Mesmalie",
  "Ms Malik": "Mesmalie",
  "Miss Molly": "Mesmalie",
  "Mesally": "Mesmalie",
  "Messmer": "Mesmer",
  "serenity dev": "SerenityDev",
  "serenity death": "SerenityDev",
  "toy maker": "Toymaker",
  "Raparia": "Reparia",
  "Riparia": "Reparia",
  "Misika": "Misaka",
  "Misaco": "Misaka",
  "Ava Beatrice": "EVA-BEATRICE",
  "Eva Beatrice": "EVA-BEATRICE",
  "Ever Beatrice": "EVA-BEATRICE",
  "Uminoco": "Umineko",
  "Umi neko": "Umineko",
  "Musso": "Musou",
  "Muso": "Musou",
  "Y2 Role": "Y2Roll",
  "Y2 Roll": "Y2Roll",
  "Y2 Rule": "Y2Roll",
  "Why To Roll": "Y2Roll",
  "Why To Role": "Y2Roll",
  "Why Two Roll": "Y2Roll",
  "Why Two Role": "Y2Roll",
  "Speed Run": "Speedrun",
  "Speed Running": "Speedrunning",
  "Dilla": "'Dilla",
  "Dill": "'Dilla",
  "Dila": "'Dilla",
};

const BANNED_WORDS = [
  "Nigger", 
  "Nigga", 
];

const REPLACEMENT = "[REDACTED]"; 

export function useSpeechRecognition() {
  const [text, setText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Text Processor
  const processText = (input: string) => {
    let output = input;

    // A. Corrections
    Object.keys(CORRECTIONS).sort((a, b) => b.length - a.length).forEach((wrong) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      output = output.replace(regex, CORRECTIONS[wrong]);
    });

    // B. Bans
    BANNED_WORDS.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      output = output.replace(regex, REPLACEMENT);
    });

    return output;
  };

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true; 
    recognition.interimResults = true; 
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const rawTranscript = event.results[current][0].transcript;
      const finalTranscript = processText(rawTranscript);
      
      setText(finalTranscript);
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setText("");
        setDisplayedText("");
      }, 4000); // Clear after 4s silence
    };

    recognition.onend = () => recognition.start(); // Auto-restart
    recognition.start();

    return () => recognition.stop();
  }, []);

  // Typewriter Effect Logic
  useEffect(() => {
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, 30); 
      return () => clearTimeout(timeout);
    } else if (text.length < displayedText.length) {
      setDisplayedText(text); // Reset if new text is shorter (new sentence)
    }
  }, [text, displayedText]);

  return { text, displayedText };
}