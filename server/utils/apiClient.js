// utils/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  timeout: 10000,
  headers: {
    "User-Agent": "BharatNetra/1.0",
  },
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.message);
    return Promise.reject(err);
  }
);

export default apiClient;
