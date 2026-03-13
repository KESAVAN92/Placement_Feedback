import axios from "axios";

const apiBaseUrl = process.env.REACT_APP_API_URL || "https://placement-feedback-y9vv.onrender.com/api";

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
