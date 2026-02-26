import React, { useState } from "react";
import { addDoctor } from "../api/api";

const SPECIALIZATIONS = [
  "cardiology",
  "neurology",
  "orthopedics",
  "dermatology",
  "pediatrics",
  "ophthalmology",
  "general medicine",
  "gynecology",
  "psychiatry",
  "oncology",
];

const AddDoctorForm = ({ onDoctorAdded, showToast }) => {
  const [form, setForm] = useState({
    doctorId: "",
    specialization: "",
    maxDailyPatients: "",
    currentAppointments: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await addDoctor(form);
      showToast(res.data.message, "success");
      setForm({ doctorId: "", specialization: "", maxDailyPatients: "", currentAppointments: "" });
      onDoctorAdded();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">🏥</span>
        <h2>Add New Doctor</h2>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Doctor ID *</label>
          <input
            type="text"
            name="doctorId"
            value={form.doctorId}
            onChange={handleChange}
            placeholder="e.g. DOC-001"
            required
          />
        </div>

        <div className="form-group">
          <label>Specialization *</label>
          <select
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            required
          >
            <option value="">Select specialization</option>
            {SPECIALIZATIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Max Daily Patients *</label>
            <input
              type="number"
              name="maxDailyPatients"
              value={form.maxDailyPatients}
              onChange={handleChange}
              placeholder="e.g. 10"
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Current Appointments</label>
            <input
              type="number"
              name="currentAppointments"
              value={form.currentAppointments}
              onChange={handleChange}
              placeholder="Default: 0"
              min="0"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span className="btn-loading">
              <span className="spinner" /> Adding Doctor...
            </span>
          ) : (
            "➕ Add Doctor"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddDoctorForm;



