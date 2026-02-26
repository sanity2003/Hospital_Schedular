import React, { useState } from "react";
import { bookAppointment } from "../api/api";

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

const BookAppointment = ({ onBooked, showToast }) => {
  const [form, setForm] = useState({ specialization: "", patientName: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState(null);
  const [history, setHistory] = useState([]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await bookAppointment(form);
      const data = res.data.data;
      setResult(data);
      setResultType("success");
      setHistory((prev) => [{ ...data, type: "success", ts: new Date() }, ...prev].slice(0, 5));
      showToast(res.data.message, "success");
      setForm({ specialization: "", patientName: "" });
      onBooked();
    } catch (err) {
      const errObj = { message: err.message, type: "error", ts: new Date() };
      setResult({ message: err.message });
      setResultType("error");
      setHistory((prev) => [errObj, ...prev].slice(0, 5));
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-layout">

      {/* LEFT — Booking Form */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="card-icon">📋</span>
            <h2>Book Appointment</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Patient Name *</label>
            <input
              type="text"
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              placeholder="Enter patient full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Specialization Required *</label>
            <select
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              required
            >
              <option value="">Select required specialization</option>
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" /> Booking...
              </span>
            ) : (
              "🗓️ Book Appointment"
            )}
          </button>
        </form>
      </div>

      {/* RIGHT — Output Display Panel */}
      <div className="card output-panel">
        <div className="card-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="card-icon">🖥️</span>
            <h2>Output Panel</h2>
          </div>
          {history.length > 0 && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => { setHistory([]); setResult(null); setResultType(null); }}
            >
              🗑️ Clear
            </button>
          )}
        </div>

        {/* Latest Result */}
        {result ? (
          <div className={`result-panel ${resultType}`} style={{ marginBottom: "20px" }}>
            <div className="result-header">
              <span>{resultType === "success" ? "✅" : "❌"}</span>
              <h3>{resultType === "success" ? "Appointment Confirmed!" : "Booking Failed"}</h3>
            </div>
            {resultType === "success" ? (
              <div className="result-details">
                <div className="result-row">
                  <span className="result-label">Appointment ID</span>
                  <span className="result-value appt-id">{result.appointmentId}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Patient</span>
                  <span className="result-value">{result.patientName}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Assigned Doctor</span>
                  <span className="result-value">{result.doctorId}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Specialization</span>
                  <span className="result-value spec-tag">{result.specialization}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Doctor Load</span>
                  <span className="result-value">{result.doctorAppointments}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Booked At</span>
                  <span className="result-value">{new Date(result.bookedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ) : (
              <p className="result-error-msg">{result.message}</p>
            )}
          </div>
        ) : (
          <div className="output-idle">
            <div className="output-idle-icon">🖥️</div>
            <p className="output-idle-title">Awaiting Booking</p>
            <p className="output-idle-sub">
              Fill in the form and click <strong>Book Appointment</strong>.<br />
              The result will appear here instantly.
            </p>
            <div className="output-idle-steps">
              <div className="idle-step"><span>1</span> Enter patient name</div>
              <div className="idle-step"><span>2</span> Select specialization</div>
              <div className="idle-step"><span>3</span> View result here</div>
            </div>
          </div>
        )}

        {/* Recent History */}
        {history.length > 1 && (
          <div className="history-section">
            <p className="history-title">Recent Bookings</p>
            {history.slice(1).map((h, i) => (
              <div key={i} className={`history-item ${h.type}`}>
                <span className="history-icon">{h.type === "success" ? "✅" : "❌"}</span>
                <div className="history-body">
                  {h.type === "success" ? (
                    <>
                      <span className="history-name">{h.patientName}</span>
                      <span className="history-meta"> → {h.doctorId} ({h.specialization})</span>
                    </>
                  ) : (
                    <span className="history-name error-text">{h.message}</span>
                  )}
                </div>
                <span className="history-time">{h.ts?.toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default BookAppointment;


