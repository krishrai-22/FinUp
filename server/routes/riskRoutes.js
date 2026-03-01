const express = require("express");
const router = express.Router();
const {
    calculateRiskHandler,
    simulateHandler,
    getHistoryHandler,
} = require("../controllers/riskController");
const { protect } = require("../middleware/auth");

// All risk routes require authentication
router.post("/calculate-risk", protect, calculateRiskHandler);
router.post("/simulate", protect, simulateHandler);
router.get("/history", protect, getHistoryHandler);

module.exports = router;
