const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  makeTransaction,      
  getMyTransactions,
  getAllTransactions
} = require("../controllers/transactionController");

router.post("/send", authMiddleware, makeTransaction);
router.get("/my", authMiddleware, getMyTransactions);
router.get("/all", authMiddleware, getAllTransactions);

module.exports = router;