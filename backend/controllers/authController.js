const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

const signup = async (req, res) => {
  try {
    const { name, email, password, department, year, collegeName, city } = req.body;
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const student = await Student.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      department,
      year,
      collegeName,
      city
    });

    return res.status(201).json({
      token: generateToken({ id: student._id, role: "student" }),
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: "student"
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });

    if (!student || !(await bcrypt.compare(password, student.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: generateToken({ id: student._id, role: "student" }),
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: "student"
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    return res.json({
      token: generateToken({ id: "admin", role: "admin" }),
      user: {
        id: "admin",
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        role: "admin"
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login, adminLogin };
