import "dotenv/config";
import dotenv from "dotenv";
import path from "path";
import { Client } from "pg";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();
  const res = await client.query(`
    SELECT email, role, status, "passwordHash" IS NOT NULL as "hasHash", LEFT("passwordHash", 10) as "hashPrefix"
    FROM "User"
    ORDER BY role, email
  `);
  console.table(res.rows);
  await client.end();
}

main().catch(console.error);
