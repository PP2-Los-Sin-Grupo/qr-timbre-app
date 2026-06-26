import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuarios } from '../contexto/UsuariosContexto';
import type { Usuario } from '../contexto/UsuariosContexto';

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
    <div style={ { width: '100%', minHeight: '100vh', background: '#0f172a', color: 'white', padding: '40px', boxSizing: 'border-box' } }>

      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' } }>
        <h1 style={ { margin: 0 } }>Registros</h1>
        <button onClick={ () => navigate( '/dashboard' ) } style={ botonVolver }>← Volver</button>
      </div>

      <div style={ { maxWidth: '560px' } }>

        <label style={ labelStyle }>Seleccioná un usuario</label>
        <select onChange={ e => handleSeleccion( e.target.value ) } defaultValue="" style={ selectStyle }>
          <option value="" disabled>— Elegí un usuario —</option>
          { usuarios.length === 0 && <option disabled>No hay usuarios registrados</option> }
          { usuarios.map( u => (
            <option key={u.id} value={u.id}>
              {u.nombreCompleto} — {nombrePiso( u.piso )} Depto {u.departamento}
            </option>
          ) ) }
        </select>

        { usuarioSeleccionado && (
          <div style={ { background: '#1e293b', borderRadius: '14px', padding: '20px 24px', margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '6px' } }>
            <p style={ { margin: 0, fontSize: '17px', fontWeight: 600 } }>{usuarioSeleccionado.nombreCompleto}</p>
            <p style={ { margin: 0, color: '#94a3b8', fontSize: '14px' } }>
              {nombrePiso( usuarioSeleccionado.piso )} — Depto {usuarioSeleccionado.departamento}
            </p>
            <p style={ { margin: 0, color: '#38bdf8', fontSize: '14px' } }>{usuarioSeleccionado.email}</p>
          </div>
        ) }

        { usuarioSeleccionado && (
          <>
            <label style={ { ...labelStyle, marginTop: '8px' } }>Mensaje</label>
            <textarea
              value={mensaje}
              onChange={ e => setMensaje( e.target.value ) }
              placeholder="Escribí el mensaje para enviar al residente..."
              rows={5}
              style={ textareaStyle }
            />

            { feedback && (
              <p style={ { color: estadoEnvio === 'exito' ? '#4ade80' : '#f87171', fontSize: '14px', margin: '8px 0' } }>
                {feedback}
              </p>
            ) }

            <button
              onClick={enviarMensaje}
              disabled={ !mensaje.trim() || estadoEnvio === 'enviando' }
              style={ {
                marginTop: '12px', width: '100%', padding: '14px',
                background: ( !mensaje.trim() || estadoEnvio === 'enviando' ) ? '#334155' : '#3b82f6',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: 600,
                cursor: ( !mensaje.trim() || estadoEnvio === 'enviando' ) ? 'not-allowed' : 'pointer',
              } }
            >
              { estadoEnvio === 'enviando' ? 'Enviando...' : '📨 Enviar mensaje por Telegram' }
            </button>
          </>
        ) }

        { usuarios.length === 0 && (
          <p style={ { color: '#f87171', fontSize: '14px', marginTop: '16px' } }>
            ⚠️ No hay usuarios registrados. Creá usuarios primero desde la sección Usuarios.
          </p>
        ) }

      </div>
    </div>
  );
}

const botonVolver: React.CSSProperties = {
  background: '#1e293b', color: 'white', border: 'none',
  borderRadius: '10px', padding: '10px 20px', cursor: 'pointer', fontSize: '14px',
};
const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '14px',
};
const selectStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', background: '#1e293b',
  border: '1px solid #334155', borderRadius: '10px', color: 'white',
  fontSize: '15px', boxSizing: 'border-box', cursor: 'pointer',
};
const textareaStyle: React.CSSProperties = {
  width: '100%', padding: '14px', background: '#1e293b',
  border: '1px solid #334155', borderRadius: '10px', color: 'white',
  fontSize: '15px', boxSizing: 'border-box', resize: 'vertical',
  fontFamily: 'inherit', outline: 'none',
};
