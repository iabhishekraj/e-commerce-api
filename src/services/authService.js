const prisma = require("../config/prisma");
const JWTUtil = require("../utils/jwtUtils");
const bcrypt = require("bcryptjs");

const createUser = async (userData) => {
  return await prisma.user.create({ data: userData });
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  //   verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  //   generate a token
  const token = JWTUtil.generateToken(user);

  return { user, token };
};

module.exports = {
  createUser,
  loginUser,
};
