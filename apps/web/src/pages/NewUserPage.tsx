import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewUserPage.css';

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M15 18l-6-6 6-6" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Chevron = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M9 6l6 6-6 6" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NewUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [floor, setFloor] = useState('4');
  const [department, setDepartment] = useState('A');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // placeholder: real implementation should call API
    console.log('create user', { name, email, floor, department });
    alert('Usuario creado (modo demo)');
    navigate(-1);
  }

  return (
    <div className="new-user-root">
      <header className="new-user-header">
        <button className="back-button" onClick={() => navigate(-1)} aria-label="Volver">
          <BackIcon />
        </button>
        <h1 className="new-user-title">NUEVO USUARIO</h1>
      </header>

      <form className="new-user-form" onSubmit={handleSubmit}>
        <label className="field-label">Nombre completo</label>
        <div className="input-card">
          <input
            className="text-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Juan García"
            aria-label="Nombre completo"
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
            aria-label="Email"
          />
        </div>

        <label className="field-label">Asignar a piso</label>
        <div className="input-card select-card">
          <select className="select-input" value={floor} onChange={(e) => setFloor(e.target.value)} aria-label="Asignar a piso">
            <option value="1">1° Piso</option>
            <option value="2">2° Piso</option>
            <option value="3">3° Piso</option>
            <option value="4">4° Piso</option>
            <option value="5">5° Piso</option>
          </select>
          <span className="chevron"><Chevron /></span>
        </div>

        <label className="field-label">Departamento</label>
        <div className="input-card select-card">
          <select className="select-input" value={department} onChange={(e) => setDepartment(e.target.value)} aria-label="Departamento">
            <option value="A">Depto. A</option>
            <option value="B">Depto. B</option>
            <option value="C">Depto. C</option>
          </select>
          <span className="chevron"><Chevron /></span>
        </div>

        <button className="primary-btn" type="submit">Crear y enviar credenciales</button>
      </form>
    </div>
  );
};

export default NewUserPage;
