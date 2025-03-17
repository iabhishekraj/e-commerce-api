const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// Verify Token Middleware
const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
  console.log("token", token);
  if (!token) return res.status(403).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Role Authorization Middleware
const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ error: "Forbidden: Insufficient permissions" });
  }
  next();
};

module.exports = authorizeRole;

module.exports = { verifyToken, authorizeRole };
