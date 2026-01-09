import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateNewAgent } from '@/lib/lobotomy-utils';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log("🔵 [API] Reroll Endpoint Hit!"); // DEBUG: Must appear in terminal

  try {
    const body = await req.json();
    console.log("🔵 [API] Request Body:", body); // DEBUG

    const { username } = body;
    
    if (!username) {
        console.log("🔴 [API] No username provided");
        return NextResponse.json({ success: false, message: "No username provided" });
    }

    const cleanName = username.toLowerCase();

    // 1. Find Agent
    const agent = await prisma.lobotomyAgent.findUnique({ where: { username: cleanName }});

    if (!agent) {
       console.log(`🔴 [API] Agent ${cleanName} not found`);
       return NextResponse.json({ success: false, message: "Agent not found. Speak in chat first!" });
    }

    // 2. Cost Check
    const COST = 0; 
    console.log(`🔵 [API] Checking Cost: Has ${agent.totalPeBoxes}, Need ${COST}`);

    if (agent.totalPeBoxes < COST) {
        return NextResponse.json({ 
            success: false, 
            message: `Need ${COST} PE-Boxes (You have ${agent.totalPeBoxes})` 
        });
    }

    // 3. Generate New Look
    const fullStats = generateNewAgent(cleanName);
    const { username: _ignored, ...appearanceStats } = fullStats;

    console.log(`🟢 [API] Updating DB for ${cleanName}...`);

    // 4. Update Database
    const updatedAgent = await prisma.lobotomyAgent.update({
        where: { username: cleanName },
        data: {
            ...appearanceStats, 
            totalPeBoxes: { decrement: COST }
        }
    });

    console.log("🟢 [API] DB Update Success!", updatedAgent.hairIndex);

    return NextResponse.json({ 
        success: true, 
        message: "Genetic Restructure Complete.",
        agent: updatedAgent 
    });

  } catch (error) {
    console.error("🔥 [API] CRASH:", error);
    return NextResponse.json({ error: "Reroll failed" }, { status: 500 });
  }
}