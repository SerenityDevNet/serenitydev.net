import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

// --- DEBUG HANDLER (GET) ---
export async function GET() {
  try {
    // 1. Check Secret
    const secret = process.env.TWITCH_WEBHOOK_SECRET;
    const secretStatus = secret ? `Loaded (${secret.length} chars)` : 'MISSING ❌';

    // 2. Check Database
    const userCount = await prisma.user.count();
    const dbStatus = `Connected ✅ (Users: ${userCount})`;

    return NextResponse.json({
      status: "System Diagnostic",
      env: process.env.NODE_ENV,
      secret: secretStatus,
      database: dbStatus,
    });
  } catch (error) {
    return NextResponse.json({
      status: "System Failure ❌",
      error: String(error)
    }, { status: 500 });
  }
}
// ---------------------------

export async function POST(req: Request) {
  const secret = process.env.TWITCH_WEBHOOK_SECRET;
  
  // LOGGING: Check Vercel Logs for this line
  console.log("Webhook hit! Secret present:", !!secret);

  if (!secret) {
    console.error("CRITICAL: TWITCH_WEBHOOK_SECRET is missing");
    return new NextResponse('Secret Missing', { status: 500 });
  }

  const bodyText = await req.text();
  const headerPayload = await headers();
  const messageId = headerPayload.get('Twitch-Eventsub-Message-Id');
  const timestamp = headerPayload.get('Twitch-Eventsub-Message-Timestamp');
  const signature = headerPayload.get('Twitch-Eventsub-Message-Signature');
  const messageType = headerPayload.get('Twitch-Eventsub-Message-Type');

  if (!signature || !messageId || !timestamp || !messageType) {
    return new NextResponse('Missing headers', { status: 400 });
  }

  const hmac = crypto.createHmac('sha256', secret);
  const hmacMessage = messageId + timestamp + bodyText;
  const computedSignature = `sha256=${hmac.update(hmacMessage).digest('hex')}`;

  if (computedSignature !== signature) {
    console.error("Signature Mismatch! Twitch sent:", signature, "We calculated:", computedSignature);
    return new NextResponse('Invalid signature', { status: 403 });
  }

  const payload = JSON.parse(bodyText);

  if (messageType === 'webhook_callback_verification') {
    return new NextResponse(payload.challenge, { status: 200 });
  }

  if (messageType === 'notification' && payload.subscription.type === 'channel.channel_points_custom_reward_redemption.add') {
    const redemption = payload.event;
    console.log(`🎁 Valid Redeem: ${redemption.user_name} -> ${redemption.reward.title}`);

    try {
      await prisma.user.upsert({
        where: { id: redemption.user_id },
        update: { name: redemption.user_name },
        create: { id: redemption.user_id, name: redemption.user_name },
      });

      await prisma.toy.create({
        data: {
          name: redemption.reward.title,
          type: "Channel Redeem",
          userId: redemption.user_id,
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