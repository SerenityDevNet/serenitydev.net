// Run with: npx tsx src/scripts/check_subs.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkSubs() {
  const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
  const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

  // 1. Get Token
  const tokenRes = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`, { method: 'POST' });
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // 2. List Subscriptions
  const res = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
    headers: {
      'Client-ID': CLIENT_ID!,
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();
  console.log("Current Subscriptions:", JSON.stringify(data, null, 2));
}

checkSubs();