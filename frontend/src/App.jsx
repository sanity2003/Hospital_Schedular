import React, { useState, useEffect, useCallback } from "react";
import AddDoctorForm from "./components/AddDoctorForm";
import DoctorList from "./components/DoctorList";
import BookAppointment from "./components/BookAppointment";
import Toast from "./components/Toast";
import { getDoctors } from "./api/api";

const TABS = [
  { id: "add", label: "Add Doctor", icon: "➕" },
  { id: "list", label: "Doctors", icon: "👨‍⚕️" },
  { id: "book", label: "Book Appointment", icon: "🗓️" },
];

const App = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const fetchDoctors = useCallback(async () => {
    setLoadingDoctors(true);
    try {
      const res = await getDoctors();
      setDoctors(res.data.data);
    } catch (err) {
      showToast("Failed to fetch doctors: " + err.message, "error");
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <div>
              <h1>Hospital Appointment Scheduler</h1>
              <p>Smart, fair appointment allocation system</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-number">{doctors.length}</span>
              <span className="stat-label">Doctors</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {doctors.filter((d) => d.currentAppointments < d.maxDailyPatients).length}
              </span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {doctors.reduce((acc, d) => acc + d.currentAppointments, 0)}
              </span>
              <span className="stat-label">Today's Apts</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.id === "list" && doctors.length > 0 && (
              <span className="tab-badge">{doctors.length}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === "add" && (
          <AddDoctorForm
            onDoctorAdded={() => {
              fetchDoctors();
              setTimeout(() => setActiveTab("list"), 1000);
            }}
            showToast={showToast}
          />
        )}
        {activeTab === "list" && (
          <DoctorList
            doctors={doctors}
            loading={loadingDoctors}
            onRefresh={fetchDoctors}
          />
        )}
        {activeTab === "book" && (
          <BookAppointment
            onBooked={fetchDoctors}
            showToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Hospital Appointment Scheduler • Built with React + Node.js + MongoDB</p>
      </footer>

      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default App;
