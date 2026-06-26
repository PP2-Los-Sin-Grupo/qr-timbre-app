import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Estado = 'idle' | 'generando' | 'exito' | 'error';

interface Departamento {
  id: string;
  piso: string;
  numero: string;
  activo: boolean;
}

const STORAGE_KEY = 'departamentos';

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

  const [ pisos, setPisos ] = useState<number | ''>( '' );
  const [ deptosPorPiso, setDeptosPorPiso ] = useState<number | ''>( '' );
  const [ estado, setEstado ] = useState<Estado>( 'idle' );
  const [ mensaje, setMensaje ] = useState( '' );
  const [ departamentosGuardados, setDepartamentosGuardados ] = useState<Departamento[]>( [] );

  useEffect( () => {
    const guardados = localStorage.getItem( STORAGE_KEY );
    if ( guardados ) setDepartamentosGuardados( JSON.parse( guardados ) );
  }, [] );

  const handlePisos = ( v: string ) => {
    const n = v === '' ? '' : Math.min( 20, Math.max( 1, Number( v ) ) );
    setPisos( n );
  };

  const handleDeptos = ( v: string ) => {
    const n = v === '' ? '' : Math.min( 10, Math.max( 1, Number( v ) ) );
    setDeptosPorPiso( n );
  };

  const generarDepartamentos = () => {
    if ( !pisos || !deptosPorPiso ) return;
    setEstado( 'generando' );
    try {
      const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice( 0, Number( deptosPorPiso ) );
      const departamentos: Departamento[] = [];
      for ( let piso = 1; piso <= Number( pisos ); piso++ ) {
        for ( const letra of letras ) {
          departamentos.push({ id: `${piso}${letra}`, piso: String( piso ), numero: letra, activo: true });
        }
      }
      localStorage.setItem( STORAGE_KEY, JSON.stringify( departamentos ) );
      setDepartamentosGuardados( departamentos );
      setEstado( 'exito' );
      setMensaje( `✓ Se generaron ${departamentos.length} departamentos` );
    } catch {
      setEstado( 'error' );
      setMensaje( 'Ocurrió un error al guardar los departamentos' );
    }
  };

  const pisosUnicos = [ ...new Set( departamentosGuardados.map( d => d.piso ) ) ]
    .sort( ( a, b ) => Number( b ) - Number( a ) );
  const letrasUnicas = [ ...new Set( departamentosGuardados.map( d => d.numero ) ) ]
    .sort();

  const total = pisos && deptosPorPiso ? Number( pisos ) * Number( deptosPorPiso ) : 0;

  return (
    <div style={ { width: '100%', minHeight: '100vh', background: '#0f172a', color: 'white', padding: '40px', boxSizing: 'border-box' } }>

      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' } }>
        <h1 style={ { margin: 0 } }>Departamentos</h1>
        <button onClick={ () => navigate( '/dashboard' ) } style={ botonVolver }>← Volver</button>
      </div>

      { departamentosGuardados.length > 0 && (
        <div style={ { color: '#4ade80', background: '#1e293b', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', fontSize: '14px' } }>
          Actualmente guardados: <strong>{departamentosGuardados.length} departamentos</strong>
        </div>
      ) }

      <div style={ { display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' } }>

        {/* Formulario */}
        <div style={ { background: '#1e293b', borderRadius: '16px', padding: '30px', width: '300px', flexShrink: 0 } }>
          <h2 style={ { marginTop: 0, marginBottom: '20px', fontSize: '18px' } }>Generar departamentos</h2>

          <label style={ labelStyle }>Cantidad de pisos (1–20)</label>
          <input type="number" min={1} max={20} value={pisos}
            onChange={ e => handlePisos( e.target.value ) }
            placeholder="Ej: 5" style={ inputStyle } />

          <label style={ { ...labelStyle, marginTop: '16px' } }>Departamentos por piso (1–10)</label>
          <input type="number" min={1} max={10} value={deptosPorPiso}
            onChange={ e => handleDeptos( e.target.value ) }
            placeholder="Ej: 4" style={ inputStyle } />

          { total > 0 && (
            <p style={ { color: '#38bdf8', fontSize: '14px', margin: '16px 0 0' } }>
              Se van a crear <strong>{total}</strong> departamentos ({pisos} × {deptosPorPiso})
            </p>
          ) }

          { mensaje && (
            <p style={ { color: estado === 'exito' ? '#4ade80' : '#f87171', fontSize: '14px', margin: '12px 0 0' } }>
              {mensaje}
            </p>
          ) }

          <button
            onClick={ generarDepartamentos }
            disabled={ !pisos || !deptosPorPiso }
            style={ {
              marginTop: '24px', width: '100%', padding: '12px',
              background: ( !pisos || !deptosPorPiso ) ? '#334155' : '#3b82f6',
              color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px',
              cursor: ( !pisos || !deptosPorPiso ) ? 'not-allowed' : 'pointer',
            } }
          >
            Generar departamentos
          </button>
        </div>

        {/* Grilla: filas = pisos, columnas = letras */}
        { departamentosGuardados.length > 0 && (
          <div style={ { flex: 1, minWidth: '280px' } }>
            <h2 style={ { marginTop: 0, marginBottom: '20px', fontSize: '18px' } }>Vista del edificio</h2>

            <div style={ { overflowX: 'auto' } }>
              <table style={ { borderCollapse: 'separate', borderSpacing: '6px' } }>
                <thead>
                  <tr>
                    <th style={ thEtiqueta }></th>
                    { letrasUnicas.map( letra => (
                      <th key={letra} style={ thEncabezado }>Depto {letra}</th>
                    ) ) }
                  </tr>
                </thead>
                <tbody>
                  { pisosUnicos.map( piso => (
                    <tr key={piso}>
                      <td style={ thEtiqueta }>
                        { NOMBRES_PISO[ Number( piso ) ] ?? `Piso ${piso}` }
                      </td>
                      { letrasUnicas.map( letra => {
                        const depto = departamentosGuardados.find( d => d.piso === piso && d.numero === letra );
                        return (
                          <td key={letra} style={ depto ? celdaActiva : celdaVacia }>
                            { depto ? `${ Number(piso) === 1 ? "PB" : String(Number(piso) - 1) }${letra}` : "—" }
                          </td>
                        );
                      } ) }
                    </tr>
                  ) ) }
                </tbody>
              </table>
            </div>
          </div>
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
  display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '14px',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: '#0f172a',
  border: '1px solid #334155', borderRadius: '8px', color: 'white',
  fontSize: '15px', boxSizing: 'border-box',
};
const thEncabezado: React.CSSProperties = {
  background: '#1e3a5f', color: '#93c5fd', padding: '8px 14px',
  borderRadius: '8px', fontSize: '13px', textAlign: 'center', fontWeight: 600,
};
const thEtiqueta: React.CSSProperties = {
  color: '#94a3b8', padding: '8px 12px', fontSize: '13px',
  textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap',
};
const celdaActiva: React.CSSProperties = {
  background: '#1e293b', color: '#e2e8f0', padding: '12px 18px',
  borderRadius: '10px', textAlign: 'center', fontSize: '14px',
  fontWeight: 600, minWidth: '60px',
};
const celdaVacia: React.CSSProperties = {
  background: '#0f172a', color: '#334155', padding: '12px 18px',
  borderRadius: '10px', textAlign: 'center', fontSize: '14px', minWidth: '60px',
};
