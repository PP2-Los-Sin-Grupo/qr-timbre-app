
import { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Inicio } from './pages/Inicio/Inicio';
import { FormNotificacion } from './pages/FormNotificacion/FormNotificacion';
import { AppBar, Stack, Toolbar, Typography, IconButton } from '@mui/material';
import { ThemeProvider } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { createAppTheme } from './theme/appTheme';
import DashboardPage from './panel_admin/dashboard/DashboardPage';
import GestionUsuarioPage from './panel_admin/gestion_usuario/GestionUsuarioPage';
import CrearUsuarioPage from './panel_admin/crear_usuario/CrearUsuarioPage';
import { ProveedorUsuarios } from './panel_admin/contexto/UsuariosContexto';

export const App = () => {
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("theme") === "dark"
  );

  const toggleTheme = (): void => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const theme = useMemo(() => createAppTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <Stack
        direction="column"
        spacing={2}
        sx={{
          justifyContent: "flex-start",
          alignItems: "center",
          bgcolor: "background.default",
          color: "text.primary",
          width: "100vw",
          height: "100vh",
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography sx={{ flexGrow: 1 }}>
              🏢 Portero Virtual
            </Typography>

            <IconButton color="inherit" onClick={toggleTheme}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        

        <BrowserRouter>
        <ProveedorUsuarios>
          <Routes>
            
            <Route path="/" element={<Inicio />} />
            <Route path="/Inicio" element={<Inicio />} />
            <Route path="/FormNotificacion" element={<FormNotificacion />} />

            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/gestion-usuarios" element={<GestionUsuarioPage />} />
            <Route path="/crear-usuario" element={<CrearUsuarioPage />} />
          </Routes>
          </ProveedorUsuarios>
        </BrowserRouter>
      </Stack>
    </ThemeProvider>
  );
};

