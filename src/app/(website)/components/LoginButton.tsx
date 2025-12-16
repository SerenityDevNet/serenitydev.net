"use client"; // This must be a client component

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg text-white">
        <img 
          src={session.user.image || ""} 
          alt="Avatar" 
          className="w-10 h-10 rounded-full border-2 border-purple-500"
        />
        <div>
          <p className="font-bold">{session.user.name}</p>
          <button onClick={() => signOut()} className="text-xs text-red-400 hover:underline">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("twitch")}
      className="bg-[#6441a5] hover:bg-[#503484] text-white font-bold py-2 px-4 rounded transition-colors"
    >
      Connect with Twitch
    </button>
  );
}