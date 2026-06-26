import "./styles.css";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuarios } from "../contexto/UsuariosContexto";
import type { Usuario } from "../contexto/UsuariosContexto";

const botonVolver: React.CSSProperties = {
  background: '#1e293b',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  padding: '10px 20px',
  cursor: 'pointer',
  fontSize: '14px',
};

const inputEditar: React.CSSProperties = {
  background: '#0f172a',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: 'white',
  padding: '6px 10px',
  fontSize: '13px',
  width: '100%',
  marginBottom: '6px',
  boxSizing: 'border-box',
};

export default function GestionUsuarioPage() {
  const navigate = useNavigate();
  const { usuarios, eliminarUsuario, editarUsuario } = useUsuarios();

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
          <button style={ botonVolver } onClick={ () => navigate( "/dashboard" ) }>← Volver</button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar usuario..."
        value={textoBusqueda}
        onChange={ e => setTextoBusqueda( e.target.value ) }
      />

      <div className="lista-usuarios">
        { usuariosFiltrados.length === 0 ? (
          <p>No hay usuarios registrados</p>
        ) : (
          usuariosFiltrados.map( usuario => (
            <div key={usuario.id} className="usuario">

              { editandoId === usuario.id ? (
                /* ── Modo edición ── */
                <div>
                  <input style={inputEditar} placeholder="Nombre completo" value={formEditar.nombreCompleto}
                    onChange={ e => setFormEditar( p => ({ ...p, nombreCompleto: e.target.value }) ) } />
                  <input style={inputEditar} placeholder="Email" value={formEditar.email}
                    onChange={ e => setFormEditar( p => ({ ...p, email: e.target.value }) ) } />
                  <input style={inputEditar} placeholder="Piso" value={formEditar.piso}
                    onChange={ e => setFormEditar( p => ({ ...p, piso: e.target.value }) ) } />
                  <input style={inputEditar} placeholder="Departamento" value={formEditar.departamento}
                    onChange={ e => setFormEditar( p => ({ ...p, departamento: e.target.value }) ) } />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button onClick={guardarEdicion}
                      style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer' }}>
                      Guardar
                    </button>
                    <button onClick={ () => setEditandoId( null ) }
                      style={{ background: '#334155', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer' }}>
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
                    <button onClick={ () => iniciarEdicion( usuario ) }
                      style={{ background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px' }}>
                      Editar
                    </button>
                    <button onClick={ () => eliminarUsuario( usuario.id ) }
                      style={{ background: '#7f1d1d', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px' }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ) }

            </div>
          ))
        ) }
      </div>

    </div>
  );
}
