const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    maketransaction,
    getMyTransactions,
    getAllTransactions
} = require("../controllers/transactionController");

router.post("/send",authMiddleware,maketransaction);
router.get("/my",authMiddleware,getMyTransactions);

router.get("/all",authMiddleware,getAllTransactions);

module.exports = router;