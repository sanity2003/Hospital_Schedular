import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const addDoctor = (doctorData) => API.post("/add-doctor", doctorData);
export const getDoctors = () => API.get("/doctors");
export const bookAppointment = (data) => API.post("/book-appointment", data);
export const resetAppointments = () => API.delete("/reset-appointments");

export default API;
