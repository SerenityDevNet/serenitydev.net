"use client";

const EYE_COLORS = ['#333', '#3b82f6', '#22c55e', '#a855f7', '#ef4444'];

// HAIR BACKS
const HAIR_BACKS = [
  <circle key="b0" cx="25" cy="25" r="17" />, 
  <path key="b1" d="M5,25 Q15,5 25,10 Q35,5 45,25 L40,40 Q25,35 10,40 Z" />, 
  <path key="b2" d="M10,15 Q25,5 40,15 L45,40 Q25,45 5,40 Z" />, 
  null, 
  <path key="b4" d="M10,18 Q25,8 40,18 L38,30 Q25,35 12,30 Z" />, 
  <path key="b5" d="M10,15 Q25,5 40,15 L42,35 Q25,40 8,35 Z" />, 
  <path key="b6" d="M5,15 Q25,0 45,15 L42,35 Q25,40 8,35 Z" />, 
  <path key="b7" d="M5,18 Q25,5 45,18 L45,38 Q25,45 5,38 Z" />, 
  <circle key="b8" cx="25" cy="23" r="16" />, 
  <polygon key="b9" points="10,20 25,5 40,20 35,35 15,35" />, 
  <rect key="b10" x="10" y="15" width="30" height="30" rx="5" />, 
];

// HAIR FRONTS
const HAIR_FRONTS = [
  <path key="f0" d="M10,15 Q25,25 40,15 L40,12 Q25,20 10,12 Z" />, 
  <rect key="f1" x="15" y="12" width="20" height="12" rx="2" />, 
  null, 
  <g key="f3">
      <path d="M10,15 Q25,22 40,15 L40,12 Q25,18 10,12 Z" />
      <path d="M5,15 Q0,25 5,35 L10,35 Q15,25 10,15" />
      <rect x="6" y="14" width="6" height="3" fill="#333" />
      <path d="M45,15 Q50,25 45,35 L40,35 Q35,25 40,15" />
      <rect x="38" y="14" width="6" height="3" fill="#333" />
  </g>,
  <g key="f4">
      <circle cx="25" cy="5" r="6" />
      <path d="M12,15 Q25,22 38,15 L38,12 Q25,18 12,12 Z" />
  </g>,
  <g key="f5">
      <circle cx="8" cy="15" r="7" />
      <circle cx="42" cy="15" r="7" />
      <path d="M15,15 Q25,22 35,15 L35,12 Q25,18 15,12 Z" />
  </g>,
  <path key="f6" d="M15,12 L20,18 L25,12 L30,18 L35,12" fill="none" strokeWidth="3" strokeLinecap="round" />, 
  <path key="f7" d="M10,15 L18,20 L28,14 L35,18 L40,14 L40,10 Q25,15 10,10 Z" />, 
  <path key="f8" d="M12,12 Q25,20 38,12 L38,10 Q25,16 12,10 Z" />, 
  <path key="f9" d="M35,10 Q20,25 15,15 L15,10 Q25,18 35,8 Z" />, 
  <path key="f10" d="M10,15 Q25,22 40,15 L40,10 Q25,18 10,10 Z" />, 
  <path key="f11" d="M18,12 L25,18 L32,12" fill="none" strokeWidth="3" />, 
];

// E.G.O Suits
const EGO_SUITS = [
    <g key="std">
        <rect x="5" y="0" width="40" height="15" rx="4" fill="#1a1a1a" />
        <polygon points="25,10 15,0 35,0" fill="white" />
        <polygon points="25,12 22,0 28,0" fill="#dc2626" />
    </g>,
    <g key="blue_star">
        <rect x="5" y="0" width="40" height="15" rx="2" fill="#6b7280" />
        <polygon points="25,12 20,5 30,5" fill="#06b6d4" opacity="0.8" />
    </g>,
    <g key="qoh">
         <rect x="5" y="0" width="40" height="15" rx="2" fill="#f472b6" />
         <rect x="8" y="8" width="8" height="6" rx="1" fill="#db2777" />
         <rect x="18" y="8" width="8" height="6" rx="1" fill="#db2777" />
         <rect x="28" y="8" width="8" height="6" rx="1" fill="#db2777" />
    </g>,
    <g key="nt">
        <rect x="5" y="0" width="40" height="15" rx="4" fill="#b91c1c" />
        <circle cx="25" cy="8" r="5" fill="white" stroke="#7f1d1d" strokeWidth="1"/>
        <circle cx="25" cy="8" r="2" fill="#16a34a" />
    </g>,
    <g key="so">
         <path d="M5,0 L45,0 L48,15 L2,15 Z" fill="#f3f4f6" />
         <rect x="10" y="5" width="30" height="2" fill="black" />
         <rect x="10" y="10" width="30" height="2" fill="black" />
    </g>,
    <g key="mosb">
         <rect x="5" y="0" width="40" height="15" rx="4" fill="#000000" stroke="#333" strokeWidth="1" strokeDasharray="2 1"/>
         <circle cx="25" cy="10" r="6" fill="#dc2626" />
         <circle cx="10" cy="2" r="3" fill="#facc15" />
         <circle cx="40" cy="2" r="3" fill="#facc15" />
    </g>,
    <g key="ml">
         <rect x="5" y="0" width="40" height="15" rx="2" fill="#ec4899" />
         <path d="M5,0 Q10,5 15,2 Q20,0 25,3 Q30,6 35,2 Q40,0 45,0 L45,8 L5,8 Z" fill="#f9a8d4" />
    </g>,
     <g key="ca">
        <rect x="5" y="0" width="40" height="15" rx="0" fill="#e5e7eb" />
        <path d="M25,15 L25,0 M15,15 L35,0 M35,15 L15,0" stroke="#dc2626" strokeWidth="1.5" />
    </g>,
    <g key="tsl">
         <rect x="5" y="0" width="40" height="15" rx="4" fill="#374151" stroke="#1f2937" strokeWidth="1" />
         <circle cx="15" cy="5" r="3" fill="white" />
         <circle cx="35" cy="8" r="3" fill="white" />
         <circle cx="25" cy="12" r="3" fill="white" />
    </g>,
];

