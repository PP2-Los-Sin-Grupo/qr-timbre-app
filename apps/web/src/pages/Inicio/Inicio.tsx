
import { useNavigate } from 'react-router-dom';
import { useDepartamentos } from './hooks/useDepartamentos';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';

export const Inicio = () => {
  const navigate = useNavigate();
  const {
    piso,
    numerosPiso,
    loading,
    getDepartamentos,
    handleChangePiso,
    handleChangeNumero
  } = useDepartamentos();
  if ( loading ) return ( <CircularProgress /> );
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

    </Stack>

  );
};
