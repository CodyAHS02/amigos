import postgres from "postgres";

const globalForDatabase = globalThis;

function createSqlClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return postgres(process.env.DATABASE_URL, {
    max: 10,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 10
  });
}

export const sql = globalForDatabase.sql || createSqlClient();

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.sql = sql;
}
