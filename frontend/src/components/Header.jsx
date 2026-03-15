import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession, getCurrentUser } from "../services/auth";

const Header = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="text-lg font-black text-brand-700">
          Placement Feedback
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          {user.role === "student" && (
            <>
              <Link to="/dashboard">Home</Link>
              <Link to="/submit-feedback">Submit Feedback</Link>
              <Link to="/my-feedback">My Feedback</Link>
              <Link to="/dashboard">Companies</Link>
            </>
          )}
          {user.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
          <button type="button" onClick={handleLogout} className="rounded-full bg-slate-900 px-4 py-2 text-white">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
