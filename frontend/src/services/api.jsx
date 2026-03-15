import axios from "axios";

const resolveApiBaseUrl = () => {
  const configuredUrl = process.env.REACT_APP_API_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:5000/api";
  }

  return "https://placement-feedback-y9vv.onrender.com/api";
};

const apiBaseUrl = resolveApiBaseUrl();

const api = axios.create({
  baseURL: apiBaseUrl
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
