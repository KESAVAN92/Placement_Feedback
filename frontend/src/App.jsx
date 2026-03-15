import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitFeedbackPage from "./pages/SubmitFeedbackPage";
import CompanyPage from "./pages/CompanyPage";
import QuestionsPage from "./pages/QuestionsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import MyFeedbackPage from "./pages/MyFeedbackPage";

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute role="student">
          <DashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/submit-feedback"
      element={
        <ProtectedRoute role="student">
          <SubmitFeedbackPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/edit-feedback/:id"
      element={
        <ProtectedRoute role="student">
          <SubmitFeedbackPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/my-feedback"
      element={
        <ProtectedRoute role="student">
          <MyFeedbackPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/company/:name"
      element={
        <ProtectedRoute role="student">
          <CompanyPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/questions/:name"
      element={
        <ProtectedRoute role="student">
          <QuestionsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin"
      element={
        <ProtectedRoute role="admin">
          <AdminDashboardPage />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default App;
