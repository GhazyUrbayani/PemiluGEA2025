/**
 * db/seed/seed-candidates.ts
 * 
 * Script untuk seed data kandidat ke database
 * 
 * Jalankan dengan: npx tsx db/seed/seed-candidates.ts
 */

import { db } from "../drizzle";
import { candidates } from "../schema";

// Data kandidat Ketua Umum BPH
const kahimCandidates = [
  {
    id: "12023026", // NIM
    name: "Geraldus Yudhistira Davin",
    photoUrl: "/Davin.png", // Foto ada di public/Davin.png
    major: "Teknik Geologi",
    batch: 2023,
    vision: "Mewujudkan GEA yang inklusif, inovatif, dan berdampak bagi mahasiswa Teknik Geologi ITB",
    mission: "1. Meningkatkan partisipasi aktif anggota dalam kegiatan himpunan\n2. Memperkuat sinergi dengan alumni dan industri\n3. Mengembangkan program pengembangan soft skill dan hard skill",
    hashtag: "#GerakBersama",
    position: "kahim",
  },
];

// Data kandidat Senator
const senatorCandidates = [
  {
    id: "12023075",
    name: "Albert Kamaruddin",
    photoUrl: "/Albert.png", // Foto ada di public/Albert.png
    major: "Teknik Geologi",
    batch: 2023,
    vision: "Menjadi jembatan aspirasi mahasiswa Teknik Geologi di tingkat institut",
    mission: "1. Menyampaikan aspirasi mahasiswa ke KM ITB\n2. Memperjuangkan kebijakan yang pro-mahasiswa\n3. Transparansi penuh dalam setiap keputusan",
    hashtag: "#SuaraKita",
    position: "senator",
  },
];

async function seedCandidates() {
  console.log("🌱 Seeding candidates...");

  try {
    // Insert Ketua Umum candidates
    console.log("Inserting Ketua Umum candidates...");
    for (const candidate of kahimCandidates) {
      await db.insert(candidates).values(candidate);
      console.log(`✅ Inserted: ${candidate.name} (${candidate.id})`);
    }

    // Insert Senator candidates
    console.log("\nInserting Senator candidates...");
    for (const candidate of senatorCandidates) {
      await db.insert(candidates).values(candidate);
      console.log(`✅ Inserted: ${candidate.name} (${candidate.id})`);
    }

    console.log("\n✨ Seeding completed successfully!");
    console.log(`Total candidates inserted: ${kahimCandidates.length + senatorCandidates.length}`);
  } catch (error) {
    console.error("❌ Error seeding candidates:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Run seed
seedCandidates();
