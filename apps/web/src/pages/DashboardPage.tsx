import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './DashboardPage.css';

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

const LightningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fbbf24"/>
  </svg>
);

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { token, logout, user } = useAuth();
  const [edificios, setEdificios] = useState(0);
  const [usuarios, setUsuarios] = useState(0);
  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/edificios`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setEdificios(data.length))
      .catch(console.error);

    fetch(`${API_URL}/api/usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setUsuarios(data.length))
      .catch(console.error);
  }, [token]);

  const sections = [
    { id: "departamentos", label: "Departamentos", color: "#6366f1", icon: "🏠" },
    { id: "usuarios", label: "Usuarios", color: "#a78bfa", icon: "👥" },
    { id: "asignaciones", label: "Asignaciones", color: "#22c55e", icon: "🔑" },
    { id: "registros", label: "Registros", color: "#f59e0b", icon: "📋" },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">ADMIN</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="dashboard-admin-badge">
            <LightningIcon />
            <span className="dashboard-admin-label">{user?.nombre || 'Admin'}</span>
          </div>
          <button
            onClick={logout}
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#ef4444',
              padding: '10px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            Salir
          </button>
        </div>
      </div>

      <div className="dashboard-divider" />

      <div className="dashboard-content">
        <div className="dashboard-stats-row">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-number">{edificios}</div>
            <div className="dashboard-stat-label">Edificios</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-number">{usuarios}</div>
            <div className="dashboard-stat-label">Usuarios</div>
          </div>
        </div>

        <div className="dashboard-sections-grid">
          {sections.map((section) => (
            <button
              key={section.id}
              className="dashboard-section-card"
              style={{ borderColor: section.color }}
              onClick={() => {
                if (section.id === 'departamentos') {
                  navigate('/departamentos');
                }
                if (section.id === 'usuarios') {
                  navigate('/gestion-usuarios');
                }
              }}
            >
              <div className="dashboard-section-icon">{section.icon}</div>
              <span className="dashboard-section-label" style={{ color: section.color }}>
                {section.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
