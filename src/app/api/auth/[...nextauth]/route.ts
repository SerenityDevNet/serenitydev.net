import NextAuth, { NextAuthOptions } from "next-auth"
import TwitchProvider from "next-auth/providers/twitch"

// 1. Determine base URL (handles localhost vs production)
const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

// 2. Define AND EXPORT the options object
// The "export" keyword here is what fixes your error.
export const authOptions: NextAuthOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
      authorization: {
        params: {
          // This forces the correct callback URL for Vercel/Localhost
          redirect_uri: `${BASE_URL}/api/auth/callback/twitch`,
          // This ensures we don't ask for email if you don't want to
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.image = token.picture;
        // @ts-ignore - We inject the UID so we can identify the user in the DB
        session.user.id = token.sub;
      }
      return session;
    },
  },
}

// 3. Pass the options to the handler
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }