import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET() {
  // Read the global variable we set in the Webhook Handler
  // This connects the POST (Twitch) to the GET (Overlay)
  const alert = global.latestAlert || null;

  return NextResponse.json({ 
    alert: alert 
  });
}