import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

// --- GLOBAL STORAGE (For Overlay) ---
declare global {
  // eslint-disable-next-line no-var
  var latestAlert: any;
}

if (!global.latestAlert) {
  global.latestAlert = null;
}

const TWITCH_SECRET = process.env.TWITCH_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!TWITCH_SECRET) {
    console.error('TWITCH_WEBHOOK_SECRET is not defined');
    return new NextResponse('Server Configuration Error', { status: 500 });
  }

  // 1. Grab raw body & headers
  const bodyText = await req.text();
  const headerPayload = await headers();
  const messageId = headerPayload.get('Twitch-Eventsub-Message-Id');
  const timestamp = headerPayload.get('Twitch-Eventsub-Message-Timestamp');
  const signature = headerPayload.get('Twitch-Eventsub-Message-Signature');
  const messageType = headerPayload.get('Twitch-Eventsub-Message-Type');

  if (!signature || !messageId || !timestamp || !messageType) {
    return new NextResponse('Missing headers', { status: 400 });
  }

  // 2. Verify Signature
  const hmac = crypto.createHmac('sha256', TWITCH_SECRET);
  const hmacMessage = messageId + timestamp + bodyText;
  const computedSignature = `sha256=${hmac.update(hmacMessage).digest('hex')}`;

  if (computedSignature !== signature) {
    return new NextResponse('Invalid signature', { status: 403 });
  }

  // 3. Parse Data
  const payload = JSON.parse(bodyText);

  // 4. Handle Verification Handshake
  if (messageType === 'webhook_callback_verification') {
    return new NextResponse(payload.challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  }

  // 5. PROCESS NOTIFICATIONS
  if (messageType === 'notification') {
    const eventType = payload.subscription.type;
    const eventData = payload.event;

    console.log(`🔔 Event Received: ${eventType}`);

    // --- OVERLAY DATA PREP ---
    // Prepare the data structure expected by your OverlayPage
    const overlayAlert = {
      id: messageId,
      type: eventType,
      user: eventData.user_name || eventData.broadcaster_user_name || "Anonymous",
      // Add context-specific fields
      viewers: eventData.viewers, // For Raids
      bits: eventData.bits,       // For Cheers
      rewardName: eventData.reward?.title || "Redemption", // For Points
    };

    // Update Global Variable for the Overlay API
    (global as any).latestAlert = overlayAlert;

    try {
      // =========================================================
      // CASE A: CHANNEL POINT REDEMPTION
      // =========================================================
      if (eventType === 'channel.channel_points_custom_reward_redemption.add') {
        const { user_id, user_name, reward } = eventData;
        const rewardTitle = reward.title;

        console.log(`🎁 Redeem: ${user_name} -> ${rewardTitle}`);

        await prisma.user.upsert({
          where: { id: user_id },
          update: { name: user_name },
          create: { id: user_id, name: user_name },
        });

        // Check for unique items
        const uniqueItems = ["Test Plush"];
        if (uniqueItems.includes(rewardTitle)) {
          const existingToy = await prisma.toy.findFirst({
            where: { userId: user_id, name: rewardTitle },
          });

          if (existingToy) {
            console.log(`⚠️ User ${user_name} already has ${rewardTitle}. Skipping.`);
            return new NextResponse('Duplicate Item Ignored', { status: 200 });
          }
        }

        await prisma.toy.create({
          data: {
            name: rewardTitle,
            type: "Channel Redeem",
            userId: user_id,
          },
        });
      }

      // =========================================================
      // CASE B: SUBSCRIPTION (New Sub)
      // =========================================================
      else if (eventType === 'channel.subscribe') {
        const { user_id, user_name, tier } = eventData;
        console.log(`⭐ New Sub: ${user_name} (Tier ${tier})`);

        await prisma.user.upsert({
          where: { id: user_id },
          update: { name: user_name },
          create: { id: user_id, name: user_name },
        });

        await prisma.toy.create({
          data: {
            name: "Subscriber Sword",
            type: "Subscription Reward",
            userId: user_id,
          },
        });
      }

      // =========================================================
      // CASE C: BITS (Cheer)
      // =========================================================
      else if (eventType === 'channel.cheer') {
        const { user_id, user_name, bits } = eventData;
        console.log(`💎 Bits: ${user_name} gave ${bits}`);

        if (user_id) { // Anonymous cheers have null user_id
          await prisma.user.upsert({
            where: { id: user_id },
            update: { name: user_name },
            create: { id: user_id, name: user_name },
          });

          if (bits >= 100) {
            await prisma.toy.create({
              data: {
                name: "Bits Gemstone",
                type: "Currency",
                userId: user_id,
              },
            });
          }
        }
      }

      // =========================================================
      // CASE D: FOLLOW (Overlay Only - No DB Action usually needed)
      // =========================================================
      else if (eventType === 'channel.follow') {
         const { user_name } = eventData;
         console.log(`👀 New Follower: ${user_name}`);
         // No DB action required for follows typically, just the overlay trigger above
      }

      // =========================================================
      // CASE E: RAID (Overlay Only)
      // =========================================================
      else if (eventType === 'channel.raid') {
         const { from_broadcaster_user_name, viewers } = eventData;
         console.log(`🚨 Raid: ${from_broadcaster_user_name} with ${viewers} viewers`);
         // Update the overlay alert user name to be the raider
         overlayAlert.user = from_broadcaster_user_name;
         (global as any).latestAlert = overlayAlert;
      }

      return new NextResponse('Event Processed', { status: 200 });

    } catch (error) {
      console.error('Database Error:', error);
      // Return 200 even on DB error so Twitch doesn't retry indefinitely
      return new NextResponse('Database Error Handled', { status: 200 });
    }
  }

  return new NextResponse('Success', { status: 200 });
}