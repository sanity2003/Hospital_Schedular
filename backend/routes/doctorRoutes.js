const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// POST /api/add-doctor
router.post("/add-doctor", async (req, res) => {
  try {
    const { doctorId, specialization, maxDailyPatients, currentAppointments } =
      req.body;

    // Validate required fields
    if (!doctorId || !specialization || !maxDailyPatients) {
      return res.status(400).json({
        success: false,
        message: "doctorId, specialization, and maxDailyPatients are required.",
      });
    }

    if (isNaN(maxDailyPatients) || Number(maxDailyPatients) < 1) {
      return res.status(400).json({
        success: false,
        message: "maxDailyPatients must be a positive number.",
      });
    }

    const currentApt = currentAppointments ? Number(currentAppointments) : 0;

    if (currentApt > Number(maxDailyPatients)) {
      return res.status(400).json({
        success: false,
        message: "currentAppointments cannot exceed maxDailyPatients.",
      });
    }

    const doctor = new Doctor({
      doctorId: doctorId.trim(),
      specialization: specialization.trim().toLowerCase(),
      maxDailyPatients: Number(maxDailyPatients),
      currentAppointments: currentApt,
    });

    await doctor.save();

    return res.status(201).json({
      success: true,
      message: `Doctor ${doctorId} added successfully.`,
      data: doctor,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `Doctor ID '${req.body.doctorId}' already exists.`,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
      error: err.message,
    });
  }
});

// GET /api/doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctors.",
      error: err.message,
    });
  }
});

// POST /api/book-appointment
router.post("/book-appointment", async (req, res) => {
  try {
    const { specialization, patientName } = req.body;

    if (!specialization || !patientName) {
      return res.status(400).json({
        success: false,
        message: "Specialization and patient name are required.",
      });
    }

    // Find all doctors with matching specialization
    const doctors = await Doctor.find({
      specialization: specialization.trim().toLowerCase(),
    });

    if (doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No doctors found for specialization: '${specialization}'.`,
      });
    }

    // Filter available doctors (not fully booked)
    const availableDoctors = doctors.filter(
      (doc) => doc.currentAppointments < doc.maxDailyPatients
    );

    if (availableDoctors.length === 0) {
      return res.status(409).json({
        success: false,
        message: `All doctors in '${specialization}' are fully booked for today. Please try another time.`,
      });
    }

    // Fair allocation: pick doctor with fewest currentAppointments
    // If tie → pick first (sorted by currentAppointments asc, then createdAt asc)
    availableDoctors.sort((a, b) => {
      if (a.currentAppointments !== b.currentAppointments) {
        return a.currentAppointments - b.currentAppointments;
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    const selectedDoctor = availableDoctors[0];

    // Increment appointment count atomically
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      selectedDoctor._id,
      { $inc: { currentAppointments: 1 } },
      { new: true }
    );

    // Save appointment record
    const appointment = new Appointment({
      doctorId: selectedDoctor.doctorId,
      specialization: specialization.trim().toLowerCase(),
      patientName: patientName.trim(),
    });
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: `Appointment booked successfully!`,
      data: {
        appointmentId: appointment.appointmentId,
        patientName: appointment.patientName,
        doctorId: updatedDoctor.doctorId,
        specialization: updatedDoctor.specialization,
        doctorAppointments: `${updatedDoctor.currentAppointments}/${updatedDoctor.maxDailyPatients}`,
        bookedAt: appointment.bookedAt,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while booking appointment.",
      error: err.message,
    });
  }
});

// DELETE /api/reset-appointments (helper for demo/testing)
router.delete("/reset-appointments", async (req, res) => {
  try {
    await Doctor.updateMany({}, { $set: { currentAppointments: 0 } });
    await Appointment.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "All appointments reset successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to reset appointments.",
    });
  }
});

module.exports = router;
