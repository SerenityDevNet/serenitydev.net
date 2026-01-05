import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextAuthProvider } from "./components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SerenityDev",
  description: 'Indie Game Developer creating "Wretched Rose" and "Up to Bat"',
  keywords: [
    "indie games",
    "game development",
    "wretched rose",
    "up to bat",
    "serenitydev",
    "serenity dev",
    "serenity_dev",
  ],
  themeColor: "#04010A",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1.0,
  },
  openGraph: {
    type: "website",
    title: "SerenityDev",
    description: 'Indie Game Developer creating "Wretched Rose" and "Up to Bat!"',
    locale: "en_US",
    url: "https://www.serenitydev.net/",
    images: [
      {
        url: "/images/site/banner.png",
        width: 2000,
        height: 500,
        alt: "SerenityDev Site Banner",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "SerenityDev",
    description: 'Indie Game Developer creating "Wretched Rose" and "Up to Bat!"',
    site: "@Serenity_Dev",
    creator: "@Serenity_Dev",
    images: [
      {
        url: "/images/site/banner.png",
        width: 2000,
        height: 500,
        alt: "SerenityDev Site Banner",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased text-1xl font-helvetica`}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}