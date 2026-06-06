/* Pantalla de confirmacion: muestra que la notificacion fue enviada al residente
   con los datos del departamento seleccionado */

import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Stack, Typography, Paper } from '@mui/material';

export const FormNotificacion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { piso, numero, residente } = location.state || {};

  /* Si se accede sin datos (ej. recargando la pagina), muestra error */
  if ( !piso || !numero ) {
    return (
      <Stack spacing={ 2 } sx={ { width: '75%', mt: 4, alignItems: 'center' } }>
        <Typography variant="h6" color="error">Error: no se recibieron datos del departamento</Typography>
        <Button variant="contained" onClick={ () => navigate( '/Inicio' ) }>Volver</Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={ 3 } sx={ { width: '75%', mt: 4, alignItems: 'center' } }>
      <Paper elevation={ 3 } sx={ { p: 4, textAlign: 'center', width: '100%' } }>
        <Typography variant="h4" sx={ { mb: 2, color: '#22c55e' } }>
          ✅ ¡Aviso enviado!
        </Typography>
        <Typography variant="body1" sx={ { mb: 1 } }>
          El residente del <strong>Piso { piso } - Depto { numero }</strong> fue notificado
        </Typography>
        { residente && (
          <Typography variant="body2" color="text.secondary">
            { residente }
          </Typography>
        ) }
      </Paper>

      <Button variant="contained" onClick={ () => navigate( '/Inicio' ) } sx={ { py: 1.5, px: 4 } }>
        Volver al inicio
      </Button>
    </Stack>
  );
};
