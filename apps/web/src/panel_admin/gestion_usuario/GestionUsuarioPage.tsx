import "./styles.css";
import "../panel.css";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuarios } from "../contexto/UsuariosContexto";
import type { Usuario } from "../contexto/UsuariosContexto";
import { Alert, Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


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
    <Box sx={{ width: "80%", padding: 4, margin: "0 auto", bgcolor: "background.paper", borderRadius: 2, boxShadow: 3, }}>

      <div style={ {  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' } }>
        <h1 style={ { margin: 0 } }>Usuarios</h1>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" startIcon={<AddIcon />}
            onClick={() => navigate("/crear-usuario")}>Nuevo
          </Button>

          <Button variant="outlined" startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard")}>Volver
          </Button>
        </Stack>
      </div>

      <TextField fullWidth label="Buscar usuario" value={textoBusqueda}
        onChange={(e) => setTextoBusqueda(e.target.value)}
        sx={{ mb: 3 }}/>

      <Stack spacing={2}>
        {cargando ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : usuariosFiltrados.length === 0 ? (
          <Alert severity="info">
            No hay usuarios registrados.
          </Alert>
        ) : (
          usuariosFiltrados.map((usuario) => (
            <Paper key={usuario.id} elevation={2}
              sx={{ p: 3 }}
            >
              {editandoId === usuario.id ? (
                <Stack spacing={4}>
                  
                  <TextField label="Nombre completo" value={formEditar.nombreCompleto}
                    onChange={(e) =>
                      setFormEditar((p) => ({
                        ...p,
                        nombreCompleto: e.target.value,
                      }))
                    }/>

                  <TextField label="Email" value={formEditar.email}
                    onChange={(e) =>
                      setFormEditar((p) => ({
                        ...p,
                        email: e.target.value,
                      }))
                    }/>

                  <TextField label="Piso" value={formEditar.piso}
                    onChange={(e) =>
                      setFormEditar((p) => ({
                        ...p,
                        piso: e.target.value,
                      }))
                    }/>

                  <TextField
                    label="Departamento" value={formEditar.departamento}
                    onChange={(e) =>
                      setFormEditar((p) => ({
                        ...p,
                        departamento: e.target.value,
                      }))
                    }
                  />

                  <Stack direction="row" spacing={2} >
                    <Button variant="contained" startIcon={<SaveIcon />} 
                      onClick={guardarEdicion}> Guardar
                    </Button>

                    <Button variant="outlined" startIcon={<CloseIcon />}
                      onClick={() => setEditandoId(null)}> Cancelar
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}
                >
                  <Box>
                    <Typography variant="h6">
                      {usuario.nombreCompleto}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Piso {usuario.piso} - Depto {usuario.departamento}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" startIcon={<EditIcon />}
                      onClick={() => iniciarEdicion(usuario)}>Editar
                    </Button>

                    <Button variant="contained" startIcon={<DeleteIcon />} color="error"
                      onClick={() => eliminarUsuario(usuario.id)}>Eliminar
                    </Button>
                  </Stack>
                </div>
              )}
            </Paper>
          ))
        )}
      </Stack>
    </Box>
  );
}
