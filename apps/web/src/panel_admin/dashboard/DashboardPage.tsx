import "./styles.css";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useDashboard } from "./useDashboard";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { stats, error, cargarEstadisticas } = useDashboard();

  return (
    <div className="contenedor-dashboard">
      <div className="cabecera">
        <h1>ADMIN</h1>
      </div>

      {error && (
        <div style={{ color: "#f87171", marginBottom: "16px" }}>
          {error}
          <button
            onClick={cargarEstadisticas}
            style={{ marginLeft: "12px", cursor: "pointer" }}
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="estadisticas">
        <Box
          className="tarjeta-estadistica"
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
          onClick={() => navigate("/departamentos")}
        >
          <h2>{stats?.totalDepartamentos ?? 0}</h2>
          <span>Departamentos</span>
        </Box>

        <Box
          className="tarjeta-estadistica"
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <h2>{stats?.totalUsuarios ?? 0}</h2>
          <span>Usuarios</span>
        </Box>
      </div>

      <div className="menu">
        <Button variant="contained" color="primary" className="tarjeta-menu">
          Departamentos
        </Button>

        <Button
          variant="contained"     
          color="primary"
          className="tarjeta-menu"
          onClick={() => navigate("/gestion-usuarios")}
        >
          Usuarios
        </Button>

        <Button
          variant="contained"
          color="primary"
          className="tarjeta-menu"
          onClick={() => navigate("/asignaciones")}
        >
          Asignaciones
        </Button>

        <Button
          variant="contained"
          color="primary"
          className="tarjeta-menu"
          onClick={() => navigate("/registros")}
        >
          Registros
        </Button>
      </div>
    </div>
  );
}
