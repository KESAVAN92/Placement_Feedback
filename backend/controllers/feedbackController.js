const Feedback = require("../models/Feedback");
const {
  normalizeLines,
  normalizeRoundType,
  buildRoundTitle,
  getRoundDetails,
  getQuestionBucket,
  groupLegacyFieldsFromRounds,
  normalizeFeedbackRecord,
  questionTabs
} = require("../utils/feedbackHelpers");

const buildFeedbackPayload = (payload, studentId) => {
  const requestedRounds = Math.min(5, Math.max(1, Number(payload.rounds) || 1));
  const roundDetails = Array.isArray(payload.roundDetails)
    ? payload.roundDetails
        .slice(0, requestedRounds)
        .map((round, index) => {
          const type = normalizeRoundType(round.type);
          const questions = Array.isArray(round.questions)
            ? round.questions.map((question) => String(question || "").trim()).filter(Boolean)
            : normalizeLines(round.questions);

          return {
            type,
            title: round.title?.trim() || buildRoundTitle(type, index),
            questions
          };
        })
        .filter((round) => round.type || round.questions.length > 0)
    : [];
  const legacyGroups = groupLegacyFieldsFromRounds(roundDetails);

  return {
    studentId,
    companyName: payload.companyName,
    category: payload.category,
    location: payload.location,
    attendedCollegeCampus: payload.attendedCollegeCampus,
    attendedDate: payload.attendedDate,
    rounds: requestedRounds,
    roundDetails,
    aptitudeQuestions: legacyGroups.aptitudeQuestions,
    codingQuestions: legacyGroups.codingQuestions,
    interviewQuestions: legacyGroups.interviewQuestions,
    extraRoundQuestions: [],
    tips: payload.tips,
    struggles: payload.struggles
  };
};

const submitFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(buildFeedbackPayload(req.body, req.user.id));

    return res.status(201).json(normalizeFeedbackRecord(feedback));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getStudentFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ studentId: req.user.id }).sort({ submittedDate: -1, createdAt: -1 });

    return res.json({
      total: feedback.length,
      items: feedback.map(normalizeFeedbackRecord)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getStudentFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ _id: req.params.id, studentId: req.user.id });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    return res.json(normalizeFeedbackRecord(feedback));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateStudentFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ _id: req.params.id, studentId: req.user.id });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    Object.assign(feedback, buildFeedbackPayload(req.body, req.user.id));
    await feedback.save();

    return res.json(normalizeFeedbackRecord(feedback));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteStudentFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ _id: req.params.id, studentId: req.user.id });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await feedback.deleteOne();

    return res.json({ message: "Feedback deleted successfully" });
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
      items: items.map(normalizeFeedbackRecord),
      availableRoundTypes: questionTabs,
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

const getCompanyQuestions = async (req, res) => {
  try {
    const requestedType = normalizeRoundType(req.params.type);

    const feedbacks = await Feedback.find({ companyName: req.params.company }).sort({ attendedDate: -1 });
    const questions = feedbacks.flatMap((feedback) =>
      getRoundDetails(feedback)
        .filter((round) => getQuestionBucket(round.type) === requestedType)
        .flatMap((round) =>
          round.questions.map((question) => ({
            question,
            roundTitle: round.title,
            roundType: round.type,
            companyName: feedback.companyName,
            category: feedback.category,
            location: feedback.location,
            attendedCollegeCampus: feedback.attendedCollegeCampus,
            attendedDate: feedback.attendedDate
          }))
        )
    );

    return res.json(questions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitFeedback,
  getCompanyFeedback,
  getCompanyQuestions,
  getStudentFeedback,
  getStudentFeedbackById,
  updateStudentFeedback,
  deleteStudentFeedback
};
