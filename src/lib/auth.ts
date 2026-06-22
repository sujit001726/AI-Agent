import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth (requires GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET in .env)
    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),

    // Dev credentials fallback — instant login without OAuth setup
    CredentialsProvider({
      name: "Dev Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "dev@leadflow.local" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        // Upsert a dev user in the database
        const user = await prisma.user.upsert({
          where: { email: credentials.email as string },
          update: {},
          create: {
            email: credentials.email as string,
            name: "Dev User",
            emailVerified: new Date(),
          },
        });
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
