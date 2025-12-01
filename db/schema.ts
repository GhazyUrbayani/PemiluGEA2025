import {
  timestamp,
  pgTable,
  text,
  varchar,
  boolean,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

export const voterRegistry = pgTable("voter_registry", {
  email: varchar("email", { length: 256 }),
  tokenHash: varchar("token_hash", { length: 256 }),
  hasVoted: boolean("has_voted").default(false).notNull(),
  isEligible: boolean("is_eligible").default(true).notNull(),
  nim: varchar("nim", { length: 20 }).primaryKey(),
  angkatan: integer("angkatan"),
  voteMethod: varchar("vote_method", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ballotBox = pgTable("ballot_box", {
  id: varchar("id", { length: 256 }).primaryKey(),
  encryptedBallotData: jsonb("encrypted_ballot_data").notNull(),
  castAt: timestamp("cast_at").defaultNow(),
});

export const candidates = pgTable("candidates", {
  id: varchar("id", { length: 256 }).primaryKey(),
  name: text("name").notNull(),
  photoUrl: text("photo_url").notNull(),
  major: text("major").notNull(),
  batch: integer("batch").notNull(),
  vision: text("vision").notNull(),
  mission: text("mission").notNull(),
  hashtag: varchar("hashtag", { length: 256 }),
  position: varchar("position", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminTokens = pgTable("admin_tokens", {
  id: varchar("id", { length: 256 }).primaryKey(),
  tokenHash: varchar("token_hash", { length: 256 }).notNull().unique(),
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastUsedAt: timestamp("last_used_at"),
});
