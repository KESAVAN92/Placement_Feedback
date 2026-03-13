import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import FeedbackCard from "../components/FeedbackCard";
import api from "../services/api";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

const CompanyPage = () => {
  const { name } = useParams();
  const companyName = decodeURIComponent(name);
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const page = Number(searchParams.get("page") || 1);
  const sort = searchParams.get("sort") || "latest";
  const [feedbackData, setFeedbackData] = useState({ items: [], pagination: {}, availableRoundTypes: [] });
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  const tabs = feedbackData.availableRoundTypes || [];
  const tabValues = tabs.map((tab) => tab.value);
  const fallbackTab = tabValues[0] || "";
  const activeTab = requestedTab && tabValues.includes(requestedTab) ? requestedTab : fallbackTab;
  const tabKey = tabValues.join("|");

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const { data } = await api.get(`/feedback/company/${encodeURIComponent(companyName)}?page=${page}&sort=${sort}`);
        setFeedbackData(data);
        setError("");
      } catch (err) {
        setFeedbackData({ items: [], pagination: {}, availableRoundTypes: [] });
        setError(err.response?.data?.message || "Unable to load company feedback.");
      }
    };

    loadFeedback();
  }, [companyName, page, sort]);

  useEffect(() => {
    if (!tabs.length) {
      setQuestions([]);
      return;
    }

    if (!requestedTab || !tabValues.includes(requestedTab)) {
      setSearchParams({ tab: fallbackTab, sort, page: 1 }, { replace: true });
      return;
    }

    const loadQuestions = async () => {
      try {
        const { data } = await api.get(`/feedback/questions/${encodeURIComponent(companyName)}/${requestedTab}`);
        setQuestions(data);
        setError("");
      } catch (err) {
        setQuestions([]);
        setError(err.response?.data?.message || "Unable to load question bank.");
      }
    };

    loadQuestions();
  }, [companyName, fallbackTab, requestedTab, setSearchParams, sort, tabKey]);

  return (
    <Layout>
      <section className="rounded-[2rem] bg-white p-8 shadow-lg">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Company Page</p>
            <h1 className="mt-2 text-4xl font-black text-slate-900">{companyName}</h1>
          </div>
          <div className="flex gap-3">
            <select
              className="rounded-2xl border-slate-200"
              value={sort}
              onChange={(e) => setSearchParams(activeTab ? { tab: activeTab, sort: e.target.value, page: 1 } : { sort: e.target.value, page: 1 })}
            >
              <option value="latest">Latest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <Link
              to={activeTab ? `/questions/${encodeURIComponent(companyName)}?tab=${activeTab}` : `/questions/${encodeURIComponent(companyName)}`}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Open Questions
            </Link>
          </div>
        </div>

        {tabs.length > 0 && (
          <div className="mt-8 flex gap-3 overflow-x-auto border-b border-slate-200 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSearchParams({ tab: tab.value, sort, page: 1 })}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  activeTab === tab.value ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {questions.map((item, index) => (
            <div key={`${item.question}-${index}`} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">{item.question}</p>
              <p className="mt-2 text-xs text-slate-500">
                ({item.attendedCollegeCampus || "Campus not provided"}, {item.location}, {formatDate(item.attendedDate)})
              </p>
            </div>
          ))}
          {tabs.length === 0 && <p className="text-sm text-slate-500">No round-specific questions available yet.</p>}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-5 text-2xl font-bold text-slate-900">All feedback submissions</h2>
        <div className="space-y-5">
          {feedbackData.items.map((feedback) => (
            <FeedbackCard key={feedback._id} feedback={feedback} />
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setSearchParams(activeTab ? { tab: activeTab, sort, page: page - 1 } : { sort, page: page - 1 })}
            className="rounded-2xl bg-slate-200 px-4 py-2 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">
            Page {feedbackData.pagination.page || 1} of {feedbackData.pagination.pages || 1}
          </span>
          <button
            type="button"
            disabled={page >= (feedbackData.pagination.pages || 1)}
            onClick={() => setSearchParams(activeTab ? { tab: activeTab, sort, page: page + 1 } : { sort, page: page + 1 })}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default CompanyPage;
