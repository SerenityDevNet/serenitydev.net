// src/app/games/page.tsx
import { getGames } from "@/lib/drupal";
import Link from "next/link"; 
import Image from "next/image"; // Optimization wrapper

export default async function GamesPage() {
  const games = await getGames();

  return (
    <div className="">
      <main className="text-white">
        <h1 className="text-4xl font-bold p-4 text-white">My Games</h1>
        <ul>
          {games.map((game) => (
            <Link key={game.id} href={game.slug || `/games/${game.id}`}>
              <li 
                // 1. Dynamic Background Color
                style={{ backgroundColor: game.primaryColor }}
                className="h-40 flex flex-col justify-center px-8 border-b border-black hover:opacity-90 transition-opacity"
              >
                
                <div className="flex justify-between items-center h-20">
                  {/* 2. Logo Container 
                      We use a relative container with 'object-contain' on the image.
                      This keeps the aspect ratio perfect (no squashing).
                  */}
                  <div className="relative h-full w-1/2 max-w-[300px]">
                    {game.logo ? (
                      <img 
                        src={game.logo} 
                        alt={`${game.title} logo`} 
                        className="h-full w-full object-contain object-left" 
                      />
                    ) : (
                      // Fallback to text if no logo exists yet
                      <h2 className="text-3xl font-bold">{game.title}</h2>
                    )}
                  </div>

                  <span className="text-sm opacity-75 mix-blend-difference">
                    {game.releaseDate}
                  </span>
                </div>
                
                {/* 3. Dynamic Text Color for Tagline */}
                <p 
                  style={{ color: game.secondaryColor }} 
                  className="text-lg italic mt-2"
                >
                  {game.tagline}
                </p>
                
              </li>
            </Link>
          ))}
        </ul>
      </main>
    </div>
  );
}