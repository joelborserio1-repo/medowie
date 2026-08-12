import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, "..", "supabase", "migrations");

const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("No POSTGRES_URL_NON_POOLING / POSTGRES_URL in env");
  process.exit(1);
}

const ref = (connectionString.match(/([a-z0-9]{20})/) || [])[1] || "?";
console.log("Target project ref:", ref);

const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();
  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    process.stdout.write(`Applying ${file} ... `);
    try {
      await client.query(sql);
      console.log("ok");
    } catch (e) {
      console.log("FAILED");
      console.error(`  ${e.code || ""} ${e.message}`);
      throw e;
    }
  }
  console.log("\nAll migrations applied.");
}

main()
  .catch((e) => {
    console.error("\nMigration run aborted:", e.message);
    process.exit(1);
  })
  .finally(() => client.end());
