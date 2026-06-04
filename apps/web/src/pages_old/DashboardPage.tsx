import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './DashboardPage.css';

interface DashboardPageProps {
  onNavigate?: (section: string) => void;
}

const LightningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fbbf24"/>
  </svg>
);

export const DashboardPage = ({ onNavigate }: DashboardPageProps) => {
  const navigate = useNavigate();
  const [stats] = useState({
    edificios: 12,
    usuarios: 9,
  });

  const sections = [
    {
      id: "departamentos",
      label: "Departamentos",
      color: "#6366f1",
      icon: "🏠",
    },
    {
      id: "usuarios",
      label: "Usuarios",
      color: "#a78bfa",
      icon: "👥",
    },
    {
      id: "asignaciones",
      label: "Asignaciones",
      color: "#22c55e",
      icon: "🔑",
    },
    {
      id: "registros",
      label: "Registros",
      color: "#f59e0b",
      icon: "📋",
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">ADMIN</h1>
        </div>
        <div className="dashboard-admin-badge">
          <LightningIcon />
          <span className="dashboard-admin-label">Admin</span>
        </div>
      </div>

      <div className="dashboard-divider" />

      <div className="dashboard-content">
        <div className="dashboard-stats-row">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-number">{stats.edificios}</div>
            <div className="dashboard-stat-label">Edificios</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-number">{stats.usuarios}</div>
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
                if (section.id === 'usuarios') {
                  navigate('/gestion-usuarios');
                } else {
                  onNavigate?.(section.id);
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