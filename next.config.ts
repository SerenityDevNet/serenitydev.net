import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-cdn.jtvnw.net', // Twitch's CDN
        port: '',
        pathname: '/**',
      },
      // You might also need this one later if Twitch changes CDNs or for other assets
      {
        protocol: 'https',
        hostname: 'jtvnw.net',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;