import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserManagementPage.css';

const SearchIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="11" cy="11" r="5.5" stroke="#94a3b8" strokeWidth="1.5" />
    <path d="M20 20l-4.5-4.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BackIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M15 18l-6-6 6-6" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface User {
  name: string;
  apartment: string;
  status: 'activo' | 'pendiente';
  color: string;
}

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const users: User[] = [
    { name: 'Fabio Ríos', apartment: '3° B', status: 'activo', color: '#3b82f6' },
    { name: 'M. López', apartment: '2° A', status: 'activo', color: '#8b5cf6' },
    { name: 'J. García', apartment: 'sin asignar', status: 'pendiente', color: '#10b981' },
    { name: 'Ana Martínez', apartment: '5° A', status: 'activo', color: '#f59e0b' },
    { name: 'Carlos Ruiz', apartment: '1° C', status: 'pendiente', color: '#ef4444' },
  ];

  const getInitials = (name: string) => {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  function shadeColor(hex: string, percent: number) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));
    return `#${(b | (g << 8) | (r << 16)).toString(16).padStart(6, '0')}`;
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apartment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-management">
      <header className="user-management-header">
        <button className="back-button" onClick={() => navigate('/dashboard')} aria-label="Volver">
          <BackIcon />
        </button>
        <h1 className="new-user-title">USUARIOS</h1>
      </header>

      <div className="search-bar">
        <div className="search-inner">
          <div className="search-left">
            <div className="search-dot" />
            <SearchIcon className="search-icon" />
          </div>
          <input
            type="text"
            placeholder="Buscar usuario..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="user-list">
        {filteredUsers.map((user, index) => (
          <div key={index} className="user-card">
            <div
              className="user-avatar"
              style={{ background: `linear-gradient(135deg, ${user.color} 0%, ${shadeColor(user.color, -15)} 100%)` }}
            >
              {getInitials(user.name)}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-apartment">{user.apartment}</span>
            </div>
            <div className={`user-status ${user.status}`}>{user.status}</div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.4)' }}>
            No se encontraron usuarios
          </div>
        )}
      </div>

      <button className="floating-add-button" aria-label="Agregar usuario" onClick={() => navigate('/nuevo-usuario')}>
        <PlusIcon />
      </button>
    </div>
  );
};

export default UserManagementPage;