import { db } from "./drizzle";
import { migrate } from "drizzle-orm/neon-serverless/migrator";

const main = async () => {
  // this will automatically run needed migrations on the database
  await migrate(db, { migrationsFolder: "db/migrations" });
};

main();
