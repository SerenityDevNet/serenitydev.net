// src/lib/drupal.ts

const DRUPAL_BASE_URL = "https://drupal.serenitydev.net"; 

export interface Game {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  logo: string | null; // Changed from coverImage to logo specific logic
  releaseDate: string;
  primaryColor: string; 
  secondaryColor: string;
}

export async function getGames(): Promise<Game[]> {
  // 1. Updated Endpoint: We ask for 'field_logo' in the include parameter
  // Note: Ensure the machine name in Drupal is exactly 'field_logo'
  const endpoint = `${DRUPAL_BASE_URL}/jsonapi/node/game?include=field_game_logo`;
  
// inside src/lib/drupal.ts
  const res = await fetch(endpoint, { 
    next: { revalidate: 60 } 
  });

  if (!res.ok) {
    // This logs the specific error code and text to your terminal
    console.error(`Drupal API Error: ${res.status} ${res.statusText}`);
    try {
      const errorBody = await res.text();
      console.error("Error Details:", errorBody);
    } catch (e) {
      console.error("Could not read error body.");
    }
    throw new Error(`Failed to fetch games from Drupal: ${res.status}`);
  }

  const json = await res.json();

  return json.data.map((item: any) => {
    // 2. Logic to find the logo image
    const logoId = item.relationships.field_game_logo?.data?.id;
    const includedLogo = json.included?.find((inc: any) => inc.id === logoId);
    const logoUrl = includedLogo 
      ? `${DRUPAL_BASE_URL}${includedLogo.attributes.uri.url}` 
      : null;

    return {
      id: item.id,
      title: item.attributes.title,
      slug: item.attributes.path.alias,
      tagline: item.attributes.field_tagline,
      releaseDate: item.attributes.field_release_date,
      logo: logoUrl,
      // 3. Map colors with fallbacks just in case Drupal is empty
      primaryColor: item.attributes.field_primary_color || '#1a1a1a', 
      secondaryColor: item.attributes.field_secondary_color || '#ffffff',
    };
  });
}