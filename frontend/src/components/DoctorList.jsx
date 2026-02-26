import React from "react";

const DoctorList = ({ doctors, loading, onRefresh }) => {
  const getAvailabilityColor = (current, max) => {
    const ratio = current / max;
    if (ratio >= 1) return "#ef4444";
    if (ratio >= 0.75) return "#f59e0b";
    return "#10b981";
  };

  const getAvailabilityLabel = (current, max) => {
    if (current >= max) return "Full";
    if (current / max >= 0.75) return "Busy";
    return "Available";
  };

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="card-icon">👨‍⚕️</span>
          <h2>All Doctors</h2>
          <span className="badge">{doctors.length}</span>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "..." : "🔄 Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner large" />
          <p>Fetching doctors...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="empty-state">
          <span>🏥</span>
          <p>No doctors added yet. Add a doctor to get started!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="doctor-table">
            <thead>
              <tr>
                <th>Doctor ID</th>
                <th>Specialization</th>
                <th>Capacity</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => {
                const color = getAvailabilityColor(
                  doc.currentAppointments,
                  doc.maxDailyPatients
                );
                const label = getAvailabilityLabel(
                  doc.currentAppointments,
                  doc.maxDailyPatients
                );
                const pct = Math.min(
                  (doc.currentAppointments / doc.maxDailyPatients) * 100,
                  100
                );
                return (
                  <tr key={doc._id}>
                    <td>
                      <span className="doctor-id">{doc.doctorId}</span>
                    </td>
                    <td>
                      <span className="spec-tag">
                        {doc.specialization.charAt(0).toUpperCase() +
                          doc.specialization.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="capacity-text">
                        {doc.currentAppointments} / {doc.maxDailyPatients}
                      </span>
                    </td>
                    <td>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ background: `${color}20`, color }}
                      >
                        {label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorList;


