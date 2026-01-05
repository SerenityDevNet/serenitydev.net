import Image from 'next/image';

export default function StartingSoonOverlay() {
  return (
    <main className="relative w-[1920px] h-[1080px] overflow-hidden bg-black text-white">
      
      {/* 1. BACKGROUND LAYER - Static */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/bg.png" 
          alt="Background" 
          fill 
          priority
          className="object-cover"
        />
      </div>

      {/* 2. TAPE LAYER - Slight drift for parallax depth */}
      {/* We animate this slightly slower and out of sync with the text to create depth */}
      <div className="absolute inset-0 z-10 animate-drift">
        <Image 
          src="/tape.png" 
          alt="Caution Tape" 
          fill 
          priority
          className="object-contain" 
        />
      </div>

      {/* 3. TEXT LAYER - The Main "Breathing" Element */}
      <div className="absolute inset-0 z-20 flex items-center justify-center animate-breathe">
        <Image 
          src="/text.png" 
          alt="Starting Soon" 
          fill 
          priority
          className="object-contain scale-95" // Slight scale down to ensure it doesn't touch edges if the image is full-bleed
        />
      </div>

      {/* STYLES - Injected here to avoid touching your tailwind.config */}
      <style>{`
        /* The Main Breathing Animation */
        @keyframes breathe {
          0% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.02); /* Moves up and grows slightly */
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }

        /* A subtle drift for the tape to make it feel detached from the BG */
        @keyframes drift {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }

        .animate-drift {
          animation: drift 6s ease-in-out infinite; /* Slower than the text */
        }
      `}</style>
    </main>
  );
}