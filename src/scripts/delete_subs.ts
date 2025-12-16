// Run with: npx tsx src/scripts/delete_subs.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function deleteSubs() {
  const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
  const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

  // 1. Get Token
  const tokenRes = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`, { method: 'POST' });
  const { access_token } = await tokenRes.json();

  // 2. Delete the specific IDs from your log
  const idsToDelete = [
    "447727eb-f9c5-4949-8b70-59533530b5f6",
    "28280dc9-bd63-42c2-88be-a56bc0355b13",
    "74295324-ce2e-4bcf-87d2-30414e186ea5"
  ];

  for (const id of idsToDelete) {
    await fetch(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Client-ID': CLIENT_ID!,
        'Authorization': `Bearer ${access_token}`,
      },
    });
    console.log(`Deleted ${id}`);
  }
}

deleteSubs();