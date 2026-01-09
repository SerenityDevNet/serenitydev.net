import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateNewAgent } from '@/lib/lobotomy-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username')?.toLowerCase();

    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    // 1. Try to find existing agent
    let agent = await prisma.lobotomyAgent.findUnique({
      where: { username },
    });

    // 2. If new, generate and save PERMANENTLY
    if (!agent) {
      const newLook = generateNewAgent(username);
      agent = await prisma.lobotomyAgent.create({
        data: {
            ...newLook,
            hp: 100,
            sp: 100
        },
      });
    }

    return NextResponse.json({ agent });

  } catch (error) {
    console.error("Agent Fetch Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}