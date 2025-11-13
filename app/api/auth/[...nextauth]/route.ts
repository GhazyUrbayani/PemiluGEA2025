/* eslint-disable @typescript-eslint/no-empty-object-type */
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { UserPrivate, UserPublic } from "@/types/admin";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

declare module "next-auth/jwt" {
  interface JWT extends UserPublic {}
}

declare module "next-auth" {
  interface Session extends UserPublic {}

  interface User extends UserPrivate {}
}
