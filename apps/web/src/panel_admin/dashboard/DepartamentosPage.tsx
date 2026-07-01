import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {Box, Typography, Button, Paper, Alert, FormControl, InputLabel, Select, MenuItem, TextField,} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

type Estado = 'idle' | 'generando' | 'exito' | 'error';

interface Departamento {
  id: string;
  piso: string;
  numero: string;
  activo: boolean;
}

const NOMBRES_PISO: Record<number, string> = {
  1: 'PB',
  2: '1er Piso',
  3: '2do Piso',
  4: '3er Piso',
  5: '4to Piso',
  6: '5to Piso',
  7: '6to Piso',
  8: '7mo Piso',
  9: '8vo Piso',
  10: '9no Piso',
  11: '10mo Piso',
  12: '11mo Piso',
  13: '12mo Piso',
  14: '13mo Piso',
  15: '14mo Piso',
  16: '15mo Piso',
  17: '16mo Piso',
  18: '17mo Piso',
  19: '18mo Piso',
  20: '19mo Piso',
};

export default function DepartamentosPage() {
  const navigate = useNavigate();

  const [ estado, setEstado ] = useState<Estado>( 'idle' );
  const [ mensaje, setMensaje ] = useState( '' );
  const [ departamentosGuardados, setDepartamentosGuardados ] = useState<Departamento[]>( [] );

  const [ nuevoPiso, setNuevoPiso ] = useState( '' );
  const [ nuevoNumero, setNuevoNumero ] = useState( '' );

  useEffect( () => {
    let activo = true;
    ( async () => {
      const snap = await getDocs( collection( db, 'departamentos' ) );
      if ( !activo ) return;
      const lista: Departamento[] = snap.docs.map( d => ( {
        id: d.id,
        piso: d.data()[ 'piso' ] ?? '',
        numero: d.data()[ 'numero' ] ?? '',
        activo: d.data()[ 'activo' ] !== false,
      } ) );
      setDepartamentosGuardados( lista );
    } )();
    return () => { activo = false; };
  }, [] );

  const agregarUno = async () => {
    const piso = nuevoPiso.trim();
    const numero = nuevoNumero.trim().toUpperCase();
    if ( !piso || !numero ) return;
    setEstado( 'generando' );
    setMensaje( '' );
    try {
      const snap = await getDocs( collection( db, 'departamentos' ) );
      const existe = snap.docs.some(
        d => String( d.data()[ 'piso' ] ) === piso
          && String( d.data()[ 'numero' ] ).toUpperCase() === numero,
      );
      if ( existe ) {
        setEstado( 'error' );
        setMensaje( `Ya existe ${ NOMBRES_PISO[ Number( piso ) ] ?? `piso ${piso}` } - Depto ${numero}` );
        return;
      }
      await addDoc( collection( db, 'departamentos' ), {
        piso,
        numero,
        activo: true,
      } );
      const final = await getDocs( collection( db, 'departamentos' ) );
      const lista: Departamento[] = final.docs.map( d => ( {
        id: d.id,
        piso: d.data()[ 'piso' ] ?? '',
        numero: d.data()[ 'numero' ] ?? '',
        activo: d.data()[ 'activo' ] !== false,
      } ) );
      setDepartamentosGuardados( lista );
      setNuevoPiso( '' );
      setNuevoNumero( '' );
      setEstado( 'exito' );
      setMensaje( `✓ Agregado ${ NOMBRES_PISO[ Number( piso ) ] ?? `piso ${piso}` } - Depto ${numero}` );
    } catch {
      setEstado( 'error' );
      setMensaje( 'Ocurrió un error al guardar el departamento' );
    }
  };

  const pisosUnicos = [ ...new Set( departamentosGuardados.map( d => d.piso ) ) ]
    .sort( ( a, b ) => Number( b ) - Number( a ) );
  const letrasUnicas = [ ...new Set( departamentosGuardados.map( d => d.numero ) ) ]
    .sort();

  return (
    <Box 
      sx={{height: "auto", bgcolor: "background.default", color: "text.primary", p: 4,}}>

      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' } }>
        <h1 style={ { margin: 0 } }>Departamentos</h1>
        <Button variant="contained" startIcon={<ArrowBackIcon />} 
          onClick={() => navigate("/dashboard")}
          sx={{ bgcolor: "primary.main", color: "primary.contrastText", borderRadius: 2, px: 2.5, py: 1.2, fontSize: 14, textTransform: "none",}}>
            Volver
        </Button>
      </div>

      {departamentosGuardados.length > 0 && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Actualmente guardados: <strong> {departamentosGuardados.length} departamentos</strong>
        </Alert>
      )}

      <Box 
      sx={{ display: "flex", gap: 4, alignItems: "flex-start", flexWrap: "wrap",}}>
      
      <Paper
        elevation={3}
        sx={{ p: 4, width: 300, flexShrink: 0, borderRadius: 3, }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Agregar un departamento
        </Typography>

        <FormControl fullWidth>
          <InputLabel id="piso-label">Piso</InputLabel>

          <Select
            labelId="piso-label"
            value={nuevoPiso}
            label="Piso"
            onChange={(e) => setNuevoPiso(e.target.value)}
          >
            <MenuItem value="">
              <em>Seleccioná un piso</em>
            </MenuItem>

            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <MenuItem key={n} value={String(n)}>
                {NOMBRES_PISO[n] ?? `Piso ${n}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Departamento"
          placeholder="Ej: A"
          value={nuevoNumero}
          onChange={(e) => setNuevoNumero(e.target.value)}
          sx={{ mt: 3 }}
        />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          Se guarda con <strong>activo: true</strong> por defecto.
        </Typography>

        {mensaje && (
          <Alert severity={estado === "exito" ? "success" : "error"}
            sx={{ mt: 2 }}>
            {mensaje}
          </Alert>
        )}

        <Button fullWidth variant="contained" startIcon={<AddIcon />}
          onClick={agregarUno} disabled={!nuevoPiso || !nuevoNumero}
          sx={{ mt: 3 }}>
          Agregar departamento
        </Button>
      </Paper>

        {departamentosGuardados.length > 0 && (
          <Box sx={{ flex: 1, minWidth: 280 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Vista del edificio
            </Typography>

            <Box sx={{ overflowX: "auto" }}>
              <Box
                sx={{display: "grid", gridTemplateColumns: `140px repeat(${letrasUnicas.length}, 70px)`, gap: 1, alignItems: "center", }}>
              <Box />

                {letrasUnicas.map((letra) => (
                  <Paper key={letra}
                    sx={{p: 1, textAlign: "center", bgcolor: "primary.dark", color: "primary.contrastText", fontWeight: 600,}}>
                    Depto {letra}
                  </Paper>
                ))}

                {pisosUnicos.map((piso) => (
                  <Box key={piso}
                    sx={{display: "contents",}}>
                    
                    <Typography
                      sx={{fontWeight: 600, color: "text.secondary",}}>
                      {NOMBRES_PISO[Number(piso)]}
                    </Typography>

                    {letrasUnicas.map((letra) => {
                      const depto = departamentosGuardados.find(
                        (d) => d.piso === piso && d.numero === letra
                      );

                      return (
                        <Paper key={`${piso}-${letra}`}
                          elevation={depto ? 2 : 0}
                          sx={{height: 56, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: depto ? "background.paper" : "action.hover", color: depto  ? "text.primary"  : "text.disabled", fontWeight: 600,}}>
                          {depto ? `${Number(piso) === 1 ? "PB" : Number(piso) - 1}${letra}` : "—"}
                        </Paper>
                      );
                    })}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}

      </Box>
    </Box>
  );
}
