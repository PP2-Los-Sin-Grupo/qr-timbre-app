import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserManagementPage.css';

interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  chat_id_telegram: number | null;
  rol: string;
  created_at: string;
}

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const getInitials = (name: string) => {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const userColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#14b8a6'];

  const filteredUsers = users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-management">
      <header className="user-management-header">
        <button className="back-button" onClick={() => navigate('/dashboard')} aria-label="Volver">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="new-user-title">USUARIOS</h1>
      </header>

      <div className="search-bar">
        <div className="search-inner">
          <div className="search-left">
            <div className="search-dot" />
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="5.5" stroke="#94a3b8" strokeWidth="1.5" />
              <path d="M20 20l-4.5-4.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>
        ) : (
          filteredUsers.map((user, index) => {
            const status = user.chat_id_telegram ? 'activo' : 'pendiente';
            const color = userColors[index % userColors.length];
            return (
              <div
                key={user.id}
                className="user-card"
                onClick={() => navigate(`/usuarios/${user.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="user-avatar"
                  style={{
                    background: `linear-gradient(135deg, ${color} 0%, #00000033 100%)`,
                    backgroundColor: color,
                  }}
                >
                  {getInitials(user.nombre)}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.nombre}</span>
                  <span className="user-apartment">
                    {user.email}
                    {user.chat_id_telegram ? ' · Telegram conectado' : ' · Telegram pendiente'}
                  </span>
                </div>
                <div className={`user-status ${status}`}>
                  {status === 'activo' ? 'Activo' : 'Pendiente'}
                </div>
              </div>
            );
          })
        )}
        {!loading && filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
            No se encontraron usuarios
          </div>
        )}
      </div>

      <button className="floating-add-button" aria-label="Agregar usuario" onClick={() => navigate('/nuevo-usuario')}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default UserManagementPage;
