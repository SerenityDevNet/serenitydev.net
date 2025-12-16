"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";

export default function WorkshopPage() {
  // Grab the session data
  const { data: session, status } = useSession();

  // 1. Loading State
  // NextAuth takes a moment to check session status
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <p className="text-2xl animate-pulse">Loading Workshop Data...</p>
      </div>
    );
  }

  // 2. Unauthenticated State
  // If not logged in, kick them back to home (or show a login message)
  if (status === "unauthenticated") {
    redirect("/"); // Or return a "Please Log In" component
  }

  // 3. Authenticated State (The "Spit Data Back" Part)
  return (
    <div className="min-h-screen p-8 text-white font-mono">
      <div className="max-w-4xl mx-auto bg-gray-900/80 rounded-xl p-8 border border-purple-500/30">
        
        <h1 className="text-4xl font-bold mb-8 text-purple-400">
          🔧 The Workshop
        </h1>

        {/* User Profile Section */}
        <div className="flex items-center gap-6 mb-8 border-b border-gray-700 pb-8">
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt="User Avatar"
              width={100}
              height={100}
              className="rounded-full border-4 border-purple-500"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">{session?.user?.name}</h2>
            <p className="text-gray-400">{session?.user?.email}</p>
          </div>
        </div>

        {/* Raw Data Dump Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-yellow-400">
            Received Session Data (JSON Dump)
          </h3>
          <p className="text-sm text-gray-400 mb-2">
            This is exactly what NextAuth is storing for this user. 
            Note the 'id' field - that is your Twitch UID (sub).
          </p>
          
          <div className="bg-black p-4 rounded-lg overflow-x-auto border border-gray-700 shadow-inner">
            <pre className="text-green-400 text-sm">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}