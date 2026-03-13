const express = require("express");
const { getAllFeedbacks, deleteFeedback } = require("../controllers/adminController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/feedbacks", protect, adminProtect, getAllFeedbacks);
router.delete("/feedback/:id", protect, adminProtect, deleteFeedback);

module.exports = router;
