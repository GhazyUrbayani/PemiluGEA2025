import { db } from "@/db/drizzle";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthOptions, AuthOptions } from "next-auth";
import "server-only";

type Adapter = NextAuthOptions["adapter"];

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [],
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  callbacks: {
    async signIn() {
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.role = (user as { role?: string }).role || "voter";
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        email: token.email as string,
        name: token.name as string,
        role: token.role as string,
      };
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in",
  },
};
