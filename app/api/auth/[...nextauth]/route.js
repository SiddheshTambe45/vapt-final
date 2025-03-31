import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { User } from "@/models/user";
import connectDB from "@/lib/mongodb"; // Function to connect MongoDB

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // Keep this secret
    }),
  ],
  session: {
    strategy: "jwt", // Ensures session persists using JWT tokens
    maxAge: 30 * 24 * 60 * 60, // Session expires in 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        await connectDB(); // Connect to MongoDB

        try {
          const existingUser = await User.findOne({ githubId: profile.id });

          console.log(profile);
          console.log(user);
          console.log(account);

          if (!existingUser) {
            await User.create({
              githubId: profile.id,
              username: profile.login, // GitHub username
              email: profile.email,
              name: profile.name || profile.login,
              avatarUrl: profile.avatar_url,
              accessToken: account.access_token, // Store securely if needed
            });
          } else {
            // Update existing user if necessary
            existingUser.accessToken = account.access_token;
            existingUser.avatarUrl = profile.avatar_url;
            await existingUser.save();
          }
        } catch (error) {
          console.error("Error saving user to DB:", error);
          return false; // Prevent login on error
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.githubId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.githubId = token.githubId;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days expiry
        path: "/",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Required for session encryption
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
