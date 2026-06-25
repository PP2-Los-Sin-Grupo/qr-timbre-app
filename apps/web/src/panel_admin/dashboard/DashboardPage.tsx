//import React from 'react';
import './styles.css';
import { useNavigate } from "react-router-dom";
import { useUsuarios } from "../contexto/UsuariosContexto";

export default function DashboardPage() {
  const navigate = useNavigate();

  const { usuarios } = useUsuarios();

  return (
    <div className="contenedor-dashboard">

      <div className="cabecera">
        <h1>ADMIN</h1>
      </div>

      <div className="estadisticas">

        <div className="tarjeta-estadistica">
          <h2>12</h2>
          <span>Departamentos</span>
        </div>

        <div className="tarjeta-estadistica">
          <h2>{usuarios.length}</h2>
          <span>Usuarios</span>
        </div>

      </div>

      <div className="menu">

        <button className="tarjeta-menu">
          Departamentos
        </button>

        <button
          className="tarjeta-menu"
          onClick={() => navigate("/gestion-usuarios")}
        >
          Usuarios
        </button>

        <button className="tarjeta-menu">
          Asignaciones
        </button>

        <button className="tarjeta-menu">
          Registros
        </button>

      </div>
    </div>
  );
}
