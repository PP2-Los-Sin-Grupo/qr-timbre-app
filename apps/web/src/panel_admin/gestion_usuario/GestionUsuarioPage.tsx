import "./styles.css";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUsuarios } from "../contexto/UsuariosContexto";

export default function GestionUsuarioPage() {
  const navigate = useNavigate();

  const { usuarios } = useUsuarios();

  const [textoBusqueda, setTextoBusqueda] = useState("");

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((usuario) =>
      usuario.nombreCompleto
        .toLowerCase()
        .includes(textoBusqueda.toLowerCase())
    );
  }, [textoBusqueda, usuarios]);

  return (
    <div className="contenedor-usuarios">

      <div className="encabezado">

        <h1>Usuarios</h1>

        <button
          className="boton-agregar"
          onClick={() => navigate("/crear-usuario")}
        >
          +
        </button>

      </div>

      <input
        type="text"
        placeholder="Buscar usuario..."
        value={textoBusqueda}
        onChange={(e) => setTextoBusqueda(e.target.value)}
      />

      <div className="lista-usuarios">

        {usuariosFiltrados.length === 0 ? (
          <p>No hay usuarios registrados</p>
        ) : (
          usuariosFiltrados.map((usuario) => (
            <div
              key={usuario.id}
              className="usuario"
            >
              <div>
                <h3>{usuario.nombreCompleto}</h3>

                <span>
                  Piso {usuario.piso} - {usuario.departamento}
                </span>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
