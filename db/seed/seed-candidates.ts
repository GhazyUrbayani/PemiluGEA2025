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
    id: "12345001", // NIM
    name: "Budi Santoso",
    photoUrl: "/candidates/kahim/budi-santoso.jpg",
    major: "Teknik Geologi",
    batch: 2022,
    vision: "Mewujudkan GEA yang inklusif, inovatif, dan berdampak bagi mahasiswa Teknik Geologi ITB",
    mission: "1. Meningkatkan partisipasi aktif anggota dalam kegiatan himpunan\n2. Memperkuat sinergi dengan alumni dan industri\n3. Mengembangkan program pengembangan soft skill dan hard skill",
    hashtag: "#GerakBersama",
    position: "kahim",
  },
  {
    id: "12345002",
    name: "Siti Nurhaliza",
    photoUrl: "/candidates/kahim/siti-nurhaliza.jpg",
    major: "Teknik Geologi",
    batch: 2022,
    vision: "GEA yang solid, progresif, dan memberdayakan setiap anggota untuk berkontribusi maksimal",
    mission: "1. Membangun sistem komunikasi internal yang transparan\n2. Menyelenggarakan program pelatihan rutin\n3. Memperluas jaringan kerja sama eksternal",
    hashtag: "#BersamaMaju",
    position: "kahim",
  },
  {
    id: "12345003",
    name: "Ahmad Fauzi",
    photoUrl: "/candidates/kahim/ahmad-fauzi.jpg",
    major: "Teknik Geologi",
    batch: 2023,
    vision: "Membangun GEA yang adaptif terhadap perubahan dan berorientasi pada solusi nyata",
    mission: "1. Digitalisasi sistem administrasi himpunan\n2. Program mentoring antar angkatan\n3. Kegiatan yang mendukung kesejahteraan mahasiswa",
    hashtag: "#InovasiGEA",
    position: "kahim",
  },
];

// Data kandidat Senator
const senatorCandidates = [
  {
    id: "12345101",
    name: "Rina Wulandari",
    photoUrl: "/candidates/senator/rina-wulandari.jpg",
    major: "Teknik Geologi",
    batch: 2022,
    vision: "Menjadi jembatan aspirasi mahasiswa Teknik Geologi di tingkat institut",
    mission: "1. Menyampaikan aspirasi mahasiswa ke KM ITB\n2. Memperjuangkan kebijakan yang pro-mahasiswa\n3. Transparansi penuh dalam setiap keputusan",
    hashtag: "#SuaraKita",
    position: "senator",
  },
  {
    id: "12345102",
    name: "Dimas Pratama",
    photoUrl: "/candidates/senator/dimas-pratama.jpg",
    major: "Teknik Geologi",
    batch: 2023,
    vision: "Senator yang aktif, responsif, dan accountable kepada konstituen",
    mission: "1. Laporan berkala aktivitas di senat\n2. Forum terbuka untuk mendengar aspirasi\n3. Kolaborasi lintas fakultas",
    hashtag: "#AksiNyata",
    position: "senator",
  },
  {
    id: "12345103",
    name: "Maya Puspita",
    photoUrl: "/candidates/senator/maya-puspita.jpg",
    major: "Teknik Geologi",
    batch: 2022,
    vision: "Membangun senat yang representatif dan berdampak bagi seluruh mahasiswa",
    mission: "1. Advokasi kebijakan akademik yang fair\n2. Program kerjasama antar himpunan\n3. Channel komunikasi 24/7 untuk mahasiswa",
    hashtag: "#GerakBersama",
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
