import { useNavigate } from 'react-router-dom';
import { useUsuarios } from '../contexto/UsuariosContexto';

export default function AsignacionesPage() {
  const navigate = useNavigate();
  const { usuarios, eliminarUsuario } = useUsuarios();

  return (
    <div style={ { width: '100%', minHeight: '100vh', background: '#0f172a', color: 'white', padding: '40px', boxSizing: 'border-box' } }>

      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' } }>
        <h1 style={ { margin: 0 } }>Asignaciones</h1>
        <button
          onClick={ () => navigate( '/dashboard' ) }
          style={ { background: '#1e293b', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer', fontSize: '14px' } }
        >
          ← Volver
        </button>
      </div>

      { usuarios.length === 0 ? (
        <p style={ { color: '#94a3b8' } }>No hay usuarios asignados todavía.</p>
      ) : (
        <div style={ { display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px' } }>
          { usuarios.map( usuario => (
            <div key={usuario.id} style={ {
              background: '#1e293b',
              borderRadius: '14px',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            } }>
              <div>
                <h3 style={ { margin: '0 0 6px', fontSize: '16px' } }>{usuario.nombreCompleto}</h3>
                <span style={ { color: '#94a3b8', fontSize: '13px' } }>
                  Piso {usuario.piso} — Depto {usuario.departamento}
                </span>
              </div>
              <button
                onClick={ () => eliminarUsuario( usuario.id ) }
                style={ { background: '#7f1d1d', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' } }
              >
                Quitar
              </button>
            </div>
          ) ) }
        </div>
      ) }

    </div>
  );
}
