import fs from "fs";
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

const imageFiles = fs
  .readdirSync("D:/fashion/images")
  .filter((name) => !["fallback.png", "no-image.png"].includes(name.toLowerCase()))
  .sort((a, b) => a.localeCompare(b));

const takeNextMatching = (available, matcher) => {
  const index = available.findIndex(matcher);
  if (index === -1) return null;
  const [value] = available.splice(index, 1);
  return value;
};

const pickImageForProduct = (product, available) => {
  const text = `${product.name || ""} ${product.category || ""}`.toLowerCase();

  if (text.includes("kids")) {
    return takeNextMatching(available, (n) => n.toLowerCase().startsWith("kid"));
  }
  if (text.includes("beauty") || text.includes("soap") || text.includes("serum") || text.includes("shampoo")) {
    return takeNextMatching(available, (n) => n.toLowerCase().startsWith("soap"));
  }
  if (text.includes("shoe") || text.includes("sneaker") || text.includes("boot")) {
    return takeNextMatching(available, (n) => ["boots.jpg", "heels.jpg", "loaf.jpg", "shoes.jpg"].includes(n.toLowerCase()));
  }
  if (text.includes("shirt")) {
    return takeNextMatching(available, (n) => ["white shirt.jpg", "casual.jpg", "silk.jpg", "round.jpg", "top.jpg"].includes(n.toLowerCase()));
  }
  if (text.includes("jean")) {
    return takeNextMatching(available, (n) => ["jeans.jpg", "bluejeans.avif", "skinny.jpg", "slim.jpg"].includes(n.toLowerCase()));
  }
  if (text.includes("saree") || text.includes("salwar") || text.includes("kurti")) {
    return takeNextMatching(available, (n) => ["saree.jpg", "salwar.jpg", "kurt.jpg", "chudi.jpg", "lehanga.jpg"].includes(n.toLowerCase()));
  }
  return null;
};

try {
  const [rows] = await sequelize.query('SELECT id, name, category FROM "Products" ORDER BY id');
  const available = [...imageFiles];
  const assignments = [];

  for (const product of rows) {
    let chosen = pickImageForProduct(product, available);
    if (!chosen) {
      chosen = available.shift() || imageFiles[(assignments.length % imageFiles.length)];
    }
    assignments.push({ id: product.id, image: chosen, name: product.name });
  }

  for (const item of assignments) {
    await sequelize.query('UPDATE "Products" SET image = :image WHERE id = :id', {
      replacements: { id: item.id, image: item.image },
    });
  }

  const uniqueImages = new Set(assignments.map((a) => a.image));
  console.log(`UPDATED_PRODUCTS=${assignments.length}`);
  console.log(`UNIQUE_IMAGES_USED=${uniqueImages.size}`);
  console.log("SAMPLE=", assignments.slice(0, 12));
} finally {
  await sequelize.close();
}
