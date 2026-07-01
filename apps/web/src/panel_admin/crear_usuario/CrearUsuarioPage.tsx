import "./styles.css";
import "../panel.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { useUsuarios } from "../contexto/UsuariosContexto";
import { db } from "../../firebase/config";

import {Box, Stack, Button, TextField, FormControl, InputLabel, Select, MenuItem, Alert,} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface DeptoStorage {
  id: string;
  piso: string;
  numero: string;
}

const NOMBRES_PISO: Record<number, string> = {
  1: 'PB', 2: '1er Piso', 3: '2do Piso', 4: '3er Piso', 5: '4to Piso',
  6: '5to Piso', 7: '6to Piso', 8: '7mo Piso', 9: '8vo Piso', 10: '9no Piso',
  11: '10mo Piso', 12: '11mo Piso', 13: '12mo Piso', 14: '13mo Piso',
  15: '14mo Piso', 16: '15mo Piso', 17: '16mo Piso',
  18: '17mo Piso', 19: '18mo Piso', 20: '19mo Piso',
};

const capitalizarNombre = ( texto: string ) =>
  texto
    .split( " " )
    .map( palabra => palabra.charAt( 0 ).toUpperCase() + palabra.slice( 1 ).toLowerCase() )
    .join( " " );

export default function CrearUsuarioPage() {
  const navigate = useNavigate();
  const { agregarUsuario } = useUsuarios();

  const [ nombreCompleto, setNombreCompleto ] = useState( "" );
  const [ email, setEmail ] = useState( "" );
  const [ pisoSeleccionado, setPisoSeleccionado ] = useState( "" );
  const [ deptoSeleccionado, setDeptoSeleccionado ] = useState( "" );
  const [ errorMsg, setErrorMsg ] = useState( "" );

  const [ pisosDisponibles, setPisosDisponibles ] = useState<string[]>( [] );
  const [ deptosDisponibles, setDeptosDisponibles ] = useState<string[]>( [] );
  const [ todosDeptos, setTodosDeptos ] = useState<DeptoStorage[]>( [] );

  useEffect( () => {
    let activo = true;
    ( async () => {
      const [ deptosSnap, usuariosSnap ] = await Promise.all( [
        getDocs( collection( db, 'departamentos' ) ),
        getDocs( collection( db, 'usuarios' ) ),
      ] );
      if ( !activo ) return;

      const ocupados = new Set(
        usuariosSnap.docs
          .map( d => d.data()[ 'departamentoId' ] )
          .filter( ( id ): id is string => !!id ),
      );

      const deptos: DeptoStorage[] = deptosSnap.docs
        .filter( d => d.data()[ 'activo' ] !== false )
        .filter( d => !ocupados.has( d.id ) )
        .map( d => ( {
          id: d.id,
          piso: d.data()[ 'piso' ] ?? '',
          numero: d.data()[ 'numero' ] ?? '',
        } ) )
        .filter( d => d.piso && d.numero );
      setTodosDeptos( deptos );
      const pisos = [ ...new Set( deptos.map( d => d.piso ) ) ]
        .sort( ( a, b ) => Number( a ) - Number( b ) );
      setPisosDisponibles( pisos );
    } )();
    return () => { activo = false; };
  }, [] );

  useEffect( () => {
    if ( !pisoSeleccionado ) { setDeptosDisponibles( [] ); setDeptoSeleccionado( "" ); return; }
    const letras = todosDeptos
      .filter( d => d.piso === pisoSeleccionado )
      .map( d => d.numero )
      .sort();
    setDeptosDisponibles( letras );
    setDeptoSeleccionado( "" );
  }, [ pisoSeleccionado, todosDeptos ] );

  const crearUsuario = async () => {
    if ( !nombreCompleto || !email || !pisoSeleccionado || !deptoSeleccionado ) {
      setErrorMsg( "Completá todos los campos" );
      return;
    }
    const ok = await agregarUsuario({
      nombreCompleto,
      email,
      piso: pisoSeleccionado,
      departamento: deptoSeleccionado,
    });
    if ( ok ) {
      navigate( "/gestion-usuarios" );
    } else {
      setErrorMsg( "Ocurrió un error al guardar el usuario" );
    }
  };

  return (
    <Box sx={{width: "80%", height: "auto", bgcolor: "background.default", color: "text.primary", p: 5,}}>

      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' } }>
        <h1 style={ { margin: 0 } }>Nuevo Usuario</h1>
        <Button variant="contained" startIcon={<ArrowBackIcon />} 
          onClick={() => navigate("/dashboard")}
          sx={{ bgcolor: "primary.main", color: "primary.contrastText", borderRadius: 2, px: 2.5, py: 1.2, fontSize: 14, textTransform: "none",
          }}>
            Volver
        </Button>
      </div>

      <Stack spacing={3}>
        <TextField fullWidth label="Nombre completo" value={nombreCompleto}
          onChange={(e) => setNombreCompleto(capitalizarNombre(e.target.value))}/>

      <TextField fullWidth label="Email" type="email"  value={email}  onChange={(e) => setEmail(e.target.value)}/>

      {pisosDisponibles.length === 0 ? (
        <Alert severity="warning">No hay departamentos generados. Generá los departamentos primero desde el Dashboard.
        </Alert>) : (
        <>
          <FormControl fullWidth>
            <InputLabel id="piso-label">Piso</InputLabel>

            <Select labelId="piso-label" value={pisoSeleccionado} label="Piso" onChange={(e) => setPisoSeleccionado(e.target.value)}>
              <MenuItem value="">
                <em>Seleccioná un piso</em>
              </MenuItem>

              {pisosDisponibles.map((piso) => (
                <MenuItem key={piso} value={piso}>
                  {NOMBRES_PISO[Number(piso)] ?? `Piso ${piso}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!pisoSeleccionado}>
            <InputLabel id="depto-label">Departamento</InputLabel>

            <Select labelId="depto-label" value={deptoSeleccionado} label="Departamento"
              onChange={(e) => setDeptoSeleccionado(e.target.value)}>
              <MenuItem value="">
                <em>Seleccioná un departamento</em>
              </MenuItem>

              {deptosDisponibles.map((letra) => (
                <MenuItem key={letra} value={letra}>
                  Depto {letra}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
    </Stack>

    {errorMsg && (
      <Alert severity="error">{errorMsg}
      </Alert>
    )}

    <Button fullWidth variant="contained" size="large" sx={{ mt: 3 }}
      onClick={crearUsuario}>Crear y enviar credenciales
    </Button>

   </Box>
  );
}