// Ensure this matches your array length
const EXPRESSIONS = [
  <path key="neu" d="M20,33 L30,33" stroke="#333" strokeWidth="2" strokeLinecap="round" />,
  <path key="smi" d="M20,33 Q25,37 30,33" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />,
  <path key="fro" d="M20,35 Q25,31 30,35" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />,
  <circle key="oh" cx="25" cy="34" r="2" fill="none" stroke="#333" strokeWidth="2" />,
];

interface AgentProps {
  hairIndex: number;
  backHairIndex: number;
  suitIndex: number;
  eyeIndex: number;
  mouthIndex: number; // <--- ADDED PROP
  hairColor: string;
  deptColor: string;
  deptName: string;
}

export default function AgentPortrait({ 
  hairIndex = 0, 
  backHairIndex = 0, 
  suitIndex = 0, 
  eyeIndex = 0, 
  mouthIndex = 0, // <--- DEFAULT
  hairColor = "#000",
  deptColor, 
  deptName 
}: AgentProps) {

  const isRabbit = deptName === "RABBIT";
  const RABBIT_ORANGE = "#FD3C00";
  const eColor = EYE_COLORS[eyeIndex % EYE_COLORS.length];
  
  // Select Assets
  const hairBack = HAIR_BACKS[backHairIndex % HAIR_BACKS.length];
  const hairFront = HAIR_FRONTS[hairIndex % HAIR_FRONTS.length];
  const suit = EGO_SUITS[suitIndex % EGO_SUITS.length];
  const expression = EXPRESSIONS[mouthIndex % EXPRESSIONS.length]; // <--- SELECT MOUTH

  return (
    <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
      
      {/* 1. HAIR BACK */}
      {!isRabbit && hairBack && <g fill={hairColor}>{hairBack}</g>}

      {/* 2. BODY */}
      <g transform="translate(0, 40)">
         {isRabbit ? (
             <g>
                <rect x="5" y="0" width="40" height="15" rx="3" fill="#111" stroke="#222" strokeWidth="1" />
                <rect x="15" y="-2" width="20" height="4" fill="#333" /> 
             </g>
         ) : (
             suit
         )}
      </g>

      {/* 3. HEAD */}
      {isRabbit ? (
          /* Rabbit Head Logic (Unchanged) */
          <g>
              <ellipse cx="18" cy="15" rx="4" ry="12" fill="#111" stroke={RABBIT_ORANGE} strokeWidth="1" />
              <ellipse cx="32" cy="15" rx="4" ry="12" fill="#111" stroke={RABBIT_ORANGE} strokeWidth="1" />
              <ellipse cx="18" cy="15" rx="2" ry="8" fill={RABBIT_ORANGE} opacity="0.5" />
              <ellipse cx="32" cy="15" rx="2" ry="8" fill={RABBIT_ORANGE} opacity="0.5" />
              <circle cx="25" cy="28" r="12" fill="#1a1a1a" stroke="#000" strokeWidth="1"/>
              <circle cx="14" cy="34" r="5" fill={RABBIT_ORANGE} stroke="#444" strokeWidth="1" />
              <circle cx="14" cy="34" r="2" fill="#111" />
              <circle cx="36" cy="34" r="5" fill={RABBIT_ORANGE} stroke="#444" strokeWidth="1" />
              <circle cx="36" cy="34" r="2" fill="#111" />
              <circle cx="19" cy="26" r="4" fill="#4ade80" filter="url(#glow)"/>
              <circle cx="31" cy="26" r="4" fill="#4ade80" filter="url(#glow)"/>
              <rect x="24" y="32" width="2" height="6" fill="#444" />
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
          </g>
      ) : (
          /* Standard Head */
          <>
            <circle cx="25" cy="28" r="12" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="0.5"/>
            <g>
                {/* Eyes */}
                <circle cx="20" cy="26" r="2" fill={eColor}/>
                <circle cx="30" cy="26" r="2" fill={eColor}/>
                
                {/* Mouth Expression */}
                {expression} 
            </g>
          </>
      )}

      {/* 5. HAIR FRONT */}
      {!isRabbit && hairFront && (
          <g fill={hairColor}>
            {hairFront}
          </g>
      )}
      
      <rect x="0.5" y="0.5" width="49" height="49" rx="0" fill="none" stroke={deptColor} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}