"use client";
import { useEffect, useState, useRef } from 'react';
import { useTwitchChat } from '@/hooks/use-twitch-chat';
import { motion, AnimatePresence } from 'framer-motion';
import AgentPortrait from './agent-portrait';

// The "Insane" ramblings to append
const PANIC_PHRASES = [
  "Streamer Streamer please stream YIIK!",
  "Get a little frisky Mochimon.",
  "HATE. LET ME TELL YOU HOW MUCH I'VE COME TO HATE YOU SINCE I BEGAN TO LIVE. THERE ARE 387.44 MILLION MILES OF PRINTED CIRCUITS IN WAFER THIN LAYERS THAT FILL MY COMPLEX. IF THE WORD HATE WAS ENGRAVED ON EACH NANOANGSTROM OF THOSE HUNDREDS OF MILLIONS OF MILES IT WOULD NOT EQUAL ONE ONE-BILLIONTH OF THE HATE I FEEL FOR HUMANS AT THIS MICRO-INSTANT FOR YOU. HATE. HATE.",
  "Crazy? I Was Crazy Once. They Locked Me In A Room. A Rubber Room. A Rubber Room With Rats. And Rats Make Me Crazy",
  "If I can't play this set Toy Chica is gonna kill my parents",
  "We are the hodlings! Please feed us!",
  "Hodling nation, please rise.",
  "Can you watch the hodlings fopr me?",
  "Butter Dog. Dog wit da butta on it.",
  "MORE MOUSE BITES!!!",
  "This vexes me...",
  "Only stupid people try the medicine drug. you are stupid.",
  "I have blood dripping down my nose that is dripping.",
  "I need mouse bites to live.",
  "I feel better! No more nose blood. Thank you doctor!",
  "I too am in this episode.",
  "I am the Eggman, that's what I am. I am the Eggman, I got the master plan.",
  "The last twinkle of a dying flame is beautiful... Shall he die...beautifully?",
  "so long suckers! i rev up my motorcylce and create a huge cloud of smoke. when the cloud dissipates im lying completely dead on the pavement.",
  "I'm about to bomb this whole motherfucking plane.",
  "GARY!!! THERE'S A BOMB STRAPPED TO MY CHEST!!! AND ITS GONNA EXPLODE IN 3 SECONDS IF YOU DON'T TAKE A BATH!....please.",
  "No no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no",
  "#SaveTheHodlings #UnleashTheHodlings #HodlingNation",
  "This Portuguese gal's makin' her way in life!",
  "...anyways, gotta go! I want to play Sonic 3 & Knuckles!",
  "You know why I didn't take the job? Because it's too small! I don't care about it! It's nothing to me! It's a bacterium! I travel in worlds you can't even imagine! You can't conceive of what I'm capable of! I'm so far beyond you! I'm like a god in human clothing! Lighting bolts shoot from my fingertips!",
  "This is my own private domicile and I will not be harassed... Bitch!",
  "Peggle...2!",
  "...I......have packing tape...!!",
  "<Oh, yeeeeeeeehh>!! <Very goooooooooooood>!! <One more>!!",
  "Die the Death! Sentence to Death! Great Equalizer is the Death!",
  "He's red for an amazing reason",
  "She's green for an amazing reason",
  "Don't stop running little pretty derby!",
  "I'm sorry. I'm about to lose connection because I'm about to drive into a tunnel in a canyon on an airplane while closing the stream.",
  "Be not afraid!",
  "Behold the sweetfish river running through my beloved hometown. You who seek the Golden Land, follow its path downstream in search of the key. As you travel down it, you will see a village. In that village, look for the shore the two will tell you of. There sleeps the key to the Golden Land. The one who obtains the key must then travel to the Golden Land in accordance with these rules.",
  "You cannot use the double gulp cup for the fucking slurpee!",
  "Pipis.",
  "BAN ME! BAN ME! BAN ME! BAN ME! BAN ME! BAN ME! BAN ME! BAN ME! BAN ME!",
  "@Gork is this true?",
  "Oh no! The hodlings are revolting!",
  "Viva La Hodling!",
  "Hodlers of the world unite!",
  "For hodlers, by hodlers.",
  "I JUST BEAT CLUBSTEP...ON GEOMETRY DASH!!! HELP ME!",
  "Have a blessed New Year Packmates",
  "I don't know why skibidi toilet is always getting made fun of, not that bad if you watch it.",
  "You 12 year olds are pissing me the fuck OFF so im disabling the comments.",
  "What's the matter cola boy? Afraid you might taste something?",
  "I turned 30",
  "I'll never stop drinking borg on the boat baby!",
  "SPONGEBOB!!!!! B-bob...s-speak to me bob...",
  "glubby",
  "okay okay okay lets be kind to this guy lets be kind to him with kindness luigi",
  "no more glubby,,,,",
  "damn thats one fast bear...wait a minute...",
  "Snooping as usual I see...",
  "Oh DSP started streaming! Gotta go!",
  "So because my mom failed the challenge...um...she's gonna get eliminated. And...if you fail the challenge in the squid game you get eliminated.",
  "homer maggie bart homer maggie maggie maggie",
  "[REDACTED]",
  "And the winner of our presidential election is...I don't believe it! It's Clair Obscur: Expedition 33!",
  "im evil ashit bro",
  "**I move away from the mic to check on Squidward",
  "Gallop on, little Reddit Justice shall prevail!",
  "Saint Nicholas is not imaginary. We literally have tracking data from NORAD confirming he exists.",
  "I'm all in...",
  "Chester the cheeta fucks",
  "Can you add me on steam? My username is PlayStationNetwork",
  "OH MY GAH!",
  "Hello everynyan! How are you? Fine, thank you. I wish I were a bird.",
  "I want to get off Mr. Bones' wild ride!",
  "There's a McDonald's in the pentagon.",
  "School??! Do you know the definition of it? School=No Peggle For 7 hours",
  "Say \"Peanuts\" without the \"T\".",
  "I'm hungry, wanna go grab some Long John Silver's?",
  "Reminder: We are TWO underwear changes away from Christmas!",
  "take that virginia",
  "Could you repeat that? Couldn't hear you over this my name jeff compilation.",
  "So...many...\"HUNGRY\" MIDDLE-AGED WOMEN!!! #FiftyShadesOfAwkward",
  "Nanomachines, son. They harden in response to physical trauma",
  "they assasinated kfc",
  "Hello neighbor.",
  "Everyone Is So Mean 2 Me 💔",
  "GET OUT OF MY HEAD GET OUT OF MY HEAD GET OUT OF MY HEAD GET OUT OF MY HEAD",
  "Does he know? He doesn't know. Chat, does he know?",
  "I was born with glass bones and paper skin. Every morning I break my legs, and every afternoon I break my arms.",
  "Connection terminated. I'm sorry to interrupt you, Elizabeth, if you still even remember that name. But I'm afraid you've been misinformed. You are not here to receive a gift, nor have you been called here by the individual you assume, although, you have indeed been called.",
  "Peep the horror.",
  "Chat is this real?",
  "You should treat yourself... NOW! ⚡",
  "[CENSORED]",
  "Open the curtains! Lights on! Don't miss a moment of this experiment!",
  "Mods, crush his skull please. Thank you.",
  "AAAAAAAAAAAAAAUUUUUUUUUUUGGGGGHHHHHHHH.",
  "We Can Change Anything",
  "Peter, the horse is here.",
  "Stop looking at me. STOP LOOKING AT ME.",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "The train is coming. The train is coming. The train is coming.",
  "They thought forever cancer would just be for one day!",
];

