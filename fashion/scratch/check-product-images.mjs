import fs from "fs";
import path from "path";
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

const uploadsDir = "D:/fashion/uploads";
const imagesDir = "D:/fashion/images";

try {
  const [rows] = await sequelize.query('SELECT id, name, image FROM "Products" ORDER BY id');
  const existing = new Set([
    ...fs.readdirSync(imagesDir),
    ...fs.readdirSync(uploadsDir),
  ]);

  const missing = rows.filter((row) => {
    const filename = row.image ? path.basename(String(row.image)) : "";
    return !filename || !existing.has(filename);
  });

  console.log(`TOTAL=${rows.length}`);
  console.log(`MISSING=${missing.length}`);
  console.log("FIRST_MISSING=", missing.slice(0, 10));
} finally {
  await sequelize.close();
}
