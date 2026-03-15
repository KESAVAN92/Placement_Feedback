const express = require("express");
const {
  submitFeedback,
  getCompanyFeedback,
  getCompanyQuestions,
  getStudentFeedback,
  getStudentFeedbackById,
  updateStudentFeedback,
  deleteStudentFeedback
} = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/submit", protect, submitFeedback);
router.get("/mine", protect, getStudentFeedback);
router.get("/mine/:id", protect, getStudentFeedbackById);
router.put("/mine/:id", protect, updateStudentFeedback);
router.delete("/mine/:id", protect, deleteStudentFeedback);
router.get("/company/:name", protect, getCompanyFeedback);
router.get("/questions/:company/:type", protect, getCompanyQuestions);

module.exports = router;
