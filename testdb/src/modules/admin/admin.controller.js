import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "./admin.model.js";

dotenv.config();

const ADMIN_TOKEN_EXPIRES_IN = "8h";

const buildAdminResponse = (admin) => ({
  id: admin.id,
  username: admin.username,
  role: admin.role,
});

export const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const admin = await Admin.findOne({
      where: { username: String(username).trim() },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const isPasswordValid = await admin.checkPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        tokenType: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: ADMIN_TOKEN_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: buildAdminResponse(admin),
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findByPk(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    res.json({
      success: true,
      admin: buildAdminResponse(admin),
    });
  } catch (error) {
    next(error);
  }
};
