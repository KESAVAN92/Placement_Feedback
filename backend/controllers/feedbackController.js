const Feedback = require("../models/Feedback");

const normalizeLines = (value) =>
  (value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const submitFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create({
      studentId: req.user.id,
      companyName: req.body.companyName,
      category: req.body.category,
      location: req.body.location,
      attendedDate: req.body.attendedDate,
      rounds: req.body.rounds,
      aptitudeQuestions: Array.isArray(req.body.aptitudeQuestions)
        ? req.body.aptitudeQuestions.filter(Boolean)
        : normalizeLines(req.body.aptitudeQuestions),
      codingQuestions: Array.isArray(req.body.codingQuestions)
        ? req.body.codingQuestions.filter(Boolean)
        : normalizeLines(req.body.codingQuestions),
      interviewQuestions: Array.isArray(req.body.interviewQuestions)
        ? req.body.interviewQuestions.filter(Boolean)
        : normalizeLines(req.body.interviewQuestions),
      extraRoundQuestions: Array.isArray(req.body.extraRoundQuestions)
        ? req.body.extraRoundQuestions.flatMap(normalizeLines)
        : normalizeLines(req.body.extraRoundQuestions),
      tips: req.body.tips,
      struggles: req.body.struggles
    });

    return res.status(201).json(feedback);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCompanyFeedback = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 6);
    const sort = req.query.sort === "oldest" ? 1 : -1;
    const skip = (page - 1) * limit;
    const query = { companyName: req.params.name };

    const [items, total] = await Promise.all([
      Feedback.find(query)
        .populate("studentId", "name department year collegeName")
        .sort({ attendedDate: sort, submittedDate: -1 })
        .skip(skip)
        .limit(limit),
      Feedback.countDocuments(query)
    ]);

    return res.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const typeMap = {
  aptitude: "aptitudeQuestions",
  coding: "codingQuestions",
  interview: "interviewQuestions"
};

const getCompanyQuestions = async (req, res) => {
  try {
    const field = typeMap[req.params.type.toLowerCase()];

    if (!field) {
      return res.status(400).json({ message: "Invalid question type" });
    }

    const feedbacks = await Feedback.find({ companyName: req.params.company }).sort({ attendedDate: -1 });
    const questions = feedbacks.flatMap((feedback) =>
      feedback[field].map((question) => ({
        question,
        companyName: feedback.companyName,
        category: feedback.category,
        location: feedback.location,
        attendedDate: feedback.attendedDate
      }))
    );

    return res.json(questions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { submitFeedback, getCompanyFeedback, getCompanyQuestions };
