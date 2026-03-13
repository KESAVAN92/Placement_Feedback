import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

const AdminDashboardPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companyForm, setCompanyForm] = useState({ name: "", category: "Software" });

  const loadData = async () => {
    const { data } = await api.get("/admin/feedbacks");
    setFeedbacks(data.feedbacks);
    setCompanies(data.companies);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteFeedback = async (id) => {
    await api.delete(`/admin/feedback/${id}`);
    loadData();
  };

  const handleCreateCompany = async (event) => {
    event.preventDefault();
    await api.post("/companies", companyForm);
    setCompanyForm({ name: "", category: "Software" });
    loadData();
  };

  const handleDeleteCompany = async (id) => {
    await api.delete(`/companies/${id}`);
    loadData();
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
          <div className="mt-6 space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{feedback.companyName}</p>
                    <p className="text-sm text-slate-500">
                      {feedback.studentId?.name} • {feedback.studentId?.email}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {feedback.location} • {new Date(feedback.attendedDate).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteFeedback(feedback._id)}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
                <p className="mt-4 text-sm text-slate-600">{feedback.tips || feedback.struggles || "No extra notes."}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboardPage;
