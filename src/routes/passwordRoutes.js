const express = require("express");
const PasswordController = require("../controllers/passwordController");
const { verifyToken, authorizeRole } = require("../middlewares/authMiddleware");
const USER_ROLES = require("../constants/userRole");

const router = express.Router();

router.post(
  "update-password",
  verifyToken,
  authorizeRole([USER_ROLES.USER, USER_ROLES.ADMIN]),
  PasswordController.updatePassword
);
router.post("reset-password", PasswordController.resetPassword);
router.post("forgot-password", PasswordController.forgotPassword);

module.exports = router;
