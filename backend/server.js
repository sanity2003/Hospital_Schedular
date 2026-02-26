require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const doctorRoutes = require("./routes/doctorRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
// CORS configuration: in production set FRONTEND_URL to your deployed client URL.
// using a wildcard "*" is only safe for local development or APIs meant to be publicly
// accessible from any origin.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // enable if you send cookies or auth headers
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "✅ Hospital Scheduler API is running",
    version: "1.0.0",
    endpoints: {
      addDoctor: "POST /api/add-doctor",
      getDoctors: "GET /api/doctors",
      bookAppointment: "POST /api/book-appointment",
      resetAppointments: "DELETE /api/reset-appointments",
    },
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api", doctorRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Database + Server Start ──────────────────────────────────────────────────
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Atlas connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