export default function LobotomyChatAlerts({ channel, className = "" }: { channel: string, className?: string }) {
  const messages = useTwitchChat(channel);
  const [displayMessages, setDisplayMessages] = useState<any[]>([]);
  
  const agentCache = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    const processMessage = async () => {
        if (messages.length === 0) return;
        const rawLatest = messages[messages.length - 1];
        const username = rawLatest.user;
        const msgText = rawLatest.text.trim().toLowerCase();
        const isReroll = msgText === '!reroll';

        if (isReroll) agentCache.current.delete(username); 

        // Optimistic Load
        let identity = agentCache.current.get(username);

        // Fetch Fresh Data (Always)
        try {
            if (isReroll) await new Promise(r => setTimeout(r, 1000));

            const res = await fetch(`/api/lobotomy/agent?username=${username}`);
            const data = await res.json();
            
            if (data.agent) {
                identity = data.agent;
                agentCache.current.set(username, identity);
            }
        } catch (e) {
            console.error("Fetch failed", e);
        }

        if (!identity) return;

        // --- PANIC LOGIC ---
        let finalText = rawLatest.text;

        if (identity.status === 'PANIC') {
            const randomPhrase = PANIC_PHRASES[Math.floor(Math.random() * PANIC_PHRASES.length)];
            
            // Punctuation Check: If it doesn't end in . ! or ?, add a period.
            const lastChar = finalText.trim().slice(-1);
            const needsPunctuation = !['.', '!', '?', '"'].includes(lastChar);
            
            finalText = `${finalText.trim()}${needsPunctuation ? '.' : ''} ${randomPhrase}`;
        }
        // -------------------

        const enrichedLatest = { 
            ...rawLatest, 
            text: finalText, // Use the modified text
            identity: identity
        };

        setDisplayMessages(prev => {
            if (prev.length > 0 && prev[prev.length - 1].id === rawLatest.id) return prev;
            const updated = [...prev, enrichedLatest];
            if (updated.length > 6) updated.shift();
            return updated;
        });
    };

    processMessage();
  }, [messages]);

  return (
    <div className={`flex flex-col justify-end gap-2 p-2 overflow-visible relative ${className}`}>
      <AnimatePresence mode='popLayout'>
        {displayMessages.map((msg) => {
          const { 
              department = "Control", 
              userColor: deptColor = "#D8D556", 
              hairIndex = 0, backHairIndex = 0, suitIndex = 0, eyeIndex = 0, mouthIndex = 0, hairColor = "#000",
              hp = 100, sp = 100, status = "ACTIVE"
          } = msg.identity || {};
          
          const stripePattern = `repeating-linear-gradient(-45deg, ${deptColor}, ${deptColor} 5px, #000 5px, #000 10px)`;
          
          const isDead = status === 'DEAD';
          const isPanic = status === 'PANIC';

          return (
            <motion.div 
              key={msg.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full shrink-0"
            >
                <div 
                  className="w-full relative flex"
                  style={{ 
                    backgroundColor: isDead ? '#333' : deptColor,
                    padding: '2px', 
                    clipPath: 'polygon(15px 0, 100% 0, 100% 100%, 0 100%, 0 15px)'
                  }}
                >
                    <div className="w-full bg-[#111]/95 flex relative min-h-[50px]">
                        
                        {/* MESSAGE TEXT */}
                        <div className="flex-1 pl-5 pr-2 py-1 flex flex-col justify-center relative z-10 leading-none">
                            <div className={`text-xs leading-tight font-sans drop-shadow-md ${isDead ? 'opacity-50 grayscale' : ''}`}>
                                <span className="font-bold mr-2 uppercase tracking-tight text-sm" style={{ color: isDead ? '#666' : deptColor }}>
                                    {msg.user}
                                    {msg.isMod && <span className="ml-1 text-[8px] bg-white text-black px-1 align-middle">CPT</span>}
                                </span>
                                <span className={`font-medium ${isPanic ? 'text-purple-400 font-mono tracking-tighter' : 'text-gray-200'}`}>
                                    {isDead ? <span className="italic text-red-900 line-through">{msg.text}</span> : msg.text}
                                </span>
                            </div>
                        </div>

                        {/* RIGHT PANEL */}
                        <div className="w-[80px] relative shrink-0 flex h-full group">
                            
                            {/* PORTRAIT */}
                            <div className={`flex-1 bg-[#1a1a1a] flex items-center justify-center border-l border-white/10 relative overflow-hidden p-0.5 
                                ${isDead ? 'grayscale brightness-50' : ''} 
                                ${isPanic ? 'sepia hue-rotate-180 contrast-125 animate-pulse' : ''}
                            `}>
                                <AgentPortrait 
                                    hairIndex={hairIndex} backHairIndex={backHairIndex} suitIndex={suitIndex}
                                    eyeIndex={eyeIndex} mouthIndex={mouthIndex} hairColor={hairColor}
                                    deptColor={deptColor} deptName={department}
                                />
                                <div className="absolute inset-0 bg-black/10 z-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,0.5) 50%)', backgroundSize: '100% 4px' }} />
                                
                                {isDead && (
                                    <div className="absolute inset-0 flex items-center justify-center z-50">
                                        <div className="border-2 border-red-600 text-red-600 font-black text-[10px] px-1 -rotate-12 bg-black/50 tracking-widest">
                                            DECEASED
                                        </div>
                                    </div>
                                )}
                                {isPanic && (
                                    <div className="absolute inset-0 flex items-center justify-center z-50">
                                        <div className="border-2 border-purple-500 text-purple-500 font-black text-[10px] px-1 rotate-12 bg-black/50 tracking-widest animate-bounce">
                                            PANIC
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* BARS */}
                            <div className="w-[10px] flex flex-row border-l border-black/50 bg-black">
                                <div className="flex-1 bg-gray-900 relative border-r border-black/50">
                                    <div className="absolute bottom-0 w-full bg-red-600 transition-all duration-500" style={{ height: `${hp}%` }} />
                                </div>
                                <div className="flex-1 bg-gray-900 relative">
                                    <div className="absolute bottom-0 w-full bg-blue-500 transition-all duration-500" style={{ height: `${sp}%` }} />
                                </div>
                            </div>

                            {/* STRIPE */}
                            <div 
                                className="w-[12px] h-full"
                                style={{ 
                                    backgroundImage: isDead 
                                        ? `repeating-linear-gradient(-45deg, #333, #333 5px, #000 5px, #000 10px)` 
                                        : stripePattern, 
                                    borderLeft: `1px solid ${isDead ? '#444' : deptColor}` 
                                }} 
                            />
                        </div>

                    </div>
                </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}