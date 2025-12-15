import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const secret = process.env.TWITCH_WEBHOOK_SECRET;
  if (!secret) throw new Error('TWITCH_WEBHOOK_SECRET is not defined');

  // 1. Grab the raw body (needed for signature verification)
  const bodyText = await req.text();
  
  // 2. Grab the Twitch headers
  const headerPayload = await headers();
  const messageId = headerPayload.get('Twitch-Eventsub-Message-Id');
  const timestamp = headerPayload.get('Twitch-Eventsub-Message-Timestamp');
  const signature = headerPayload.get('Twitch-Eventsub-Message-Signature');
  const messageType = headerPayload.get('Twitch-Eventsub-Message-Type');

  if (!signature || !messageId || !timestamp || !messageType) {
    return new NextResponse('Missing headers', { status: 400 });
  }

  // 3. Verify the Signature (HMAC-SHA256)
  // We recreate the signature using our secret and compare it to what Twitch sent.
  const hmac = crypto.createHmac('sha256', secret);
  const hmacMessage = messageId + timestamp + bodyText;
  const computedSignature = `sha256=${hmac.update(hmacMessage).digest('hex')}`;

  if (computedSignature !== signature) {
    return new NextResponse('Invalid signature', { status: 403 });
  }

  // 4. Parse the data
  const payload = JSON.parse(bodyText);

  // 5. Handle the "Verification Handshake"
  // When you first register the webhook, Twitch sends a challenge to see if you exist.
  if (messageType === 'webhook_callback_verification') {
    return new NextResponse(payload.challenge, { status: 200 });
  }

  // 6. Handle the Actual Redemption Event
  if (messageType === 'notification' && payload.subscription.type === 'channel.channel_points_custom_reward_redemption.add') {
    const redemption = payload.event;
    
    const twitchUserId = redemption.user_id;
    const twitchUserName = redemption.user_name;
    const rewardTitle = redemption.reward.title;
    
    console.log(`🎁 Redemption detected: ${twitchUserName} redeemed ${rewardTitle}`);

    try {
      // Upsert User (Create them if they don't exist yet)
      await prisma.user.upsert({
        where: { id: twitchUserId },
        update: { name: twitchUserName }, // Update name in case they changed it
        create: {
          id: twitchUserId,
          name: twitchUserName,
        },
      });

      // Create the Toy
      await prisma.toy.create({
        data: {
          name: rewardTitle,      // The name of the Channel Point Reward
          type: "Channel Redeem", // Or you could parse the title to categorize it
          userId: twitchUserId,
        },
      });

      return new NextResponse('Toy Added', { status: 200 });
    } catch (error) {
      console.error('Database Error:', error);
      return new NextResponse('Database Error', { status: 500 });
    }
  }

  return new NextResponse('Success', { status: 200 });
}