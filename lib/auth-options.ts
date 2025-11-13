import { db } from "@/db/drizzle";
import { admins, voterRegistry } from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { compare } from "bcrypt";
import { eq } from "drizzle-orm";
import type { NextAuthOptions, AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AzureADProvider from "next-auth/providers/azure-ad";
import "server-only";

type Adapter = NextAuthOptions["adapter"];

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Azure AD Provider untuk pemilih online (SSO)
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
    // Credentials Provider untuk admin
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Login",
      credentials: {
        username: { label: "username", placeholder: "Username", type: "text" },
        password: {
          label: "password",
          placeholder: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password) {
          return null;
        }

        // Find admin in database
        const existingAdmin = await db.query.admins.findFirst({
          where: eq(admins.email, credentials.username),
        });

        if (!existingAdmin || !existingAdmin.password) {
          return null;
        }

        // Compare hashed password
        const passwordCheck = await compare(
          credentials.password,
          existingAdmin.password,
        );

        if (!passwordCheck) {
          return null;
        }

        return {
          id: existingAdmin.id,
          email: existingAdmin.email,
          name: existingAdmin.name,
          role: existingAdmin.role,
          password: existingAdmin.password,
          createdAt: existingAdmin.createdAt,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 3600, // 1 jam (sesuai dengan durasi voting session)
  },
  callbacks: {
    /**
     * Callback signIn: Validasi apakah user berhak untuk login
     * PENTING: Untuk Azure AD, kita cek apakah email ada di DPT dan belum voting
     */
    async signIn({ user, account, profile }) {
      // Jika login dengan admin credentials, skip validasi DPT
      if (account?.provider === "admin-credentials") {
        return true;
      }

      // Jika login dengan Azure AD, validasi di DPT
      if (account?.provider === "azure-ad") {
        const email = user.email || profile?.email;

        if (!email) {
          console.error("Email tidak ditemukan dari Azure AD");
          return false;
        }

        // Cek apakah email ada di Voter Registry (DPT)
        const voter = await db.query.voterRegistry.findFirst({
          where: eq(voterRegistry.email, email as string),
        });

        // Jika tidak ada di DPT
        if (!voter) {
          console.error(`Email ${email} tidak terdaftar di DPT`);
          return "/auth/sign-in?error=NotInDPT";
        }

        // Jika tidak eligible
        if (!voter.isEligible) {
          console.error(`Email ${email} tidak eligible untuk voting`);
          return "/auth/sign-in?error=NotEligible";
        }

        // Jika sudah voting
        if (voter.hasVoted) {
          console.error(`Email ${email} sudah melakukan voting`);
          return "/auth/sign-in?error=AlreadyVoted";
        }

        // User valid, allowed to sign in
        return true;
      }

      return true;
    },

    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.role = (user as { role?: string }).role || "voter";
      }

      // Untuk Azure AD, simpan email dari profile
      if (account?.provider === "azure-ad" && profile) {
        token.email = profile.email || user.email;
        token.name = profile.name || user.name;
        token.role = "voter";
      }

      return token;
    },

    async session({ session, token }) {
      // Tambahkan data dari token ke session
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
