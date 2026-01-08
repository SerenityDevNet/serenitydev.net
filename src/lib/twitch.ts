let appAccessToken = '';

export async function getTwitchToken() {
  if (appAccessToken) return appAccessToken;

  try {
    const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`, {
      method: 'POST',
    });
    const data = await res.json();
    appAccessToken = data.access_token;
    return appAccessToken;
  } catch (e) {
    console.error("Failed to get Twitch Token", e);
    return null;
  }
}

export async function getFollowerCount() {
  const token = await getTwitchToken();
  const broadcasterId = process.env.TWITCH_BROADCASTER_ID;

  if (!token || !broadcasterId) return 0;

  try {
    // Fetch followers (first page only, but the response includes 'total')
    const res = await fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${broadcasterId}&first=1`, {
      headers: {
        'Client-Id': process.env.TWITCH_CLIENT_ID!,
        'Authorization': `Bearer ${token}`,
      },
      next: { revalidate: 60 } // Cache for 60s so we don't spam Twitch
    });

    const data = await res.json();
    return data.total || 0; // The 'total' field is the accurate count
  } catch (e) {
    console.error("Failed to fetch followers", e);
    return 0;
  }
}