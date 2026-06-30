import "./styles.css";
import "../panel.css";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuarios } from "../contexto/UsuariosContexto";
import type { Usuario } from "../contexto/UsuariosContexto";
import { Box, CircularProgress } from "@mui/material";

export default function GestionUsuarioPage() {
  const navigate = useNavigate();
  const { usuarios, cargando, eliminarUsuario, editarUsuario } = useUsuarios();

  const [ textoBusqueda, setTextoBusqueda ] = useState( "" );
  const [ editandoId, setEditandoId ] = useState<string | null>( null );
  const [ formEditar, setFormEditar ] = useState<Omit<Usuario, 'id'>>({
    nombreCompleto: '', email: '', piso: '', departamento: '',
  });

  const usuariosFiltrados = useMemo( () =>
    usuarios.filter( u =>
      u.nombreCompleto.toLowerCase().includes( textoBusqueda.toLowerCase() )
    ), [ textoBusqueda, usuarios ]
  );

  const iniciarEdicion = ( u: Usuario ) => {
    setEditandoId( u.id );
    setFormEditar({ nombreCompleto: u.nombreCompleto, email: u.email, piso: u.piso, departamento: u.departamento });
  };

  const guardarEdicion = () => {
    if ( !editandoId ) return;
    editarUsuario( editandoId, formEditar );
    setEditandoId( null );
  };

  return (
    <div className="contenedor-usuarios">

      <div className="encabezado">
        <h1>Usuarios</h1>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <button className="boton-agregar" onClick={ () => navigate( "/crear-usuario" ) }>+</button>
          <button className="panel-btn panel-btn-secundario" onClick={ () => navigate( "/dashboard" ) }>← Volver</button>
        </div>
      </div>

      <input
        className="panel-input"
        type="text"
        placeholder="Buscar usuario..."
        value={textoBusqueda}
        onChange={ e => setTextoBusqueda( e.target.value ) }
      />

      <Box className="lista-usuarios"
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          borderRadius: "12px",
        }}>
        {cargando ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: "24px" }}>
            <CircularProgress color="inherit" />
          </Box>
        ) : usuariosFiltrados.length === 0 ? (
          <p>No hay usuarios registrados</p>
        ) : (
          usuariosFiltrados.map( usuario => (
            <div key={usuario.id} className="usuario">

              { editandoId === usuario.id ? (
                /* ── Modo edición ── */
                <div>
                  <input className="panel-input" placeholder="Nombre completo" value={formEditar.nombreCompleto}
                    onChange={ e => setFormEditar( p => ({ ...p, nombreCompleto: e.target.value }) ) } />
                  <input className="panel-input" placeholder="Email" value={formEditar.email}
                    onChange={ e => setFormEditar( p => ({ ...p, email: e.target.value }) ) } />
                  <input className="panel-input" placeholder="Piso" value={formEditar.piso}
                    onChange={ e => setFormEditar( p => ({ ...p, piso: e.target.value }) ) } />
                  <input className="panel-input" placeholder="Departamento" value={formEditar.departamento}
                    onChange={ e => setFormEditar( p => ({ ...p, departamento: e.target.value }) ) } />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button onClick={guardarEdicion} className="panel-btn panel-btn-primario">
                      Guardar
                    </button>
                    <button onClick={ () => setEditandoId( null ) } className="panel-btn panel-btn-secundario">
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Modo vista ── */
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px' }}>{usuario.nombreCompleto}</h3>
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                      Piso {usuario.piso} - Depto {usuario.departamento}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={ () => iniciarEdicion( usuario ) } className="panel-btn panel-btn-primario">
                      Editar
                    </button>
                    <button onClick={ () => eliminarUsuario( usuario.id ) } className="panel-btn panel-btn-peligro">
                      Eliminar
                    </button>
                  </div>
                </div>
              ) }

            </div>
          ))
        )}
      </Box>
    </div>
  );
}
