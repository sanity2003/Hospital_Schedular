const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      unique: true,
      default: () => `APT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
    doctorId: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
      lowercase: true,
    },
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
