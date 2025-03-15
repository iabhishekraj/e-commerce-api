const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

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
    const user = await prisma.user.create({
      data: {
        phone_number,
        email,
        password: hashedPassword,
        role,
        status: "active",
      },
    });

    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    res.status(500).json({ error: "Error registering user", details: error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("email", email);

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true, secure: true });

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
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
