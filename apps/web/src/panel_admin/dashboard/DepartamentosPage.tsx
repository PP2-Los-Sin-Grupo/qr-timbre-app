import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

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

        {/* Agregar un departamento */}
        <div style={ { background: '#1e293b', borderRadius: '16px', padding: '30px', width: '300px', flexShrink: 0 } }>
          <h2 style={ { marginTop: 0, marginBottom: '20px', fontSize: '18px' } }>Agregar un departamento</h2>

          <label style={ labelStyle }>Piso</label>
          <select value={nuevoPiso}
            onChange={ e => setNuevoPiso( e.target.value ) }
            style={ inputStyle }>
            <option value="">— Seleccioná un piso —</option>
            { Array.from( { length: 20 }, ( _, i ) => i + 1 ).map( n => (
              <option key={n} value={String( n )}>{ NOMBRES_PISO[ n ] ?? `Piso ${n}` }</option>
            ) ) }
          </select>

          <label style={ { ...labelStyle, marginTop: '16px' } }>Departamento (letra)</label>
          <input type="text" value={nuevoNumero}
            onChange={ e => setNuevoNumero( e.target.value ) }
            placeholder="Ej: A" style={ inputStyle } />

          <p style={ { color: '#64748b', fontSize: '13px', margin: '14px 0 0' } }>
            Se guarda con <strong>activo: true</strong> por defecto.
          </p>

          { mensaje && (
            <p style={ { color: estado === 'exito' ? '#4ade80' : '#f87171', fontSize: '14px', margin: '12px 0 0' } }>
              {mensaje}
            </p>
          ) }

          <button
            onClick={ agregarUno }
            disabled={ !nuevoPiso || !nuevoNumero }
            style={ {
              marginTop: '20px', width: '100%', padding: '12px',
              background: ( !nuevoPiso || !nuevoNumero ) ? '#334155' : '#3b82f6',
              color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px',
              cursor: ( !nuevoPiso || !nuevoNumero ) ? 'not-allowed' : 'pointer',
            } }
          >
            Agregar departamento
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
