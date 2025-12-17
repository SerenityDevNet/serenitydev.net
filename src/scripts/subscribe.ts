// Run with: npx tsx src/scripts/subscribe.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// TOGGLE: 'beta' or 'prod'
const TARGET_ENV: 'prod' | 'beta' = 'prod'; 

async function subscribe() {
  const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
  const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
  const WEBHOOK_SECRET = process.env.TWITCH_WEBHOOK_SECRET;
  const MY_BROADCASTER_ID = "547329691"; // SerenityStreaming

  if (!CLIENT_ID || !CLIENT_SECRET || !WEBHOOK_SECRET) {
    throw new Error("Missing env vars");
  }

  const CALLBACK_URL = TARGET_ENV === 'prod' 
    ? "https://www.serenitydev.net/api/webhooks/twitch" 
    : "https://beta.serenitydev.net/api/webhooks/twitch";

  console.log(`📡 Configuring TOTAL SURVEILLANCE for ${TARGET_ENV.toUpperCase()}...`);

  // 1. Get Token
  const tokenRes = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`, { method: 'POST' });
  const { access_token } = await tokenRes.json();

  // 2. The Complete Event List
  const events = [
    // --- Economy ---
    { type: 'channel.channel_points_custom_reward_redemption.add', version: '1' },
    { type: 'channel.channel_points_custom_reward_redemption.update', version: '1' }, // Refunds
    { type: 'channel.subscribe', version: '1' },
    { type: 'channel.subscription.gift', version: '1' },
    { type: 'channel.cheer', version: '1' },
    
    // --- Community Growth ---
    { type: 'channel.follow', version: '2' }, // v2 required
    { type: 'channel.raid', version: '1' },
    { type: 'channel.shoutout.create', version: '1' }, // You shouted someone out
    { type: 'channel.shoutout.receive', version: '1' }, // You got a shoutout
    
    // --- Hype & Engagement ---
    { type: 'channel.hype_train.begin', version: '1' },
    { type: 'channel.hype_train.progress', version: '1' },
    { type: 'channel.hype_train.end', version: '1' },
    { type: 'channel.poll.end', version: '1' },
    { type: 'channel.prediction.end', version: '1' },
    { type: 'channel.goal.end', version: '1' }, // Follow/Sub goals reached
    
    // --- Charity & Ads ---
    { type: 'channel.charity_campaign.donate', version: '1' }, // Charity donations
    { type: 'channel.ad_break.begin', version: '1' }, // Detect ads (maybe pause game?)

    // --- Moderation & Safety ---
    { type: 'channel.ban', version: '1' },
    { type: 'channel.unban', version: '1' },
    { type: 'channel.shield_mode.begin', version: '1' }, // Lockdown mode

    // --- Utility ---
    { type: 'stream.online', version: '1' },
    { type: 'stream.offline', version: '1' },
    { type: 'user.authorization.revoke', version: '1' } // User disconnects
  ];

  for (const event of events) {
    // Construct the 'condition' object dynamically based on event needs
    let condition: any = { broadcaster_user_id: MY_BROADCASTER_ID };

    // Special cases that need 'moderator_user_id'
    if (['channel.follow', 'channel.shoutout.create', 'channel.shoutout.receive', 'channel.shield_mode.begin', 'channel.shield_mode.end'].includes(event.type)) {
        condition = { 
            broadcaster_user_id: MY_BROADCASTER_ID,
            moderator_user_id: MY_BROADCASTER_ID 
        };
    } 
    // Special case for Raids (incoming)
    else if (event.type === 'channel.raid') {
        condition = { to_broadcaster_user_id: MY_BROADCASTER_ID };
    } 
    // Special case for Auth Revoke
    else if (event.type === 'user.authorization.revoke') {
        condition = { client_id: CLIENT_ID };
    }

    const subRes = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
      method: 'POST',
      headers: {
        'Client-ID': CLIENT_ID!,
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: event.type,
        version: event.version,
        condition: condition,
        transport: {
          method: 'webhook',
          callback: CALLBACK_URL,
          secret: WEBHOOK_SECRET!,
        },
      }),
    });

    if (subRes.status === 202) {
        console.log(`✅ Subscribed: ${event.type}`);
    } else {
        const err = await subRes.json();
        // Ignore "Already Exists" errors, print others
        if (err.error === "Conflict") {
            console.log(`⚠️  Active: ${event.type}`);
        } else {
            console.error(`❌ Failed: ${event.type}`, JSON.stringify(err, null, 2));
        }
    }
  }
}

subscribe();