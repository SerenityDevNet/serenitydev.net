"use client";
import { useMemo } from 'react';

// --- ASSET DEFINITIONS (Simple SVG Shapes) ---

const HAIR_COLORS = [
  '#2a2a2a', // Black
  '#5e4b3c', // Brown
  '#a88f7a', // Light Brown
  '#c9c9c9', // Grey/White
  '#e5c76b', // Blonde
  '#8b2e2e', // Redhead
  '#3a5278', // Dark Blue
];

const EYE_COLORS = ['#333', '#3b82f6', '#22c55e', '#a855f7', '#ef4444'];

// Simple paths/shapes for variety
const HAIR_STYLES = [
  // 0: Short & Neat
  { back: <circle cx="25" cy="25" r="18" />, front: <path d="M15,15 Q25,25 35,15" fill="none" strokeWidth="4" strokeLinecap="round" /> },
  // 1: Spiky/Messy
  { back: <polygon points="10,20 25,5 40,20 35,40 15,40" />, front: <path d="M18,12 L25,18 L32,12" fill="none" strokeWidth="3" /> },
  // 2: Bob/Longer
  { back: <rect x="10" y="15" width="30" height="30" rx="5" />, front: <rect x="15" y="12" width="20" height="10" rx="2" /> },
  // 3: Bald/Buzz (Empty shapes)
  { back: null, front: null },
];

const EXPRESSIONS = [
  // Neutral
  <path d="M20,38 L30,38" stroke="#333" strokeWidth="2" strokeLinecap="round" />,
  // Smile
  <path d="M20,38 Q25,42 30,38" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />,
  // Frown
  <path d="M20,40 Q25,36 30,40" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />,
  // Small O
  <circle cx="25" cy="39" r="2" fill="none" stroke="#333" strokeWidth="2" />,
];

// --- NEW: E.G.O SUIT DEFINITIONS (Simple SVG interpretations) ---
// All suits are designed to sit in the 'translate(0, 40)' group
const EGO_SUITS = [
    // 0. Standard Suit (The Default)
    <g key="std">
        <rect x="5" y="0" width="40" height="15" rx="4" fill="#1a1a1a" /> {/* Jacket */}
        <polygon points="25,10 15,0 35,0" fill="white" /> {/* Shirt */}
        <polygon points="25,12 22,0 28,0" fill="#dc2626" /> {/* Tie */}
    </g>,
    // 1. Blue Star (Grey coat, Cyan heart glow)
    <g key="blue_star">
        <rect x="5" y="0" width="40" height="15" rx="2" fill="#6b7280" />
        <polygon points="25,12 20,5 30,5" fill="#06b6d4" opacity="0.8" /> {/* Simple "heart" glow shape */}
    </g>,
    // 2. Queen of Hatred (Pink tactical gear)
    <g key="qoh">
         <rect x="5" y="0" width="40" height="15" rx="2" fill="#f472b6" /> {/* Base Pink */}
         {/* Pouches */}
         <rect x="8" y="8" width="8" height="6" rx="1" fill="#db2777" />
         <rect x="18" y="8" width="8" height="6" rx="1" fill="#db2777" />
         <rect x="28" y="8" width="8" height="6" rx="1" fill="#db2777" />
    </g>,
     // 3. Nothing There (Red flesh, big eye)
    <g key="nt">
        <rect x="5" y="0" width="40" height="15" rx="4" fill="#b91c1c" /> {/* Red Base */}
        <circle cx="25" cy="8" r="5" fill="white" stroke="#7f1d1d" strokeWidth="1"/> {/* EyeBall */}
        <circle cx="25" cy="8" r="2" fill="#16a34a" /> {/* Pupil */}
    </g>,
    // 4. Silent Orchestra (White robe, black notes)
    <g key="so">
         <path d="M5,0 L45,0 L48,15 L2,15 Z" fill="#f3f4f6" /> {/* Oversized white shape */}
         {/* Music bars */}
         <rect x="10" y="5" width="30" height="2" fill="black" />
         <rect x="10" y="10" width="30" height="2" fill="black" />
    </g>,
    // 5. Mountain of Smiling Bodies (Black fur, red maw stomach)
    <g key="mosb">
         <rect x="5" y="0" width="40" height="15" rx="4" fill="#000000" stroke="#333" strokeWidth="1" strokeDasharray="2 1"/> {/* Hairy texture attempt */}
         <circle cx="25" cy="10" r="6" fill="#dc2626" /> {/* Maw */}
         <circle cx="10" cy="2" r="3" fill="#facc15" /> {/* Shoulder Eye L */}
         <circle cx="40" cy="2" r="3" fill="#facc15" /> {/* Shoulder Eye R */}
    </g>,
     // 6. Melting Love (Pink slime suit)
    <g key="ml">
         <rect x="5" y="0" width="40" height="15" rx="2" fill="#ec4899" /> {/* Darker pink base */}
         {/* Slime overlay path */}
         <path d="M5,0 Q10,5 15,2 Q20,0 25,3 Q30,6 35,2 Q40,0 45,0 L45,8 L5,8 Z" fill="#f9a8d4" />
    </g>,
     // 7. Crumbling Armor (White samurai, red patterns)
     <g key="ca">
        <rect x="5" y="0" width="40" height="15" rx="0" fill="#e5e7eb" /> {/* White plates */}
        {/* Red Sunburst/Pattern */}
        <path d="M25,15 L25,0 M15,15 L35,0 M35,15 L15,0" stroke="#dc2626" strokeWidth="1.5" />
    </g>,
    // 8. Todays Shy Look (Grey hairy, masks)
    <g key="tsl">
         <rect x="5" y="0" width="40" height="15" rx="4" fill="#374151" stroke="#1f2937" strokeWidth="1" />
         {/* Simple masks */}
         <circle cx="15" cy="5" r="3" fill="white" />
         <circle cx="35" cy="8" r="3" fill="white" />
         <circle cx="25" cy="12" r="3" fill="white" />
    </g>,
];

