const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    department: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    collegeName: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    role: { type: String, default: "student", enum: ["student"] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
