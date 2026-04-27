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

const getCounts = async () => {
  const [wishlists] = await sequelize.query('SELECT COUNT(*)::int AS c FROM "wishlists"');
  const [orders] = await sequelize.query('SELECT COUNT(*)::int AS c FROM "orders"');
  return { wishlists: wishlists[0].c, orders: orders[0].c };
};

try {
  const before = await getCounts();

  const addWishlistRes = await fetch("http://localhost:5000/api/wishlist/toggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: 6, productId: 1 }),
  });
  const addWishlistBody = await addWishlistRes.text();
  const afterAdd = await getCounts();

  const removeWishlistRes = await fetch("http://localhost:5000/api/wishlist/toggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: 6, productId: 1 }),
  });
  const removeWishlistBody = await removeWishlistRes.text();
  const afterRemove = await getCounts();

  const orderRes = await fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: 6,
      items: [{ productId: 1, price: 100, quantity: 1 }],
    }),
  });
  const orderBody = await orderRes.text();
  const afterOrder = await getCounts();

  console.log({
    before,
    afterAdd,
    afterRemove,
    afterOrder,
    addWishlistStatus: addWishlistRes.status,
    removeWishlistStatus: removeWishlistRes.status,
    orderStatus: orderRes.status,
    addWishlistBody,
    removeWishlistBody,
    orderBody,
  });
} finally {
  await sequelize.close();
}
