import './styles.css';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from './useDashboard';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { stats, loading, error, cargarEstadisticas } = useDashboard();

  return (
    <div className="contenedor-dashboard">

      <div className="cabecera">
        <h1>ADMIN</h1>
      </div>

      { error && (
        <div style={{ color: '#f87171', marginBottom: '16px' }}>
          { error }
          <button
            onClick={ cargarEstadisticas }
            style={{ marginLeft: '12px', cursor: 'pointer' }}
          >
            Reintentar
          </button>
        </div>
      ) }

     

      <div className="menu">

        <button
          className="tarjeta-menu"
          onClick={ () => navigate( '/departamentos' ) }
        >
          Departamentos
        </button>

        <button
          className="tarjeta-menu"
          onClick={ () => navigate( '/gestion-usuarios' ) }
        >
          Usuarios
        </button>

        <button
          className="tarjeta-menu"
          onClick={ () => navigate( '/asignaciones' ) }
        >
          Asignaciones
        </button>

        <button
          className="tarjeta-menu"
          onClick={ () => navigate( '/registros' ) }
        >
          Registros
        </button>

      </div>
    </div>
  );
}
