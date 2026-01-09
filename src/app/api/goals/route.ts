import { NextResponse } from 'next/server';

// Forces Next.js to run this every time (so if you change the numbers here, they update instantly)
export const dynamic = 'force-dynamic';

export async function GET() {
  // --- MANUAL OVERRIDE MODE ---
  // Since the token logic is fighting us, we just return these hardcoded values.
  // You can edit these numbers right here anytime you want to update the overlay manually.
  
  const manualStats = {
    followers: 25,  // As requested
    subs: 0,        // As requested
    bits: 0         // As requested
  };

  return NextResponse.json(manualStats);
}