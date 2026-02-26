const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: [true, "Doctor ID is required"],
      unique: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
      lowercase: true,
    },
    maxDailyPatients: {
      type: Number,
      required: [true, "Max daily patients is required"],
      min: [1, "Max daily patients must be at least 1"],
    },
    currentAppointments: {
      type: Number,
      default: 0,
      min: [0, "Current appointments cannot be negative"],
    },
  },
  { timestamps: true }
);

// Virtual: check if doctor is available
doctorSchema.virtual("isAvailable").get(function () {
  return this.currentAppointments < this.maxDailyPatients;
});

doctorSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Doctor", doctorSchema);
