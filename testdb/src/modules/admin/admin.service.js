import Admin from "./admin.model.js";

export const ensureAdminAccount = async () => {
  const username = process.env.ADMIN_USERNAME || process.env.SUPER_ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD || process.env.SUPER_ADMIN_PASSWORD;

  if (!username || !password) {
    return { created: false, skipped: true };
  }

  const existingAdmin = await Admin.findOne({
    where: { username: String(username).trim() },
  });

  if (existingAdmin) {
    return { created: false, skipped: false };
  }

  await Admin.create({
    username: String(username).trim(),
    password,
    role: "admin",
  });

  return { created: true, skipped: false };
};
