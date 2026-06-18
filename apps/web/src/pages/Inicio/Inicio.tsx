/* Pagina de inicio para el visitante: selecciona piso y numero, luego "Llamar"
   escribe la notificacion en Firestore y redirige a la pantalla de confirmacion */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepartamentos } from './hooks/useDepartamentos';
import InicioApi from './api/InicioApi';
import { Alert, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';

export const Inicio = () => {
  const navigate = useNavigate();
  const [ llamando, setLlamando ] = useState( false );
  const [ errorMsg, setErrorMsg ] = useState( '' );
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

  /* El boton se habilita solo cuando piso Y numero estan seleccionados */
  const puedeLlamar = pisoNroSeleccionado?.piso && pisoNroSeleccionado?.numero;

  /* Al apretar "Llamar": busca al residente en Firestore, crea la notificacion y navega */
  const handleLlamar = async () => {
    if ( !pisoNroSeleccionado?.piso || !pisoNroSeleccionado?.numero ) return;

    setLlamando( true );
    setErrorMsg( '' );

    try {
      /* 1. Buscar el residente del departamento seleccionado */
      const residente = await InicioApi.obtenerResidentePorDepto(
        pisoNroSeleccionado.piso,
        pisoNroSeleccionado.numero
      );

      if ( residente.estado !== 'success' || !residente.data ) {
        setErrorMsg( residente.mensaje );
        setLlamando( false );
        return;
      }

      /* 2. Crear la notificacion en Firestore */
      const notificacion = await InicioApi.crearNotificacion( residente.data.id );

      if ( notificacion.estado !== 'success' ) {
        setErrorMsg( notificacion.mensaje );
        setLlamando( false );
        return;
      }

      /* 3. Navegar a la pantalla de exito */
      navigate( '/FormNotificacion', {
        state: {
          piso: pisoNroSeleccionado.piso,
          numero: pisoNroSeleccionado.numero,
          residente: `${ residente.data.nombre } ${ residente.data.apellido }`
        }
      } );
    }
    catch {
      setErrorMsg( 'Ocurrio un error inesperado' );
    }
    finally {
      setLlamando( false );
    }
  };

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
          label="Piso"
          onChange={ e => handleChangePiso( e.target.value ) }
        >
          { piso &&
            piso.map( p => {
              return (
                <MenuItem key={ p } value={ p }>{ p }</MenuItem>
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
            label="Numero"
            onChange={ e => handleChangeNumero( e.target.value ) }
          >
            {
              numerosPiso.map( p => {
                return (
                  <MenuItem key={ p } value={ p }>{ p }</MenuItem>
                );
              } )
            }
          </Select>
        </FormControl>
      };

      { errorMsg && <Alert severity="error">{ errorMsg }</Alert> }

      {/*
      { pisoNroSeleccionado && pisoNroSeleccionado.piso && pisoNroSeleccionado.numero &&
        <>
          <FormGroup>
            <FormControlLabel control={ <Switch defaultChecked /> } label="Telegram" />
            <FormControlLabel control={ <Switch /> } label="Mail" />
          </FormGroup>
          <Button variant="contained" color="success"> Enviar Notificacion</Button>
        </>
      } */}


      <Button
        variant="contained"
        color="success"
        size="large"
        disabled={ !puedeLlamar || llamando }
        onClick={ handleLlamar }
        sx={ { width: '100%', py: 1.5, fontSize: '1.1rem' } }
      >
        { llamando ? 'Enviando...' : '🔔 Llamar' }
      </Button>
    </Stack >
  );
};
