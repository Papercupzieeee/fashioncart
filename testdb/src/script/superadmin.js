import dotenv from "dotenv";
dotenv.config();

import { sequelize, createDatabase } from "../config/db.js";
import User from "../modules/user/user.model.js";
import bcrypt from "bcrypt";

const run = async () => {
  try {
    await createDatabase();

    await sequelize.authenticate();
    await sequelize.sync();

    const username = process.env.SUPER_ADMIN_USERNAME;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!username || !password) {
      throw new Error("SUPER_ADMIN_USERNAME or PASSWORD missing");
    }

    const exists = await User.findOne({
      where: { email: username },
    });

    if (exists) {
      console.log("⚠️ Super admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: "Super Admin",
      email: username,
      password: hashedPassword,
      role: "superadmin",
    });

    console.log("✅ Super admin created successfully");
    process.exit(0);

  } catch (err) {
    console.error("❌ Failed to create super admin", err);
    process.exit(1);
  }
};

run();