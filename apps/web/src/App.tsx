
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Inicio } from './pages/Inicio/Inicio';
import { FormNotificacion } from './pages/FormNotificacion/FormNotificacion';
import { AppBar, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material';

export const App = () => {
  return (
    <Stack
      direction="column"
      spacing={ 2 }
      sx={ {
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: '#a7a7a7',
        width: '100vw',
        height: '100vh'
      } }
    >
      <AppBar
        position="static"
        sx={ {
          backgroundColor: "#0a1335",
          height: '10vh',
          justifyContent: 'center',
          alignItems: "center"
        } }
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={ { flexGrow: 1 } }>
            🏢 Portero Virtual
          </Typography>
        </Toolbar>
      </AppBar>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Inicio /> } />
          <Route path="/Inicio" element={ <Inicio /> } />
          <Route path="/FormNotificacion" element={ <FormNotificacion /> } />
        </Routes>
      </BrowserRouter>
    </Stack>
  );
};
