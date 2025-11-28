import { adminTokens } from "@/db/schema";

// Admin types based on new token-based authentication system
export type AdminToken = typeof adminTokens.$inferSelect;

export type AdminTokenPublic = Omit<AdminToken, "tokenHash">;

// Legacy types kept for backward compatibility (NextAuth still uses these)
export type UserPrivate = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date | null;
};

export type UserPublic = Omit<UserPrivate, "password">;
