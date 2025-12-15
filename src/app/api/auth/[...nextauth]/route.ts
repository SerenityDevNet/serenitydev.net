import NextAuth from "next-auth"
import TwitchProvider from "next-auth/providers/twitch"

const handler = NextAuth({
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
    }),
  ],
  // This tells NextAuth that when we want the user's ID, we can grab it from the session
  callbacks: {
    async session({ session, token }) {
      // Pass the Twitch User ID to the client so we can use it for database lookups later
      if (session.user) {
        session.user.image = token.picture; // Ensure avatar is passed
        // @ts-ignore - NextAuth types are strict, but 'sub' acts as the user ID
        session.user.id = token.sub; 
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }