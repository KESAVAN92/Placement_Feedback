const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    companyName: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, enum: ["Software", "Hardware"] },
    location: { type: String, required: true, trim: true },
    attendedDate: { type: Date, required: true },
    rounds: { type: Number, required: true, min: 1, max: 5 },
    aptitudeQuestions: { type: [String], default: [] },
    codingQuestions: { type: [String], default: [] },
    interviewQuestions: { type: [String], default: [] },
    extraRoundQuestions: { type: [String], default: [] },
    tips: { type: String, default: "", trim: true },
    struggles: { type: String, default: "", trim: true },
    submittedDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
