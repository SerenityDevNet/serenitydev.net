// src/app/games/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';
/*
// This is good practice for setting page titles
export const metadata: Metadata = {
  title: 'Games | Serenity Dev',
};

// --- Step 1: Define the "Type" for our data ---
// (This is the same as before)
type Game = {
  title: string;
  slug: string; // We'll need this for the link!
  gameFields: {
    releaseDate: string | null;
    coverImage: {
      mediaItemUrl: string;
    } | null;
  };
};

// --- Step 2: The Data Fetching (The *NEW* App Router Way) ---
// We create a separate function to keep the component clean.
// This function will run on the server.
async function getAllGames(): Promise<Game[]> {
  const query = `
    query GetAllGames {
      games(where: {status: PUBLISH}) {
        nodes {
          id
          slug
          title
          gameFields {
            coverImage {
              node {
                mediaItemUrl
              }
            }
            releaseDate
            fieldGroupName
          }
        }
      }
    }
  `;

  // We use our .env.local variable!
  const apiUrl = process.env.WORDPRESS_API_URL;

  // A little error-checking is good
  if (!apiUrl) {
    throw new Error('WORDPRESS_API_URL is not defined in .env.local');
  }

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    // THIS is the new "revalidate: 60"
    // It tells Next.js to re-fetch this data every 60 seconds
    next: { revalidate: 60 },
  });

  const json = await res.json();

  // Error handling
  if (json.errors) {
    console.error('GraphQL Errors:', json.errors);
    throw new Error('Failed to fetch API');
  }

  return json.data.games.nodes;
}
*/



// --- Step 3: Your Page Component (now an Async Component) ---
// This is a "React Server Component" by default
export default async function GamesPage() {
  // We call the fetch function directly inside the component
  /*
  const allGames = await getAllGames();
  */
  return (
    <div className="">
      <main className="text-[500%]">
        <ul>
          {/* We are now MAPPING over the "allGames" variable */}
          
        </ul>
      </main>
    </div>
  );
  

}