// Deterministic Generator
const generateFeatures = (username: string) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
      // Standard string hashing
     hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const skinTone = '#ffffff'; // Standard pale L-Corp skin
  
  // Use different bit shifts so traits don't align predictably
  const hColor = HAIR_COLORS[Math.abs(hash % HAIR_COLORS.length)];
  const hStyle = HAIR_STYLES[Math.abs((hash >> 2) % HAIR_STYLES.length)];
  const eColor = EYE_COLORS[Math.abs((hash >> 4) % EYE_COLORS.length)];
  const expr = EXPRESSIONS[Math.abs((hash >> 6) % EXPRESSIONS.length)];
  const eyeShape = Math.abs(hash % 2); 
  
  // NEW: Select Suit Index. 
  // We weigh it so index 0 (Standard Suit) is much more common, making EGO rare.
  const rawSuitIndex = Math.abs((hash >> 8) % 20); // Random number 0-19
  // If it's > 8, force it to 0 (Standard suit). Otherwise use the EGO index 1-8.
  // This makes Standard suit ~60% chance, EGO suits ~5% chance each.
  const suitIndex = rawSuitIndex > 8 ? 0 : rawSuitIndex; 

  return { skinTone, hColor, hStyle, eColor, expr, eyeShape, suitIndex };
};


export default function AgentPortrait({ username, deptColor }: { username: string, deptColor: string }) {
  // Generate all features, including the suit index
  const { skinTone, hColor, hStyle, eColor, expr, eyeShape, suitIndex } = useMemo(() => generateFeatures(username), [username]);

  // Grab the actual SVG element for the selected suit
  const suit = EGO_SUITS[suitIndex] || EGO_SUITS[0];

  return (
    // The SVG canvas: 50x50 coordinate space
    <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
      
      {/* 1. HAIR BACK (Behind head) */}
      {hStyle.back && <g fill={hColor}>{hStyle.back}</g>}

      {/* 2. BODY / SUIT AREA (Moved down 40 units) */}
      <g transform="translate(0, 40)">
         {/* RENDER THE SELECTED E.G.O. SUIT HERE */}
         {suit}
      </g>

      {/* 3. HEAD BASE */}
      <circle cx="25" cy="28" r="11" fill={skinTone} stroke="#1a1a1a" strokeWidth="0.5"/>

      {/* 4. FACE */}
      <g>
        {/* Eyes */}
        {eyeShape === 0 ? (
            <>
                <circle cx="20" cy="26" r="2" fill={eColor}/>
                <circle cx="30" cy="26" r="2" fill={eColor}/>
            </>
        ) : (
             <>
                <rect x="18" y="25" width="4" height="2" fill={eColor}/>
                <rect x="28" y="25" width="4" height="2" fill={eColor}/>
            </>
        )}
        
        {/* Mouth / Expression */}
        {expr}
      </g>

      {/* 5. HAIR FRONT (Bangs/Top) */}
      {hStyle.front && (
          <g fill={hColor} stroke={hColor} strokeWidth={hColor === '#2a2a2a' ? 0 : 0.5}>
            {hStyle.front}
          </g>
      )}
      
      
    </svg>
  );
}