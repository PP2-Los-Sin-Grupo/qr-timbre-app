import { useNavigate } from 'react-router-dom';
import { useUsuarios } from '../contexto/UsuariosContexto';
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function AsignacionesPage() {
  const navigate = useNavigate();
  const { usuarios, eliminarUsuario } = useUsuarios();

  return (
    <Box sx={{width: "80%", height: "auto", bgcolor: "background.default", color: "text.primary", p: 5,}}>
  
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' } }>
        <h1 style={ { margin: 0 } }>Asignaciones</h1>
        <Button variant="contained" startIcon={<ArrowBackIcon />} 
          onClick={() => navigate("/dashboard")}
          sx={{ bgcolor: "primary.main", color: "primary.contrastText", borderRadius: 2, px: 2.5, py: 1.2, fontSize: 14, textTransform: "none",
          }}>
            Volver
        </Button>
      </div>

  
      {usuarios.length === 0 ? (
        <Typography color="text.secondary">
          No hay usuarios asignados todavía.
        </Typography>
      ) : (
        <Stack spacing={2} maxWidth={600}>
          {usuarios.map((usuario) => (
            <Paper
              key={usuario.id}
              sx={{
                p: 3,
                borderRadius: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "background.paper",
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {usuario.nombreCompleto}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Piso {usuario.piso} — Depto {usuario.departamento}
                </Typography>
              </Box>

              {/* Botón */}
              <Button
                variant="contained"
                color="error"
                onClick={() => eliminarUsuario(usuario.id)}
              >
                Quitar
              </Button>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
