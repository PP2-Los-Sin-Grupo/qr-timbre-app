/* Pantalla de confirmacion: muestra que la notificacion fue enviada al residente
   con los datos del departamento seleccionado */

import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Stack, Typography, Paper } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

export const FormNotificacion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { piso, numero, residente } = location.state || {};

  /* Si se accede sin datos (ej. recargando la pagina), muestra error */
  if ( !piso || !numero ) {
    return (
      <Stack spacing={ 3 } sx={ { width: '75%', mt: 4, alignItems: 'center' } }>
        <Paper
          elevation={ 4 }
          sx={ {
            width: '100%',
            maxWidth: 620,
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
            border: theme => `1px solid ${ theme.palette.error.main }`,
            background: theme =>
              `linear-gradient(180deg, ${ theme.palette.mode === 'dark' ? 'rgba(244,67,54,0.16)' : 'rgba(244,67,54,0.1)' } 0%, ${ theme.palette.background.paper } 40%)`
          } }
        >
          <Stack spacing={ 1.5 } sx={ { alignItems: 'center' } }>
            <ErrorOutlineRoundedIcon color="error" sx={ { fontSize: 56 } } />
            <Typography variant="h5" color="error.main" sx={ { fontWeight: 700 } }>
              Ups, algo salio mal
            </Typography>
            <Typography variant="body1" sx={ { textAlign: 'center' } }>
              No pudimos identificar el departamento que queres contactar.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={ { textAlign: 'center', maxWidth: 520 } }>
              Volve al inicio, elegi piso y numero, y volve a intentar enviar la notificacion.
            </Typography>
          </Stack>
        </Paper>

        <Button variant="contained" color="error" onClick={ () => navigate( '/Inicio' ) } sx={ { py: 1.2, px: 4 } }>
          Ir al inicio
        </Button>
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
