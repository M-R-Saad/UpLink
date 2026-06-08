import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

// Lightweight config used by middleware (no DB imports at top level)
const authConfig = {
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        // Dynamic import keeps Mongoose out of the edge runtime
        const { connectDB } = await import("./db");
        const { default: User } = await import("../models/User");
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid || !user.isActive) return null;
        return {
          id:        user._id.toString(),
          name:      user.name,
          email:     user.email,
          role:      user.role,
          image:     user.photoURL,
          companyId: user.company?.toString() || null,
        };
      },
    }),
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { connectDB } = await import("./db");
        const { default: User } = await import("../models/User");
        await connectDB();
        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({
            name:         user.name,
            email:        user.email,
            photoURL:     user.image,
            authProvider: "google",
            role:         "jobseeker",
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const { connectDB } = await import("./db");
        const { default: User } = await import("../models/User");
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id        = dbUser._id.toString();
          token.role      = dbUser.role;
          token.companyId = dbUser.company?.toString() || null;
          token.photoURL  = dbUser.photoURL;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id        = token.id;
      session.user.role      = token.role;
      session.user.companyId = token.companyId;
      session.user.photoURL  = token.photoURL;
      return session;
    },
  },
  pages:   { signIn: "/login" },
  session: { strategy: "jwt" },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
