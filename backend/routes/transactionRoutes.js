const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/send", authMiddleware, transactionController.makeTransaction);
router.get("/my", authMiddleware, transactionController.getMyTransactions);
router.get("/all", adminMiddleware, transactionController.getAllTransactions);

module.exports = router;
