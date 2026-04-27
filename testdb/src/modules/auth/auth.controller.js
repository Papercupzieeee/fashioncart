import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import bcrypt from "bcryptjs";

// Helper for cleaned user response
const buildUserResponse = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

/* ---------------- LOGIN Logic (PostgreSQL + Sequelize) ---------------- */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate Input (Required Fields)
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // 2. Query PostgreSQL using findOne
    const user = await User.findOne({ 
      where: { email: String(email).toLowerCase().trim() } 
    });

    // 3. Handle case when user is NOT found (Avoid undefined errors)
    if (!user) {
      console.error(`Login attempt failed: User not found (${email})`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // 🔥 SAFER PASSWORD CHECK
if (!user.password) {
  console.error("User password missing in DB");
  return res.status(500).json({
    success: false,
    message: "User data corrupted.",
  });
}

const isPasswordValid = await bcrypt.compare(password, user.password);

if (!isPasswordValid) {
  console.error(`Incorrect password for ${email}`);
  return res.status(401).json({
    success: false,
    message: "Invalid credentials.",
  });
}

    // 5. Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, tokenType: "user" },
      process.env.JWT_SECRET || "default_fallback_secret_key_123",
      { expiresIn: "7d" }
    );

    // 6. Return successful response (200)
    console.log(`User logged in successfully: ${email}`);
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: buildUserResponse(user),
    });

  } catch (err) {
    // 7. Log exact error and handle 500
    console.error("CRITICAL LOGIN SERVER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      error: err.message
    });
  }
};

/* ---------------- SIGNUP Logic ---------------- */
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered."
      });
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, tokenType: "user" },
      process.env.JWT_SECRET || "default_fallback_secret_key_123",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Signup successful.",
      token,
      user: buildUserResponse(user),
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    next(err);
  }
};