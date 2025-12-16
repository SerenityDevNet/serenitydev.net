import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextAuthProvider } from "./(website)/components/Providers";
import "./globals.css";

// --- KEEP YOUR METADATA HERE ---
// (Paste your huge metadata object here exactly as it was)
export const metadata: Metadata = {
  title: "SerenityDev",
  description: 'Indie Game Developer creating "Wretched Rose" and "Up to Bat"',
  // ... rest of your metadata
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased text-1xl font-helvetica`}>
        {/* We wrap everything in Auth so both Site AND Overlay can check login if needed */}
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}