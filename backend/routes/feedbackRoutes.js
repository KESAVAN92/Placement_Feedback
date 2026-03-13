const express = require("express");
const { submitFeedback, getCompanyFeedback, getCompanyQuestions } = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/submit", protect, submitFeedback);
router.get("/company/:name", protect, getCompanyFeedback);
router.get("/questions/:company/:type", protect, getCompanyQuestions);

module.exports = router;
