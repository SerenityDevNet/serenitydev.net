import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });


async function subscribe() {
  const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
  const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
  const WEBHOOK_SECRET = process.env.TWITCH_WEBHOOK_SECRET;
  const MY_BROADCASTER_ID = "547329691"; 

  // Select the correct URL based on the toggle above
  const CALLBACK_URL = "https://serenitydev.net/api/webhooks/twitch" 

  console.log(`📡 Subscribing to PRODUCTION: ${CALLBACK_URL}`);

  // 1. Get Token
  const tokenRes = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`, { method: 'POST' });
  const { access_token } = await tokenRes.json();

  // 2. Send Subscription Request
  const subRes = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
    method: 'POST',
    headers: {
      'Client-ID': CLIENT_ID!,
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'channel.channel_points_custom_reward_redemption.add',
      version: '1',
      condition: { broadcaster_user_id: MY_BROADCASTER_ID },
      transport: {
        method: 'webhook',
        callback: CALLBACK_URL,
        secret: WEBHOOK_SECRET,
      },
    }),
  });

  const response = await subRes.json();
  console.log("Twitch Response:", JSON.stringify(response, null, 2));
}

subscribe();