import { db } from "../drizzle";
import { candidates } from "../schema";
import { eq } from "drizzle-orm";

async function addKotakKosong() {
  console.log("🗳️ Adding Kotak Kosong candidates...");

  try {
    const existingKahim = await db
      .select()
      .from(candidates)
      .where(eq(candidates.id, "KOTAK_KOSONG_KAHIM"));

    if (existingKahim.length === 0) {
      await db.insert(candidates).values({
        id: "KOTAK_KOSONG_KAHIM",
        name: "Kotak Kosong",
        photoUrl: "/logos/pemilu logo fix.png",
        major: "",
        batch: 0,
        vision: "Tidak memilih kandidat manapun untuk posisi Ketua Umum",
        mission: "Tidak memilih kandidat manapun untuk posisi Ketua Umum",
        hashtag: null,
        position: "kahim",
      });
      console.log("✅ Added Kotak Kosong for Kahim");
    } else {
      console.log("ℹ️ Kotak Kosong for Kahim already exists");
    }

    const existingSenator = await db
      .select()
      .from(candidates)
      .where(eq(candidates.id, "KOTAK_KOSONG_SENATOR"));

    if (existingSenator.length === 0) {
      await db.insert(candidates).values({
        id: "KOTAK_KOSONG_SENATOR",
        name: "Kotak Kosong",
        photoUrl: "/logos/pemilu logo fix.png",
        major: "",
        batch: 0,
        vision: "Tidak memilih kandidat manapun untuk posisi Senator",
        mission: "Tidak memilih kandidat manapun untuk posisi Senator",
        hashtag: null,
        position: "senator",
      });
      console.log("✅ Added Kotak Kosong for Senator");
    } else {
      console.log("ℹ️ Kotak Kosong for Senator already exists");
    }

    console.log("🎉 Kotak Kosong setup complete!");
  } catch (error) {
    console.error("❌ Error adding Kotak Kosong:", error);
    throw error;
  }
}

addKotakKosong()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
