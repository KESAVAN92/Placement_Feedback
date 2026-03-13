import React from "react";
import { Link } from "react-router-dom";

const CompanyCard = ({ company }) => (
  <Link
    to={`/company/${encodeURIComponent(company.name)}`}
    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
  >
    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">{company.category}</p>
    <h3 className="mt-3 text-xl font-bold text-slate-900">{company.name}</h3>
    <p className="mt-2 text-sm text-slate-500">Feedback, round details, and downloadable question bank.</p>
  </Link>
);

export default CompanyCard;
