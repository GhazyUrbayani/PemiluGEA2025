import * as schema from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
