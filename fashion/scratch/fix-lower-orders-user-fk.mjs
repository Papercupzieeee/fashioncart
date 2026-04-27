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
  await sequelize.query('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;');
  await sequelize.query('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey1;');
  await sequelize.query(
    'ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;'
  );
  console.log("orders.user_id foreign key normalized to users(id).");
} finally {
  await sequelize.close();
}
