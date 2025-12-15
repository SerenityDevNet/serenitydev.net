import NextAuth, { NextAuthOptions } from "next-auth"
import TwitchProvider from "next-auth/providers/twitch"

// Define authOptions internally (no export needed for this file)
const authOptions: NextAuthOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.image = token.picture;
        // @ts-ignore
        session.user.id = token.sub; 
      }
      return session
    },
    // Add the redirect callback
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin (handles localhost, beta, prod)
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl; // Default fallback to the base URL
    }
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
