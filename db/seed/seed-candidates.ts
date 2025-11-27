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
    vision: "Mewujudkan HMTG \"GEA\" ITB yang berdikari dan profesional melalui lingkungan yang inklusif dalam rangka mewujudkan Keberdampakan yang Absolut.",
    mission: "1. Mempersiapkan Anggota HMTG \"GEA\" ITB sebagai calon sarjana dan geologis untuk mewujudkan pribadi yang profesional, cakap, berkarakter dan dapat berdampak bagi lingkungannya.\n\n2. Merancang kaderisasi yang bertujuan untuk mempersiapkan kader untuk menjadi Anggota Biasa HMTG \"GEA\" ITB yang cakap dan berkarakter.\n\n3. Memaksimalkan potensi diri Anggota Biasa HMTG \"GEA\" ITB dalam rangka menjadikan pribadi yang berdampak.\n\n4. Memaksimalkan potensi dan implementasi dari Anggota Biasa HMTG \"GEA\" ITB di bidang keilmuan geologi dan non-geologi untuk mewujudkan keberdampakan yang absolut.\n\n5. Menciptakan lingkungan yang menjunjung tinggi nilai kekeluargaan untuk mewujudkan HMTG \"GEA\" ITB yang inklusif.\n\n6. Mengusahakan pemenuhan kebutuhan dasar Anggota HMTG \"GEA\" ITB untuk mewujudkan kesejahteraan Anggota Biasa HMTG \"GEA\" ITB\n\n7. Menciptakan citra GEA yang profesional dan bermartabat secara nyata di lingkungan eksternal HMTG \"GEA\" ITB.\n\n8. Merancang sistem kesekretariatan yang terpadu dan transparan bagi Anggota Biasa HMTG \"GEA\" ITB.\n\n9. Merancang pengemasan informasi seputar HMTG \"GEA\" ITB yang informatif dan menarik bagi Anggota Biasa HMTG \"GEA\" ITB serta massa eksternal HMTG \"GEA\" ITB.",
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
    vision: "Badan Kesenatoran HMTG \"GEA\" ITB sebagai penyedia wadah aspiratif dan informatif untuk GEA mengetahui dunia dalam langkah menguasai dunia serta bentuk manifestasi suara HMTG \"GEA\" ITB dalam Kongres KM ITB",
    mission: "1. Mewujudkan Badan Kesenatoran HMTG \"GEA\" ITB sebagai wadah terbuka yang mampu mendengar, memahami, menghimpun, mengolah, dan menyuarakan aspirasi seluruh anggota biasa HMTG \"GEA\" ITB.\n\n2. Mewujudkan Badan Kesenatoran HMTG \"GEA\" ITB yang informatif dan transparan dalam mencerdaskan anggota biasa HMTG \"GEA\" ITB terhadap isu di KM ITB ataupun Nasional yang dapat mengganggu kehidupan berkemahasiswaan anggota biasa HMTG \"GEA\" ITB.\n\n3. Mewujudkan Badan Kesenatoran HMTG \"GEA\" ITB yang komunikatif dengan lembaga luar dan dalam HMTG \"GEA\" ITB untuk membuka ruang pembelajaran dan perkembangan diri oleh anggotanya dan badan itu sendiri.",
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
