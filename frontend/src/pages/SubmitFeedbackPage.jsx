import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";
import { buildRoundTitle, roundTypeSuggestions } from "../utils/rounds";

const createRound = (index) => ({
  type: "",
  title: `Round ${index + 1}`,
  questions: ""
});

const resizeRoundDetails = (roundDetails, targetCount) =>
  Array.from({ length: targetCount }, (_, index) => ({
    ...(roundDetails[index] || createRound(index)),
    title: roundDetails[index]?.title || buildRoundTitle(roundDetails[index], index)
  }));

const mapFeedbackToForm = (feedback) => ({
  companyName: feedback.companyName || "",
  category: feedback.category || "Software",
  location: feedback.location || "",
  attendedCollegeCampus: feedback.attendedCollegeCampus || "",
  attendedDate: feedback.attendedDate ? new Date(feedback.attendedDate).toISOString().split("T")[0] : "",
  rounds: feedback.rounds || Math.max(feedback.roundDetails?.length || 1, 1),
  roundDetails:
    feedback.roundDetails?.map((round, index) => ({
      type: round.type || "",
      title: round.title || buildRoundTitle(round, index),
      questions: Array.isArray(round.questions) ? round.questions.join("\n") : ""
    })) || [createRound(0)],
  tips: feedback.tips || "",
  struggles: feedback.struggles || ""
});

const initialForm = {
  companyName: "",
  category: "Software",
  location: "",
  attendedCollegeCampus: "",
  attendedDate: "",
  rounds: 1,
  roundDetails: [createRound(0)],
  tips: "",
  struggles: ""
};

const SubmitFeedbackPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialForm);
  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(isEditMode);
  const rounds = Math.min(5, Math.max(1, Number(formData.rounds) || 1));

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const { data } = await api.get("/companies");
        setCompanies(data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load companies.");
      }
    };

    loadCompanies();
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      return undefined;
    }

    const loadFeedback = async () => {
      try {
        const { data } = await api.get(`/feedback/mine/${id}`);
        setFormData(mapFeedbackToForm(data));
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load feedback for editing.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedback();
  }, [id, isEditMode]);

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      roundDetails: resizeRoundDetails(current.roundDetails, rounds)
    }));
  }, [rounds]);

  const handleCompanyChange = (value) => {
    const selected = companies.find((item) => item.name.toLowerCase() === value.trim().toLowerCase());
    setFormData((current) => ({
      ...current,
      companyName: value,
      category: selected?.category || current.category
    }));
  };

  const handleRoundChange = (index, field, value) => {
    setFormData((current) => ({
      ...current,
      roundDetails: current.roundDetails.map((round, roundIndex) =>
        roundIndex === index
          ? {
              ...round,
              [field]: value,
              title: field === "type" ? buildRoundTitle({ ...round, type: value }, index) : round.title
            }
          : round
      )
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        ...formData,
        rounds,
        roundDetails: formData.roundDetails.slice(0, rounds)
      };

      if (isEditMode) {
        await api.put(`/feedback/mine/${id}`, payload);
        setMessage("Feedback updated successfully.");
      } else {
        await api.post("/feedback/submit", payload);
        setMessage("Feedback submitted successfully.");
      }

      setTimeout(() => navigate(isEditMode ? "/my-feedback" : `/company/${encodeURIComponent(formData.companyName)}`), 700);
    } catch (err) {
      setError(err.response?.data?.message || `Unable to ${isEditMode ? "update" : "submit"} feedback.`);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">{isEditMode ? "Edit Placement Feedback" : "Submit Placement Feedback"}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter the number of rounds first, then describe each round based on the actual company process. Add one question per line.
        </p>

        {isLoading ? (
          <p className="mt-8 text-sm text-slate-500">Loading feedback details...</p>
        ) : (
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
              type="text"
              placeholder="Attended college campus"
              className="rounded-2xl border-slate-200"
              value={formData.attendedCollegeCampus}
              onChange={(e) => setFormData({ ...formData, attendedCollegeCampus: e.target.value })}
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
              onChange={(e) => setFormData((current) => ({ ...current, rounds: e.target.value }))}
              required
            />

            {formData.roundDetails.slice(0, rounds).map((round, index) => (
              <div key={`round-${index}`} className="rounded-3xl border border-slate-200 p-5 md:col-span-2">
                <p className="text-sm font-semibold text-slate-900">{buildRoundTitle(round, index)}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      list="round-type-suggestions"
                      placeholder="Round type or name (Aptitude, Coding, Technical MCQ, HR Interview...)"
                      className="w-full rounded-2xl border-slate-200"
                      value={round.type}
                      onChange={(e) => handleRoundChange(index, "type", e.target.value)}
                      required
                    />
                  </div>
                  <textarea
                    rows="5"
                    placeholder={`Questions asked in round ${index + 1}`}
                    className="rounded-2xl border-slate-200 md:col-span-2"
                    value={round.questions}
                    onChange={(e) => handleRoundChange(index, "questions", e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}

            <datalist id="round-type-suggestions">
              {roundTypeSuggestions.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>

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

            {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
            {message && <p className="text-sm text-emerald-600 md:col-span-2">{message}</p>}
            <button type="submit" className="rounded-2xl bg-brand-700 px-4 py-3 font-semibold text-white md:col-span-2">
              {isEditMode ? "Update Feedback" : "Submit Feedback"}
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default SubmitFeedbackPage;
