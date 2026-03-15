import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";
import { getFeedbackRounds } from "../utils/rounds";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

const MyFeedbackPage = () => {
  const navigate = useNavigate();
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const totalSubmissions = feedbackItems.length;

  useEffect(() => {
    const loadMyFeedback = async () => {
      try {
        const { data } = await api.get("/feedback/mine");
        setFeedbackItems(data.items || []);
        setError("");
      } catch (err) {
        setFeedbackItems([]);
        setError(err.response?.data?.message || "Unable to load your feedback.");
      } finally {
        setLoading(false);
      }
    };

    loadMyFeedback();
  }, []);

  const handleDelete = async (feedbackId) => {
    const shouldDelete = window.confirm("Do you want to delete this feedback?");
    if (!shouldDelete) {
      return;
    }

    try {
      await api.delete(`/feedback/mine/${feedbackId}`);
      setFeedbackItems((current) => current.filter((item) => item._id !== feedbackId));
      setActionMessage("Feedback deleted successfully.");
      setError("");
    } catch (err) {
      setActionMessage("");
      setError(err.response?.data?.message || "Unable to delete feedback.");
    }
  };

  const feedbackCards = useMemo(
    () =>
      feedbackItems.map((item) => ({
        ...item,
        roundList: getFeedbackRounds(item)
      })),
    [feedbackItems]
  );

  return (
    <Layout>
      <section className="rounded-[2rem] bg-white p-8 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Student Module</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">My Submitted Feedback</h1>
            <p className="mt-2 text-sm text-slate-500">See all feedback submitted from your account and manage each entry.</p>
          </div>
          <div className="rounded-3xl bg-slate-100 px-6 py-4 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Total Submitted</p>
            <p className="mt-2 text-4xl font-black text-slate-900">{totalSubmissions}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link to="/submit-feedback" className="rounded-2xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white">
            Add New Feedback
          </Link>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
          >
            Back to Dashboard
          </button>
        </div>

        {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
        {actionMessage && <p className="mt-6 text-sm text-emerald-600">{actionMessage}</p>}
      </section>

      <section className="mt-8 space-y-5">
        {loading && <p className="text-sm text-slate-500">Loading your submitted feedback...</p>}
        {!loading && feedbackCards.length === 0 && !error && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No feedback submitted yet.
          </div>
        )}
        {feedbackCards.map((feedback) => (
          <article key={feedback._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{feedback.companyName}</h2>
                <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                  <p>Category: {feedback.category}</p>
                  <p>Location: {feedback.location}</p>
                  <p>Campus: {feedback.attendedCollegeCampus}</p>
                  <p>Attended: {formatDate(feedback.attendedDate)}</p>
                  <p>Submitted: {formatDate(feedback.submittedDate)}</p>
                  <p>Rounds: {feedback.roundList.length || feedback.rounds}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  to={`/edit-feedback/${feedback._id}`}
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(feedback._id)}
                  className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {feedback.roundList.map((round, roundIndex) => (
                <div key={`${feedback._id}-${round.title}-${roundIndex}`}>
                  <p className="text-sm font-semibold text-slate-800">{round.title}</p>
                  <div className="mt-2 space-y-2 text-sm text-slate-600">
                    {round.questions.map((question, questionIndex) => (
                      <p key={`${feedback._id}-${round.title}-${questionIndex}`}>{questionIndex + 1}. {question}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {feedback.tips && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-800">Tips</p>
                <p className="mt-1 text-sm text-slate-600">{feedback.tips}</p>
              </div>
            )}
            {feedback.struggles && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-800">Struggles</p>
                <p className="mt-1 text-sm text-slate-600">{feedback.struggles}</p>
              </div>
            )}
          </article>
        ))}
      </section>
    </Layout>
  );
};

export default MyFeedbackPage;
