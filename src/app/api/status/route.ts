import { NextResponse } from 'next/server';

// Server-side "Memory" (Resets if server restarts, which is fine for streaming)
let currentLevel = 'NONE'; 

export async function GET() {
  return NextResponse.json({ level: currentLevel });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (body.level) {
    currentLevel = body.level;
    console.log(`🚨 ALERT LEVEL CHANGED: ${currentLevel}`);
  }
  return NextResponse.json({ success: true, level: currentLevel });
}