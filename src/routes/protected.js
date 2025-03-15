const express = require("express");
const { verifyToken, authorizeRole } = require("../middlewares/auth");

const router = express.Router();

// Protected Routes - for test purpose
router.get(
  "/viewAdminReports",
  verifyToken,
  authorizeRole("admin"),
  (req, res) => {
    res.status(200).json({ message: "Welcome to admin reports" });
  }
);

module.exports = router;
