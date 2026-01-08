"use client";
import { useEffect, useState, useRef } from 'react';

// --- 1. CONFIGURATION ---

// DICTIONARY: Map what it HEARS -> What you WANT it to say
const CORRECTIONS: { [key: string]: string } = {
  // "Misheard Phrase": "Correct Word"
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

// BAN LIST: Bad words to censor
const BANNED_WORDS = [
  "Nigger", 
  "Nigga", 
];

const REPLACEMENT = "[REDACTED]"; 

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function SpeechBubble() {
  const [text, setText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- 2. TEXT PROCESSING LOGIC ---
  const processText = (input: string) => {
    let output = input;

    // A. Apply Corrections (Fix Game Names / Proper Nouns)
    // We sort keys by length (longest first) so we don't accidentally replace parts of words
    Object.keys(CORRECTIONS).sort((a, b) => b.length - a.length).forEach((wrong) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      output = output.replace(regex, CORRECTIONS[wrong]);
    });

    // B. Apply Ban List (Censor Profanity)
    BANNED_WORDS.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      output = output.replace(regex, REPLACEMENT);
    });

    return output;
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn("Browser does not support Speech Logic");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; 
    recognition.interimResults = true; 
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const rawTranscript = event.results[current][0].transcript;
      
      // RUN THE PROCESSOR
      const finalTranscript = processText(rawTranscript);
      
      setText(finalTranscript);
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setText("");
        setDisplayedText("");
      }, 4000);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error", event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognition.start();
    };

    recognition.start();

    return () => recognition.stop();
  }, []);

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, 30); 
      return () => clearTimeout(timeout);
    } else if (text.length < displayedText.length) {
      setDisplayedText(text);
    }
  }, [text, displayedText]);

  if (!text) return null;

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
        <div className="n64-box relative p-6 min-h-[120px] rounded-lg">
            
            <div className="absolute -top-5 left-8 bg-[#eab308] text-black border-2 border-white px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_#000]">
                Serenity
            </div>

            <p className="text-white text-sm md:text-lg leading-loose uppercase drop-shadow-md">
                {displayedText}
                <span className="text-[#eab308] cursor-blink">▼</span>
            </p>
            
            {/* Box Decoration Arrows */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-white"></div>
            <div className="absolute -bottom-[12px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[11px] border-t-[rgba(0,0,100,1)]"></div>

        </div>
    </div>
  );
}