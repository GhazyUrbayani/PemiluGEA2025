/**
 * db/seed/update-candidates.ts
 * 
 * Script untuk UPDATE data kandidat yang sudah ada di database dengan visi misi lengkap
 * 
 * Jalankan dengan: npx tsx db/seed/update-candidates.ts
 */

import { db } from "../drizzle";
import { candidates } from "../schema";
import { eq } from "drizzle-orm";

async function updateCandidates() {
  console.log("🔄 Updating candidates with full vision and mission...");

  try {
    console.log("\nUpdating Geraldus Yudhistira Davin...");
    await db.update(candidates)
      .set({
        vision: "Mewujudkan HMTG \"GEA\" ITB yang berdikari dan profesional melalui lingkungan yang inklusif dalam rangka mewujudkan Keberdampakan yang Absolut.",
        mission: "1. Mempersiapkan Anggota HMTG \"GEA\" ITB sebagai calon sarjana dan geologis untuk mewujudkan pribadi yang profesional, cakap, berkarakter dan dapat berdampak bagi lingkungannya.\n\n2. Merancang kaderisasi yang bertujuan untuk mempersiapkan kader untuk menjadi Anggota Biasa HMTG \"GEA\" ITB yang cakap dan berkarakter.\n\n3. Memaksimalkan potensi diri Anggota Biasa HMTG \"GEA\" ITB dalam rangka menjadikan pribadi yang berdampak.\n\n4. Memaksimalkan potensi dan implementasi dari Anggota Biasa HMTG \"GEA\" ITB di bidang keilmuan geologi dan non-geologi untuk mewujudkan keberdampakan yang absolut.\n\n5. Menciptakan lingkungan yang menjunjung tinggi nilai kekeluargaan untuk mewujudkan HMTG \"GEA\" ITB yang inklusif.\n\n6. Mengusahakan pemenuhan kebutuhan dasar Anggota HMTG \"GEA\" ITB untuk mewujudkan kesejahteraan Anggota Biasa HMTG \"GEA\" ITB\n\n7. Menciptakan citra GEA yang profesional dan bermartabat secara nyata di lingkungan eksternal HMTG \"GEA\" ITB.\n\n8. Merancang sistem kesekretariatan yang terpadu dan transparan bagi Anggota Biasa HMTG \"GEA\" ITB.\n\n9. Merancang pengemasan informasi seputar HMTG \"GEA\" ITB yang informatif dan menarik bagi Anggota Biasa HMTG \"GEA\" ITB serta massa eksternal HMTG \"GEA\" ITB."
      })
      .where(eq(candidates.id, "12023026"));
    console.log("✅ Updated: Geraldus Yudhistira Davin");

    console.log("\nUpdating Albert Kamaruddin...");
    await db.update(candidates)
      .set({
        vision: "Badan Kesenatoran HMTG \"GEA\" ITB sebagai penyedia wadah aspiratif dan informatif untuk GEA mengetahui dunia dalam langkah menguasai dunia serta bentuk manifestasi suara HMTG \"GEA\" ITB dalam Kongres KM ITB",
        mission: "1. Mewujudkan Badan Kesenatoran HMTG \"GEA\" ITB sebagai wadah terbuka yang mampu mendengar, memahami, menghimpun, mengolah, dan menyuarakan aspirasi seluruh anggota biasa HMTG \"GEA\" ITB.\n\n2. Mewujudkan Badan Kesenatoran HMTG \"GEA\" ITB yang informatif dan transparan dalam mencerdaskan anggota biasa HMTG \"GEA\" ITB terhadap isu di KM ITB ataupun Nasional yang dapat mengganggu kehidupan berkemahasiswaan anggota biasa HMTG \"GEA\" ITB.\n\n3. Mewujudkan Badan Kesenatoran HMTG \"GEA\" ITB yang komunikatif dengan lembaga luar dan dalam HMTG \"GEA\" ITB untuk membuka ruang pembelajaran dan perkembangan diri oleh anggotanya dan badan itu sendiri."
      })
      .where(eq(candidates.id, "12023075"));
    console.log("✅ Updated: Albert Kamaruddin");

    console.log("\n✨ Update completed successfully!");
    console.log("\nVerifying updates...");
    
    const davin = await db.select().from(candidates).where(eq(candidates.id, "12023026"));
    const albert = await db.select().from(candidates).where(eq(candidates.id, "12023075"));
    
    console.log("\n📋 Davin's Vision Length:", davin[0]?.vision.length, "characters");
    console.log("📋 Davin's Mission Length:", davin[0]?.mission.length, "characters");
    console.log("\n📋 Albert's Vision Length:", albert[0]?.vision.length, "characters");
    console.log("📋 Albert's Mission Length:", albert[0]?.mission.length, "characters");
    
  } catch (error) {
    console.error("❌ Error updating candidates:", error);
    process.exit(1);
  }

  process.exit(0);
}

updateCandidates();
