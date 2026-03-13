const express = require("express");
const { getCompanies, createCompany, deleteCompany } = require("../controllers/companyController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCompanies);
router.post("/", protect, adminProtect, createCompany);
router.delete("/:id", protect, adminProtect, deleteCompany);

module.exports = router;
