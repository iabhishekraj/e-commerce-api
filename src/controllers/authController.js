const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const AuthService = require("../services/authService");

const register = async (req, res) => {
  const { phone_number, email, password, role } = req.body;
  if (!phone_number || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) return res.status(409).json({ message: "User already exists" });

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const userData = {
      phone_number,
      email,
      password: hashedPassword,
      role,
      status: "active",
    };
    const user = await AuthService.createUser(userData);
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({ message: "User registered", userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: "Error registering user", details: error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Find user
    const { token } = await AuthService.loginUser(email, password);

    res.cookie("token", token, { httpOnly: true, secure: true });

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    if (
      error.message === "User not found" ||
      error.message === "Invalid credentials"
    ) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Error logging in", details: error });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  register,
  login,
  logout,
};
