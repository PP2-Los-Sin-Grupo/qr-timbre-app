import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NewUserPage.css';

interface Building {
  id: number;
  nombre: string;
}

interface Department {
  id: number;
  numero: string;
  piso: string;
  usuario_id: number | null;
}

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

const NewUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [edificioId, setEdificioId] = useState('');
  const [departamentoId, setDepartamentoId] = useState('');
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/edificios/public`)
      .then(async (r) => {
        if (!r.ok) throw new Error('Error del servidor');
        const data = await r.json();
        if (!Array.isArray(data)) throw new Error('Respuesta inválida');
        setBuildings(data);
        if (data.length > 0) setEdificioId(String(data[0].id));
      })
      .catch(() => setError('Error al cargar edificios'));
  }, []);

  useEffect(() => {
    if (!edificioId) {
      setDepartments([]);
      return;
    }
    fetch(`${API_URL}/api/departamentos/public/${edificioId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('Error del servidor');
        const data = await r.json();
        if (!Array.isArray(data)) throw new Error('Respuesta inválida');
        setDepartments(data.filter((d: Department) => !d.usuario_id));
        setDepartamentoId('');
      })
      .catch(() => setError('Error al cargar departamentos'));
  }, [edificioId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!edificioId) {
      setError('Seleccioná un edificio');
      return;
    }
    if (!departamentoId) {
      setError('Seleccioná un departamento');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          edificio_id: Number(edificioId),
          nombre: name,
          email,
          password,
          rol: 'propietario',
          departamento_id: Number(departamentoId),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al crear usuario');
      }
      navigate('/gestion-usuarios');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="new-user-root">
      <header className="new-user-header">
        <button className="back-button" onClick={() => navigate(-1)} aria-label="Volver">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="new-user-title">NUEVO USUARIO</h1>
      </header>

      <form className="new-user-form" onSubmit={handleSubmit}>
        {error && (
          <div style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', padding: '8px', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '10px' }}>
            {error}
          </div>
        )}

        <label className="field-label">Nombre completo</label>
        <div className="input-card">
          <input
            className="text-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Juan García"
            required
          />
        </div>

        <label className="field-label">Email</label>
        <div className="input-card">
          <input
            className="text-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="j.garcia@gmail.com"
            type="email"
            required
          />
        </div>

        <label className="field-label">Contraseña</label>
        <div className="input-card">
          <input
            className="text-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            required
            minLength={6}
          />
        </div>

        <label className="field-label">Edificio</label>
        <div className="input-card select-card">
          <select
            className="select-input"
            value={edificioId}
            onChange={(e) => setEdificioId(e.target.value)}
          >
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nombre}
              </option>
            ))}
          </select>
          <span className="chevron">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <label className="field-label">Departamento</label>
        <div className="input-card select-card">
          <select
            className="select-input"
            value={departamentoId}
            onChange={(e) => setDepartamentoId(e.target.value)}
          >
            <option value="">Seleccioná uno</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                Piso {d.piso} - Depto {d.numero}
              </option>
            ))}
          </select>
          <span className="chevron">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <button className="primary-btn" type="submit" disabled={submitting}>
          {submitting ? 'Creando...' : 'Crear usuario'}
        </button>
      </form>
    </div>
  );
};

export default NewUserPage;
