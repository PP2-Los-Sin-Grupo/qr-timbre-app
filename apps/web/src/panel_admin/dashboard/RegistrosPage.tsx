import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuarios } from '../contexto/UsuariosContexto';
import type { Usuario } from '../contexto/UsuariosContexto';

import { Box, Typography, Button, Paper, FormControl, InputLabel, Select, MenuItem, TextField, Alert, Stack, } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";

const TELEGRAM_TOKEN = '8538734871:AAFtB08xNbZWG55tbhRGu71dcayhkzn-51A';
const TELEGRAM_CHAT_ID = '915678499';

const NOMBRES_PISO: Record<number, string> = {
  1: 'PB', 2: '1er Piso', 3: '2do Piso', 4: '3er Piso', 5: '4to Piso',
  6: '5to Piso', 7: '6to Piso', 8: '7mo Piso', 9: '8vo Piso', 10: '9no Piso',
  11: '10mo Piso', 12: '11mo Piso', 13: '12mo Piso', 14: '13mo Piso',
  15: '14mo Piso', 16: '15mo Piso', 17: '16mo Piso', 18: '17mo Piso',
  19: '18mo Piso', 20: '19mo Piso',
};

type EstadoEnvio = 'idle' | 'enviando' | 'exito' | 'error';

export default function RegistrosPage() {
  const navigate = useNavigate();
  const { usuarios } = useUsuarios();

  const [ usuarioSeleccionado, setUsuarioSeleccionado ] = useState<Usuario | null>( null );
  const [ mensaje, setMensaje ] = useState( '' );
  const [ estadoEnvio, setEstadoEnvio ] = useState<EstadoEnvio>( 'idle' );
  const [ feedback, setFeedback ] = useState( '' );

  const handleSeleccion = ( id: string ) => {
    const u = usuarios.find( u => u.id === id ) ?? null;
    setUsuarioSeleccionado( u );
    setMensaje( '' );
    setEstadoEnvio( 'idle' );
    setFeedback( '' );
  };

  const nombrePiso = ( piso: string ) =>
    NOMBRES_PISO[ Number( piso ) ] ?? `Piso ${piso}`;

  const enviarMensaje = async () => {
    if ( !usuarioSeleccionado || !mensaje.trim() ) return;

    setEstadoEnvio( 'enviando' );
    setFeedback( '' );

    const texto =
      `🔔 *Mensaje del Portero Virtual*\n\n` +
      `👤 *Residente:* ${usuarioSeleccionado.nombreCompleto}\n` +
      `🏠 *Ubicación:* ${nombrePiso( usuarioSeleccionado.piso )} — Depto ${usuarioSeleccionado.departamento}\n` +
      `📧 *Email:* ${usuarioSeleccionado.email}\n\n` +
      `💬 *Mensaje:*\n${mensaje}`;

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: texto,
            parse_mode: 'Markdown',
          }),
        }
      );

      const data = await res.json();

      if ( data.ok ) {
        setEstadoEnvio( 'exito' );
        setFeedback( `✓ Mensaje enviado a Telegram correctamente` );
        setMensaje( '' );
      } else {
        throw new Error( data.description );
      }
    } catch ( e ) {
      console.error( e );
      setEstadoEnvio( 'error' );
      setFeedback( 'Error al enviar el mensaje. Revisá la conexión.' );
    }
  };

  return (
    <Box sx={{width: "80%", minHeight: "100%", height: "auto", bgcolor: "background.default", color: "text.primary", p: 5,}}>

      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' } }>
        <h1 style={ { margin: 0 } }>Registros</h1>
        <Button variant="contained" startIcon={<ArrowBackIcon />} 
          onClick={() => navigate("/dashboard")}
          sx={{ bgcolor: "primary.main", color: "primary.contrastText", borderRadius: 2, px: 2.5, py: 1.2, fontSize: 14, textTransform: "none",
          }}>
            Volver
        </Button>
      </div>


      <Box>

        <FormControl fullWidth>
          <InputLabel id="usuario-label">
            Seleccioná un usuario
          </InputLabel>

          <Select
            labelId="usuario-label"
            value={usuarioSeleccionado?.id ?? ""}
            label="Seleccioná un usuario"
            onChange={(e) => handleSeleccion(e.target.value)}
          >
            {usuarios.length === 0 ? (
              <MenuItem disabled value="">
                No hay usuarios registrados
              </MenuItem>
            ) : (
              usuarios.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.nombreCompleto} — {nombrePiso(u.piso)} Depto {u.departamento}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {usuarioSeleccionado && (
          <>
            <Paper elevation={3}
              sx={{mt: 3, p: 3, borderRadius: 3,}}>
              <Stack spacing={1}>
                <Typography variant="h6">
                  {usuarioSeleccionado.nombreCompleto}
                </Typography>

                <Typography color="text.secondary">
                  {nombrePiso(usuarioSeleccionado.piso)} — Depto{" "}
                  {usuarioSeleccionado.departamento}
                </Typography>

                <Typography color="primary">
                  {usuarioSeleccionado.email}
                </Typography>
              </Stack>
            </Paper>

            <TextField
              fullWidth
              multiline
              rows={5}
              label="Mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribí el mensaje para enviar al residente..."
              sx={{ mt: 3 }}
            />

            {feedback && (
              <Alert
                severity={estadoEnvio === "exito" ? "success" : "error"}
                sx={{ mt: 2 }}
              >
                {feedback}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<SendIcon />}
              onClick={enviarMensaje}
              disabled={
                !mensaje.trim() || estadoEnvio === "enviando"
              }
              sx={{ mt: 3 }}
            >
              {estadoEnvio === "enviando"
                ? "Enviando..."
                : "Enviar mensaje por Telegram"}
            </Button>
          </>
        )}

        {usuarios.length === 0 && (
          <Alert severity="warning" sx={{ mt: 3 }}>
            No hay usuarios registrados. Creá usuarios primero desde la sección Usuarios.
          </Alert>
        )}

      </Box>
    </Box>
  );
}