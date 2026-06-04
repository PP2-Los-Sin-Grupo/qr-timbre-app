
import { useNavigate } from 'react-router-dom';
import { useDepartamentos } from './hooks/useDepartamentos';
import { Button, CircularProgress, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Stack, Switch, Typography } from '@mui/material';

export const Inicio = () => {
  const navigate = useNavigate();
  const {
    depto,
    piso,
    numerosPiso,
    loading,
    pisoNroSeleccionado,
    getDepartamentos,
    handleChangePiso,
    handleChangeNumero
  } = useDepartamentos();
  if ( loading ) return ( <CircularProgress /> );
  if ( !depto ) {
    return (
      <Stack
        direction="column"
        spacing={ 2 }
        sx={ {
          justifyContent: "center",
          alignItems: "center",
          width: '75%'
        } }
      >
        <Button
          variant='contained'
          color='inherit'
          onClick={ getDepartamentos }
        >
          Actualizar Departamentos
        </Button>
      </Stack>
    );
  }
  return (
    <Stack
      direction="column"
      spacing={ 2 }
      sx={ {
        justifyContent: "center",
        alignItems: "center",
        width: '75%'
      } }
    >
      <Typography variant="h6">¿A quien vas a visitar?</Typography>
      <FormControl fullWidth>
        <InputLabel id="id-label-piso">Piso</InputLabel>
        <Select
          id="select-piso"
          // value={ formNotificacion }
          label="Piso"
          onChange={ e => handleChangePiso( e.target.value ) }
        >
          { piso &&
            piso.map( p => {
              return (
                <MenuItem value={ p }>{ p }</MenuItem>
              );
            } )
          }
        </Select>
      </FormControl>
      { numerosPiso &&
        <FormControl fullWidth>
          <InputLabel id="id-label-numero">Numero</InputLabel>
          <Select
            id="select-numero"
            // value={ formNotificacion }
            label="Numero"
            onChange={ e => handleChangeNumero( e.target.value ) }
          >
            {
              numerosPiso.map( p => {
                return (
                  <MenuItem value={ p }>{ p }</MenuItem>
                );
              } )
            }
          </Select>
        </FormControl>
      }

      { pisoNroSeleccionado && pisoNroSeleccionado.piso && pisoNroSeleccionado.numero &&
        <>
          <FormGroup>
            <FormControlLabel control={ <Switch defaultChecked /> } label="Telegram" />
            <FormControlLabel control={ <Switch /> } label="Mail" />
          </FormGroup>
          <Button variant="contained" color="success"> Enviar Notificacion</Button>
        </>
      }

    </Stack>

  );
};
