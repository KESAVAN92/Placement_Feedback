const Company = require("../models/Company");

const defaultCompanies = [
  { name: "Intel", category: "Hardware" },
  { name: "Qualcomm", category: "Hardware" },
  { name: "Nvidia", category: "Hardware" },
  { name: "Texas Instruments", category: "Hardware" },
  { name: "Zoho", category: "Software" },
  { name: "TCS", category: "Software" },
  { name: "Infosys", category: "Software" },
  { name: "Wipro", category: "Software" },
  { name: "Google", category: "Software" },
  { name: "Microsoft", category: "Software" }
];

const seedCompanies = async () => {
  for (const company of defaultCompanies) {
    await Company.updateOne({ name: company.name }, company, { upsert: true });
  }
};

const getCompanies = async (req, res) => {
  try {
    const { search = "", category } = req.query;
    const query = {
      isActive: true,
      name: { $regex: search, $options: "i" }
    };

    if (category) {
      query.category = category;
    }

    const companies = await Company.find(query).sort({ category: 1, name: 1 });
    return res.json(companies);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    return res.status(201).json(company);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Company already exists" });
    }
    return res.status(500).json({ message: error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    return res.json({ message: "Company removed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { seedCompanies, getCompanies, createCompany, deleteCompany };
