import { db } from "./drizzle";
import { migrate } from "drizzle-orm/neon-serverless/migrator";

const main = async () => {
  await migrate(db, { migrationsFolder: "db/migrations" });
};

main();
