import Image from "next/image";

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // This div applies your global background image
    <div className="min-h-screen bg-[url(/images/site/background.png)] bg-[auto_2vw]">
      {/* This div handles the main container margins */}
      <div className="flex-grow bg-night-2 mx-[0] lg:mx-[10vw]">
        
        {/* --- HEADER --- */}
        <header className="bg-night-1">
          <Image
            src="/images/site/SerenityDev.png"
            alt="SerenityDev Logo"
            style={{
              width: "30%",
              height: "auto",
              display: "block",
              margin: "auto",
            }}
            width={960}
            height={270}
            priority
          />
          <div className="row-start-3 flex gap-x-[10vw] flex-wrap items-center justify-center bg-night-1 text-[2vw]">
            <a href="/">Home</a>
            <a href="/games">Games</a>
            <a href="/mods">Mods/Romhacks/Shaders</a>
            <a href="/art">Art</a>
            <a href="/toys">Toybox</a> {/* Added this for you! */}
          </div>
        </header>

        {/* --- PAGE CONTENT INJECTED HERE --- */}
        <div className="min-h-screen">
          {children}
        </div>

        {/* --- SPACING --- */}
        <br /><br /><br /><br />

        {/* --- FOOTER --- */}
        <footer className="bg-night-1 h-40">
          <h1 className="text-[70%] lg:text-[0.7rem] xl:text-[0.7vw] text-center pt-4 mb-1">
            Follow me on social media
          </h1>
          <br />
          <div className="row-start-3 flex gap-[3vw] flex-wrap items-center justify-center">
            {/* Social Icons (Twitter, Bluesky, Itch, YouTube) */}
            <a className="flex items-center gap-2 hover:underline hover:underline-offset-4 size-[3rem]" href="https://bsky.app/profile/serenity-dev.com" target="_blank" rel="noopener noreferrer">
               <Image aria-hidden src="/images/site/icons/bluesky.png" alt="Bluesky" width={64} height={64} />
            </a>
            <a className="flex items-center gap-2 hover:underline hover:underline-offset-4 size-[3rem]" href="https://twitter.com/Serenity_Dev" target="_blank" rel="noopener noreferrer">
               <Image aria-hidden src="/images/site/icons/twitter.png" alt="Twitter" width={64} height={64} />
            </a>
            <a className="flex items-center gap-2 hover:underline hover:underline-offset-4 size-[3rem]" href="https://www.youtube.com/@Serenity_Dev" target="_blank" rel="noopener noreferrer">
               <Image aria-hidden src="/images/site/icons/youtube.png" alt="YouTube" width={64} height={64} />
            </a>
            <a className="flex items-center gap-2 hover:underline hover:underline-offset-4 size-[3rem]" href="https://serenitydev.itch.io/" target="_blank" rel="noopener noreferrer">
               <Image aria-hidden src="/images/site/icons/itch.png" alt="Itch" width={64} height={64} />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}