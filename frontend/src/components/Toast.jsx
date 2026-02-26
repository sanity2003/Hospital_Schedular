import React, { useEffect } from "react";

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const styles = {
    success: { bg: "#d1fae5", border: "#10b981", icon: "✅", color: "#065f46" },
    error: { bg: "#fee2e2", border: "#ef4444", icon: "❌", color: "#991b1b" },
    info: { bg: "#dbeafe", border: "#3b82f6", icon: "ℹ️", color: "#1e40af" },
  };

  const s = styles[toast.type] || styles.info;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderLeft: `4px solid ${s.border}`,
        borderRadius: "8px",
        padding: "14px 20px",
        maxWidth: "380px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        animation: "slideIn 0.3s ease",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      <span style={{ fontSize: "18px" }}>{s.icon}</span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, color: s.color, fontWeight: 500, fontSize: "14px" }}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: s.color,
          fontSize: "16px",
          padding: 0,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;

