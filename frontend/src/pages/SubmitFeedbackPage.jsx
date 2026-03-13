import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";

const initialForm = {
  companyName: "",
  category: "Software",
  location: "",
  attendedDate: "",
  rounds: 1,
  aptitudeQuestions: "",
  codingQuestions: "",
  interviewQuestions: "",
  extraRoundQuestions: ["", ""],
  tips: "",
  struggles: ""
};

const roundFieldLabels = [
  { key: "aptitudeQuestions", placeholder: "Round 1: Aptitude questions" },
  { key: "codingQuestions", placeholder: "Round 2: Coding questions" },
  { key: "interviewQuestions", placeholder: "Round 3: Interview questions" },
  { key: "extraRoundQuestions", placeholder: "Round 4: Additional round questions" },
  { key: "extraRoundQuestions", placeholder: "Round 5: Additional round questions" }
];

const SubmitFeedbackPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState("");
  const rounds = Math.min(5, Math.max(1, Number(formData.rounds) || 1));

  useEffect(() => {
    const loadCompanies = async () => {
      const { data } = await api.get("/companies");
      setCompanies(data);
    };

    loadCompanies();
  }, []);

  const handleCompanyChange = (value) => {
    const selected = companies.find((item) => item.name.toLowerCase() === value.trim().toLowerCase());
    setFormData((current) => ({
      ...current,
      companyName: value,
      category: selected?.category || current.category
    }));
  };

  const handleExtraRoundChange = (index, value) => {
    setFormData((current) => {
      const extraRoundQuestions = [...current.extraRoundQuestions];
      extraRoundQuestions[index] = value;
      return { ...current, extraRoundQuestions };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.post("/feedback/submit", { ...formData, rounds });
    setMessage("Feedback submitted successfully.");
    setTimeout(() => navigate(`/company/${encodeURIComponent(formData.companyName)}`), 700);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">Submit Placement Feedback</h1>
        <p className="mt-2 text-sm text-slate-500">The question boxes accept one question per line.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            list="company-suggestions"
            placeholder="Enter company name"
            className="rounded-2xl border-slate-200"
            value={formData.companyName}
            onChange={(e) => handleCompanyChange(e.target.value)}
            required
          />
          <datalist id="company-suggestions">
            {companies.map((company) => (
              <option key={company._id} value={company.name}>
                {company.category}
              </option>
            ))}
          </datalist>
          <select
            className="rounded-2xl border-slate-200"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
          </select>
          <input
            type="text"
            placeholder="Company location"
            className="rounded-2xl border-slate-200"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
          <input
            type="date"
            className="rounded-2xl border-slate-200"
            value={formData.attendedDate}
            onChange={(e) => setFormData({ ...formData, attendedDate: e.target.value })}
            required
          />
          <input
            type="number"
            min="1"
            max="5"
            placeholder="Enter number of rounds"
            className="rounded-2xl border-slate-200 md:col-span-2"
            value={formData.rounds}
            onChange={(e) => setFormData({ ...formData, rounds: e.target.value })}
            required
          />

          {roundFieldLabels.slice(0, rounds).map((field, index) => (
            <textarea
              key={`${field.key}-${index}`}
              rows="5"
              placeholder={field.placeholder}
              className="rounded-2xl border-slate-200 md:col-span-2"
              value={
                field.key === "extraRoundQuestions"
                  ? formData.extraRoundQuestions[index - 3] || ""
                  : formData[field.key]
              }
              onChange={(e) =>
                field.key === "extraRoundQuestions"
                  ? handleExtraRoundChange(index - 3, e.target.value)
                  : setFormData({ ...formData, [field.key]: e.target.value })
              }
            />
          ))}

          <textarea
            rows="4"
            placeholder="Tips for juniors"
            className="rounded-2xl border-slate-200 md:col-span-2"
            value={formData.tips}
            onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
          />
          <textarea
            rows="4"
            placeholder="Struggles faced during the drive"
            className="rounded-2xl border-slate-200 md:col-span-2"
            value={formData.struggles}
            onChange={(e) => setFormData({ ...formData, struggles: e.target.value })}
          />

          {message && <p className="md:col-span-2 text-sm text-emerald-600">{message}</p>}
          <button type="submit" className="rounded-2xl bg-brand-700 px-4 py-3 font-semibold text-white md:col-span-2">
            Submit Feedback
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default SubmitFeedbackPage;
