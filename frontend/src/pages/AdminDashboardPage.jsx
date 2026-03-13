import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import FeedbackCard from "../components/FeedbackCard";
import api from "../services/api";

const AdminDashboardPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companyForm, setCompanyForm] = useState({ name: "", category: "Software" });
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const { data } = await api.get("/admin/feedbacks");
      setFeedbacks(data.feedbacks);
      setCompanies(data.companies);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load admin data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteFeedback = async (id) => {
    try {
      await api.delete(`/admin/feedback/${id}`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete feedback.");
    }
  };

  const handleCreateCompany = async (event) => {
    event.preventDefault();
    try {
      await api.post("/companies", companyForm);
      setCompanyForm({ name: "", category: "Software" });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add company.");
    }
  };

  const handleDeleteCompany = async (id) => {
    try {
      await api.delete(`/companies/${id}`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete company.");
    }
  };

  return (
    <Layout>
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Manage companies and moderate feedback.</p>

          <form onSubmit={handleCreateCompany} className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Company name"
              className="w-full rounded-2xl border-slate-200"
              value={companyForm.name}
              onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
              required
            />
            <select
              className="w-full rounded-2xl border-slate-200"
              value={companyForm.category}
              onChange={(e) => setCompanyForm({ ...companyForm, category: e.target.value })}
            >
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
            </select>
            <button type="submit" className="w-full rounded-2xl bg-brand-700 px-4 py-3 font-semibold text-white">
              Add Company
            </button>
          </form>

          <div className="mt-8 space-y-3">
            {companies.map((company) => (
              <div key={company._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{company.name}</p>
                  <p className="text-xs text-slate-500">{company.category}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCompany(company._id)}
                  className="rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900">All Feedbacks</h2>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-6 space-y-5">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="space-y-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeleteFeedback(feedback._id)}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
                <FeedbackCard feedback={feedback} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboardPage;
