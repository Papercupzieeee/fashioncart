import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config({ path: "D:/fashion/.env" });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: false,
  }
);

try {
  for (const table of ["orders", "order_items"]) {
    const [rows] = await sequelize.query(`
      SELECT c.conname, pg_get_constraintdef(c.oid) AS definition
      FROM pg_constraint c
      JOIN pg_class t ON t.oid = c.conrelid
      WHERE t.relname = '${table}'
      ORDER BY c.conname
    `);
    console.log(`TABLE=${table}`);
    console.log(rows);
  }
} finally {
  await sequelize.close();
}
