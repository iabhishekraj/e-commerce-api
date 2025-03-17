const express = require("express");
const { verifyToken, authorizeRole } = require("../middlewares/auth");
const USER_ROLES = require("../constants/userRole");

const router = express.Router();

// Protected Routes - for test purpose
router.get(
  "/viewAdminReports",
  verifyToken,
  authorizeRole([USER_ROLES.ADMIN]),
  (req, res) => {
    res.status(200).json({ message: "Welcome to admin reports" });
  }
);

module.exports = router;
