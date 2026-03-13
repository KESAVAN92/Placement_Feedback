const Feedback = require("../models/Feedback");
const Company = require("../models/Company");
const { normalizeFeedbackRecord } = require("../utils/feedbackHelpers");

const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("studentId", "name email department year collegeName city")
      .sort({ submittedDate: -1 });
    const companies = await Company.find().sort({ category: 1, name: 1 });
    return res.json({ feedbacks: feedbacks.map(normalizeFeedbackRecord), companies });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    return res.json({ message: "Feedback deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllFeedbacks, deleteFeedback };
