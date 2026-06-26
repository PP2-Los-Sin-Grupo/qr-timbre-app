import "./styles.css";
import "../panel.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { useUsuarios } from "../contexto/UsuariosContexto";
import { db } from "../../firebase/config";

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

  /* Cargar los departamentos disponibles desde Firestore al montar */
  useEffect( () => {
    let activo = true;
    ( async () => {
      const snap = await getDocs( collection( db, 'departamentos' ) );
      if ( !activo ) return;
      const deptos: DeptoStorage[] = snap.docs
        .filter( d => d.data()[ 'activo' ] !== false )
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

  /* Cuando cambia el piso, actualizar las letras disponibles */
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
    <div className="contenedor-crear">

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>Nuevo Usuario</h1>
        <button className="panel-btn panel-btn-secundario" onClick={ () => navigate( "/gestion-usuarios" ) }>← Volver</button>
      </div>

      <input className="panel-input" placeholder="Nombre completo" value={nombreCompleto}
        onChange={ e => setNombreCompleto( capitalizarNombre( e.target.value ) ) } />

      <input className="panel-input" placeholder="Email" value={email}
        onChange={ e => setEmail( e.target.value ) } />

      { pisosDisponibles.length === 0 ? (
        <p style={{ color: '#f87171', fontSize: '14px' }}>
          ⚠️ No hay departamentos generados. Generá los departamentos primero desde el Dashboard.
        </p>
      ) : (
        <>
          <select value={pisoSeleccionado} onChange={ e => setPisoSeleccionado( e.target.value ) } className="panel-input">
            <option value="">— Seleccioná un piso —</option>
            { pisosDisponibles.map( piso => (
              <option key={piso} value={piso}>
                { NOMBRES_PISO[ Number( piso ) ] ?? `Piso ${piso}` }
              </option>
            ) ) }
          </select>

          <select
            value={deptoSeleccionado}
            onChange={ e => setDeptoSeleccionado( e.target.value ) }
            disabled={ !pisoSeleccionado }
            className="panel-input"
          >
            <option value="">— Seleccioná un departamento —</option>
            { deptosDisponibles.map( letra => (
              <option key={letra} value={letra}>Depto {letra}</option>
            ) ) }
          </select>
        </>
      ) }

      { errorMsg && <p style={{ color: '#f87171', fontSize: '14px' }}>{errorMsg}</p> }

      <button className="panel-btn panel-btn-primario panel-btn-bloque" onClick={crearUsuario}>
        Crear y enviar credenciales
      </button>

    </div>
  );
}
