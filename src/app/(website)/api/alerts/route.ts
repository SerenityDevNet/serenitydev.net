import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // Find the oldest "Unread" alert (we will add an 'isRead' flag logic later)
  // For now, let's just fetch the latest toy created in the last 5 seconds
  const fiveSecondsAgo = new Date(Date.now() - 5000);

  const latestToy = await prisma.toy.findFirst({
    where: {
      obtainedAt: {
        gte: fiveSecondsAgo,
      },
    },
    orderBy: {
      obtainedAt: 'desc',
    },
    include: {
      user: true, // Get the username
    },
  });

  if (!latestToy) {
    return NextResponse.json({ alert: null });
  }

  return NextResponse.json({ 
    alert: {
      id: latestToy.id,
      user: latestToy.user.name,
      item: latestToy.name,
      type: latestToy.type, // "Channel Redeem", "Subscription Reward", etc.
    }
  });
}