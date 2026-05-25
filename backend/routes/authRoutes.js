const express = require("express");
const router = express.Router();
const { signup, login, profile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Clean routes - no duplicates
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);

module.exports = router;