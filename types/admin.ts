import { adminTokens } from "@/db/schema";

export type AdminToken = typeof adminTokens.$inferSelect;

export type AdminTokenPublic = Omit<AdminToken, "tokenHash">;

export type UserPrivate = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date | null;
};

export type UserPublic = Omit<UserPrivate, "password">;
