import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createDatabase, sequelize } from "./config/db.js";

// ROUTES
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import wishlistRoutes from "./modules/wishlist/wishlist.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import { ensureAdminAccount } from "./modules/admin/admin.service.js";

// MODELS
import "./modules/user/user.model.js";
import "./modules/product/product.model.js";
import "./modules/cart/cart.model.js";
import "./modules/wishlist/wishlist.model.js";
import "./modules/admin/admin.model.js";

import { errorHandler } from "./shared/middleware/error.middleware.js";

dotenv.config();

const app = express();

// =====================
// PATH FIX (IMPORTANT)
// =====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 IMPORTANT: Optimized image loading - mapped directly to frontend images folder!
// Added Validation Log (Rule 5)
app.use("/uploads", (req, res, next) => {
  console.log(`[Backend Image Fetch] Served original image: D:/fashion/images${req.url}`);
  next();
});

const uploadsPath = "D:/fashion/images";
app.use("/uploads", express.static(uploadsPath, {
  maxAge: '1d',
  etag: true
}));

// =====================
// CORS
// =====================
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    return res.sendStatus(200);
  }

  next();
});

// =====================
// BODY PARSER
// =====================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =====================
// ROUTES
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/admin", adminRoutes);

// =====================
// HEALTH CHECK
// =====================
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Fashioncart API is running 🚀",
  });
});

// =====================
// 404 HANDLER
// =====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// =====================
// ERROR HANDLER
// =====================
app.use(errorHandler);

// =====================
// SERVER START
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  try {
    await createDatabase();
    await sequelize.authenticate();
    console.log("✅ Database Connected");

    await sequelize.sync({ alter: true });
    const adminBootstrap = await ensureAdminAccount();
    if (adminBootstrap.created) {
      console.log("Default admin account created from environment variables.");
    }
    console.log("✅ Tables Synced");
  } catch (err) {
    console.log("❌ DB Error:", err.message);
  }
});
