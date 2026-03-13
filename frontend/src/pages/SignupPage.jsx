import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { setAuthSession } from "../services/auth";

const initialForm = {
  name: "",
  email: "",
  password: "",
  department: "",
  year: "",
  collegeName: "",
  city: ""
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await api.post("/auth/signup", formData);
      setAuthSession(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
      <div className="w-full rounded-[2rem] bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Student Registration</h1>
        <p className="mt-2 text-sm text-slate-500">Create your account to submit and view placement experiences.</p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          {Object.keys(initialForm).map((key) => (
            <input
              key={key}
              type={key === "password" ? "password" : key === "email" ? "email" : "text"}
              placeholder={key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())}
              className="rounded-2xl border-slate-200"
              value={formData[key]}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              required
            />
          ))}
          {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
          <button type="submit" className="rounded-2xl bg-brand-700 px-4 py-3 font-semibold text-white md:col-span-2">
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-brand-700">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
