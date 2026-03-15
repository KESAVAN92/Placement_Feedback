import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import CompanyCard from "../components/CompanyCard";
import api from "../services/api";

const DashboardPage = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [submissionCount, setSubmissionCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const { data } = await api.get(`/companies?search=${encodeURIComponent(search)}`);
        setCompanies(data);
        setError("");
      } catch (err) {
        setCompanies([]);
        setError(err.response?.data?.message || "Unable to load companies.");
      }
    };

    loadCompanies();
  }, [search]);

  useEffect(() => {
    const loadSubmissionCount = async () => {
      try {
        const { data } = await api.get("/feedback/mine");
        setSubmissionCount(data.total || 0);
      } catch {
        setSubmissionCount(0);
      }
    };

    loadSubmissionCount();
  }, []);

  const grouped = useMemo(
    () => ({
      Hardware: companies.filter((item) => item.category === "Hardware"),
      Software: companies.filter((item) => item.category === "Software")
    }),
    [companies]
  );

  return (
    <Layout>
      <section className="rounded-[2rem] bg-slate-900 p-8 text-white">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Student Dashboard</p>
        <h1 className="mt-4 text-4xl font-black">Prepare with company-specific feedback from seniors.</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_260px] md:items-start">
          <div>
            <input
              type="text"
              placeholder="Search companies"
              className="w-full max-w-md rounded-2xl border-none bg-white/10 text-white placeholder:text-slate-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
          </div>
          <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">My Feedback</p>
            <p className="mt-3 text-4xl font-black">{submissionCount}</p>
            <p className="mt-2 text-sm text-slate-200">Total feedback submissions from your account.</p>
            <Link
              to="/my-feedback"
              className="mt-4 inline-flex rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900"
            >
              View My Feedback
            </Link>
          </div>
        </div>
      </section>

      {["Hardware", "Software"].map((category) => (
        <section key={category} className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">{category} Companies</h2>
            <p className="text-sm text-slate-500">{grouped[category].length} companies</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {grouped[category].map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        </section>
      ))}
    </Layout>
  );
};

export default DashboardPage;
