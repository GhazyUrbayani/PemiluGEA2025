import { relations } from "drizzle-orm";
import {
  timestamp,
  pgTable,
  text,
  varchar,
  boolean,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

// ============================================
// TABEL 1: VOTER REGISTRY (DPT)
// ============================================
// Tabel ini menyimpan daftar pemilih yang berhak (DPT)
// dan status apakah mereka sudah memilih atau belum.
// TIDAK menyimpan data suara aktual.
export const voterRegistry = pgTable("voter_registry", {
  email: varchar("email", { length: 256 }).primaryKey(), // Email dari SSO (untuk online voter)
  tokenHash: varchar("token_hash", { length: 256 }), // Hash dari token unik (untuk offline voter), nullable
  hasVoted: boolean("has_voted").default(false).notNull(), // Status sudah memilih
  isEligible: boolean("is_eligible").default(true).notNull(), // Apakah berhak memilih (dari DPT)
  nim: varchar("nim", { length: 20 }), // NIM mahasiswa (opsional untuk tracking)
  angkatan: integer("angkatan"), // Angkatan mahasiswa (opsional)
  voteMethod: varchar("vote_method", { length: 20 }), // 'online' atau 'offline'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// TABEL 2: BALLOT BOX (KOTAK SUARA ANONIM)
// ============================================
// Tabel ini HANYA menyimpan suara terenkripsi.
// TIDAK ADA KOLOM yang bisa menghubungkan ke pemilih tertentu.
// Ini adalah kunci anonimitas sistem.
export const ballotBox = pgTable("ballot_box", {
  id: varchar("id", { length: 256 }).primaryKey(), // ID unik untuk setiap surat suara (UUID)
  encryptedBallotData: jsonb("encrypted_ballot_data").notNull(), // Data suara terenkripsi (JSON)
  // Format setelah dekripsi: { ketuaUmum: ["kandidatA_id", "KOTAK_KOSONG", "kandidatB_id"], senator: [...] }
  castAt: timestamp("cast_at").defaultNow(), // Waktu suara dicatat
  // TIDAK ADA: email, token, nim, userId, atau field yang bisa identify pemilih
});

// ============================================
// TABEL 3: CANDIDATES (DATA KANDIDAT)
// ============================================
// Tabel ini menyimpan data lengkap kandidat untuk Ketua Umum dan Senator
export const candidates = pgTable("candidates", {
  id: varchar("id", { length: 256 }).primaryKey(), // ID unik kandidat (bisa NIM)
  name: text("name").notNull(),
  photoUrl: text("photo_url").notNull(), // URL ke foto kandidat (di public/candidates/)
  major: text("major").notNull(), // Jurusan
  batch: integer("batch").notNull(), // Angkatan
  vision: text("vision").notNull(), // Visi
  mission: text("mission").notNull(), // Misi
  hashtag: varchar("hashtag", { length: 256 }), // Hashtag kampanye (misal: #BawaPerubahan)
  position: varchar("position", { length: 50 }).notNull(), // 'kahim' atau 'senator'
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// TABEL 4: ADMINS (USER PANITIA)
// ============================================
// Tabel untuk menyimpan data admin yang bisa akses hasil voting
export const admins = pgTable("admins", {
  id: varchar("id", { length: 256 }).primaryKey(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: text("password").notNull(), // Hashed password
  name: text("name").notNull(),
  role: varchar("role", { length: 50 }).default("admin").notNull(), // 'admin' atau 'superadmin'
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// RELATIONS (Optional untuk Drizzle ORM)
// ============================================
export const candidatesRelations = relations(candidates, ({ many }) => ({
  // Tidak ada relasi langsung ke ballotBox (karena anonim)
}));

export const voterRegistryRelations = relations(voterRegistry, ({ one }) => ({
  // Tidak ada relasi langsung ke ballotBox (untuk menjaga anonimitas)
}));

// Note: BallotBox sengaja TIDAK memiliki relasi ke tabel lain
// untuk menjaga anonimitas pemilih
