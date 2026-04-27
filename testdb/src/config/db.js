import { Sequelize } from "sequelize";
import pkg from "pg";
const { Client } = pkg;

// ✅ Sequelize connection
export const sequelize = new Sequelize(
  "fashioncart",
  "postgres",
  "DB", // your actual password here
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;

// Admin client for DB creation
const adminClient = new Client({
  user: "postgres",
  password: "DB",
  host: "localhost",
  port: 5432,
  database: "postgres",
});

export async function createDatabase() {
  await adminClient.connect();

  const res = await adminClient.query(
    "SELECT 1 FROM pg_database WHERE datname = 'fashioncart'"
  );

  if (res.rowCount === 0) {
    await adminClient.query("CREATE DATABASE fashioncart");
    console.log("✅ Database created");
  } else {
    console.log("⚠️ Database already exists");
  }

  await adminClient.end();
}