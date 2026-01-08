import SpeechBubble from "@/components/y2roll/y2roll-speech-bubble";

export default function CaptionsPage() {
  return (
    <main className="min-h-screen w-full bg-[#00ff00] flex flex-col justify-end pb-20">
      {/* BG IS GREEN for Chroma Keying. 
        Since this needs a real browser to capture Mic, you will "Window Capture" this 
        and use a "Chroma Key" filter in OBS to remove the green.
      */}
      <SpeechBubble />
    </main>
  );
}