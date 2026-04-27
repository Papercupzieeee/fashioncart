import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../../modules/user/user.model.js";

dotenv.config();

const getBearerToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { token: null };
  }
  return { token: authHeader.split(" ")[1] };
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

export const authMiddleware = async (req, res, next) => {
  try {
    const { token } = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const adminAuthMiddleware = (req, res, next) => {
  try {
    const { token } = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ success: false, message: "No admin token provided" });
    }

    const decoded = verifyToken(token);
    // Support either user with role admin or dedicated admin token
    if (decoded.role !== 'admin' && decoded.tokenType !== 'admin') {
      return res.status(403).json({ success: false, message: "Admin access only" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Admin authentication failed" });
  }
};

export const isAdmin = (req, res, next) => {
  if ((req.user && req.user.role === 'admin') || (req.admin && req.admin.role === 'admin')) {
    return next();
  }
  return res.status(403).json({ success: false, message: "Admin access only" });
};