const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/stats", adminMiddleware, adminController.getStats);
router.get("/alerts", adminMiddleware, adminController.getAlerts);
router.put("/alerts/:id", adminMiddleware, adminController.updateAlert);
router.get("/users", adminMiddleware, adminController.getUsers);
router.put("/users/:id", adminMiddleware, adminController.updateUser);
router.get("/today-stats", adminMiddleware, adminController.getTodayStats);
router.get("/month-stats", adminMiddleware, adminController.getMonthStats);
router.get("/search", adminMiddleware, adminController.searchAll);

module.exports = router;
