import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure you have your prisma client export here
import { generateNewAgent } from '@/lib/lobotomy-utils';

const MAX_HP = 100;
const MAX_SP = 100;
const REVIVE_MS = 60000; // 1 minute death timer

// Today's Abno Configuration (Ideally this comes from DB too, but hardcoded is fine for now)
const ABNO_RATES = {
  instinct: 60,
  insight: 40,
  attachment: 50,
  repression: 20
};
const DAMAGE = { type: 'BLACK', min: 10, max: 25 };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, workType } = body;
    const cleanName = username.toLowerCase();

    // 1. Get or Create Agent
    let agent = await prisma.lobotomyAgent.findUnique({
      where: { username: cleanName },
    });

    if (!agent) {
      // GENERATE RANDOM LOOK HERE
      const newLook = generateNewAgent(cleanName);
      
      agent = await prisma.lobotomyAgent.create({
        data: {
            ...newLook,
            hp: 100,
            sp: 100
        },
      });
    }

    // 2. Check Status (Dead/Panic?)
    if (agent.status !== 'ACTIVE') {
      // Check if cooldown expired
      if (agent.cooldownUntil && new Date() > agent.cooldownUntil) {
        // Revive logic
        agent = await prisma.lobotomyAgent.update({
          where: { username: cleanName },
          data: { status: 'ACTIVE', hp: MAX_HP, sp: MAX_SP, cooldownUntil: null }
        });
      } else {
        return NextResponse.json({ success: false, message: `Agent is ${agent.status}`, agent });
      }
    }

    // 3. Roll the Dice (Game Logic)
    const roll = Math.random() * 100;
    // @ts-ignore
    const successChance = ABNO_RATES[workType] || 0;
    const isSuccess = roll <= successChance;

    let logMessage = "";
    let peGain = 0;

    if (isSuccess) {
      // --- SUCCESS ---
      peGain = 1;
      logMessage = "Work Result: GOOD";
      
      // Small Heal
      await prisma.lobotomyAgent.update({
        where: { username: cleanName },
        data: {
          hp: Math.min(agent.hp + 5, MAX_HP),
          sp: Math.min(agent.sp + 5, MAX_SP),
          totalPeBoxes: { increment: 1 }
        }
      });

    } else {
      // --- FAILURE ---
      const dmg = Math.floor(Math.random() * (DAMAGE.max - DAMAGE.min) + DAMAGE.min);
      let newHp = agent.hp;
      let newSp = agent.sp;

      // Apply Damage
      if (DAMAGE.type === 'RED' || DAMAGE.type === 'BLACK') newHp -= dmg;
      if (DAMAGE.type === 'WHITE' || DAMAGE.type === 'BLACK') newSp -= dmg;
      if (DAMAGE.type === 'PALE') newHp -= (dmg * 2);

      let newStatus = 'ACTIVE';
      let cooldown = null;

      if (newHp <= 0) {
        newHp = 0;
        newStatus = 'DEAD';
        cooldown = new Date(Date.now() + REVIVE_MS);
        logMessage = `WARNING: Agent ${username} KIA.`;
      } else if (newSp <= 0) {
        newSp = 0;
        newStatus = 'PANIC';
        cooldown = new Date(Date.now() + REVIVE_MS);
        logMessage = `WARNING: Agent ${username} PANICKED.`;
      } else {
        logMessage = `Work Result: BAD (-${dmg} ${DAMAGE.type})`;
      }

      // Save Damage
      await prisma.lobotomyAgent.update({
        where: { username: cleanName },
        data: { hp: newHp, sp: newSp, status: newStatus, cooldownUntil: cooldown }
      });
    }

    return NextResponse.json({ 
      success: true, 
      isWorkSuccess: isSuccess,
      peGain,
      logMessage 
    });

  } catch (error) {
    console.error("Lobotomy Work Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}