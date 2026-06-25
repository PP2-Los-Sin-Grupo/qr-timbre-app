import "./styles.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUsuarios } from "../contexto/UsuariosContexto";

export default function CrearUsuarioPage() {
  const navigate = useNavigate();

  const { agregarUsuario } = useUsuarios();

  const [nombreCompleto, setNombreCompleto] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [piso, setPiso] =
    useState("");

  const [departamento, setDepartamento] =
    useState("");

  const crearUsuario = () => {
    if (
      !nombreCompleto ||
      !email ||
      !piso ||
      !departamento
    ) {
      return;
    }

    agregarUsuario({
      id: Date.now(),
      nombreCompleto,
      email,
      piso,
      departamento,
    });

    navigate("/gestion-usuarios");
  };

  return (
    <div className="contenedor-crear">

      <h1>Nuevo Usuario</h1>

      <input
        placeholder="Nombre completo"
        value={nombreCompleto}
        onChange={(e) =>
          setNombreCompleto(e.target.value)
        }
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        placeholder="Piso"
        value={piso}
        onChange={(e) =>
          setPiso(e.target.value)
        }
      />

      <input
        placeholder="Departamento"
        value={departamento}
        onChange={(e) =>
          setDepartamento(e.target.value)
        }
      />

      <button onClick={crearUsuario}>
        Crear y enviar credenciales
      </button>

    </div>
  );
}
