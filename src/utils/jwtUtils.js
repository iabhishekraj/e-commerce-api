const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

module.exports = {
  generateToken,
};
