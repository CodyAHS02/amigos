import fs from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

async function loadEnvFile(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");

    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);

      if (!match || process.env[match[1]]) continue;

      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

await loadEnvFile(path.join(process.cwd(), ".env.local"));
await loadEnvFile(path.join(process.cwd(), ".env"));

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured.");
}

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  prepare: false,
  idle_timeout: 5,
  connect_timeout: 10
});

const migrationsDir = path.join(process.cwd(), "database");
const migrationFiles = (await fs.readdir(migrationsDir))
  .filter((file) => file.endsWith(".sql"))
  .sort();

try {
  await sql`create table if not exists schema_migrations (
    filename text primary key,
    applied_at timestamptz not null default now()
  )`;

  for (const file of migrationFiles) {
    const [existing] = await sql`select filename from schema_migrations where filename = ${file}`;

    if (existing) {
      console.log(`Skipping ${file}`);
      continue;
    }

    const migrationSql = await fs.readFile(path.join(migrationsDir, file), "utf8");

    await sql.begin(async (transaction) => {
      await transaction.unsafe(migrationSql);
      await transaction`insert into schema_migrations (filename) values (${file})`;
    });

    console.log(`Applied ${file}`);
  }
} finally {
  await sql.end();
}
