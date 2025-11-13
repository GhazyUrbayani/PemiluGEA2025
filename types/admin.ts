import { admins } from "@/db/schema";

export type UserPrivate = typeof admins.$inferSelect;

export type UserPublic = Omit<UserPrivate, "password">;
