import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { setAuthSession } from "../services/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("student");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const endpoint = mode === "admin" ? "/auth/admin/login" : "/auth/login";
      const { data } = await api.post(endpoint, formData);
      setAuthSession(data);
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reach the server. Check that the backend is running.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl md:grid-cols-[1.1fr_0.9fr]">
        <section className="bg-slate-900 p-10 text-white">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Placement Prep</p>
          <h1 className="mt-6 text-4xl font-black leading-tight">Learn from real placement drives before your turn arrives.</h1>
          <p className="mt-4 max-w-md text-sm text-slate-300">
            Browse company-wise aptitude, coding, and interview experiences shared by seniors.
          </p>
        </section>
        <section className="p-8 md:p-10">
          <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode("student")}
              className={`rounded-full px-4 py-2 ${mode === "student" ? "bg-slate-900 text-white" : ""}`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setMode("admin")}
              className={`rounded-full px-4 py-2 ${mode === "admin" ? "bg-slate-900 text-white" : ""}`}
            >
              Admin
            </button>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-900">Sign in</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-2xl border-slate-200"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-2xl border-slate-200"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="w-full rounded-2xl bg-brand-700 px-4 py-3 font-semibold text-white">
              Login
            </button>
          </form>
          {mode === "student" && (
            <p className="mt-4 text-sm text-slate-500">
              New student? <Link to="/signup" className="font-semibold text-brand-700">Create an account</Link>
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
