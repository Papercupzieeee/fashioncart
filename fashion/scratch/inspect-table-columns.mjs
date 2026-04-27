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

const inspect = async (tableName) => {
  const [rows] = await sequelize.query(
    `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = :tableName
      ORDER BY ordinal_position
    `,
    { replacements: { tableName } }
  );
  return rows;
};

try {
  for (const table of ["wishlists", "Wishlists", "orders", "Orders", "order_items", "carts", "Carts"]) {
    const cols = await inspect(table);
    console.log(`\nTABLE=${table}`);
    console.log(cols);
  }
} finally {
  await sequelize.close();
}
