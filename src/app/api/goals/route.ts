import { NextResponse } from 'next/server';
import { getFollowerCount } from '@/lib/twitch';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 1. Live Twitch Data (Always Accurate)
  const followers = await getFollowerCount();

  // 2. Database Data (Filtered by Date)
  // Calculate the first day of the current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Count "Subscription Reward" toys created THIS MONTH
  const subs = await prisma.toy.count({
    where: {
      type: "Subscription Reward",
      obtainedAt: {
        gte: startOfMonth, // "Greater Than or Equal to" 1st of month
      },
    }
  });

  // Count "Currency" (Gemstones) created THIS MONTH
  const bits = await prisma.toy.count({
    where: {
      type: "Currency",
      obtainedAt: {
        gte: startOfMonth,
      },
    }
  });

  return NextResponse.json({ 
    followers,
    subs,
    bits
  });
}