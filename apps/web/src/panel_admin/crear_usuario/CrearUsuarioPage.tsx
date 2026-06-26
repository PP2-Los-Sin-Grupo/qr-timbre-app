import "./styles.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuarios } from "../contexto/UsuariosContexto";
import { Button } from "@mui/material";

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

  /* Cargar departamentos desde localStorage al montar */
  useEffect( () => {
    const guardados = localStorage.getItem( 'departamentos' );
    if ( guardados ) {
      const deptos: DeptoStorage[] = JSON.parse( guardados );
      setTodosDeptos( deptos );
      const pisos = [ ...new Set( deptos.map( d => d.piso ) ) ]
        .sort( ( a, b ) => Number( a ) - Number( b ) );
      setPisosDisponibles( pisos );
    }
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

  const crearUsuario = () => {
    if ( !nombreCompleto || !email || !pisoSeleccionado || !deptoSeleccionado ) {
      setErrorMsg( "Completá todos los campos" );
      return;
    }
    const ok = agregarUsuario({
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
        <button className="boton-volver" onClick={ () => navigate( "/gestion-usuarios" ) }>← Volver</button>
      </div>

      <input placeholder="Nombre completo" value={nombreCompleto}
        onChange={ e => setNombreCompleto( capitalizarNombre( e.target.value ) ) } />

      <input placeholder="Email" value={email}
        onChange={ e => setEmail( e.target.value ) } />

      { pisosDisponibles.length === 0 ? (
        <p style={{ color: '#f87171', fontSize: '14px' }}>
          ⚠️ No hay departamentos generados. Generá los departamentos primero desde el Dashboard.
        </p>
      ) : (
        <>
          <select value={pisoSeleccionado} onChange={ e => setPisoSeleccionado( e.target.value ) } className="select-campo">
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
            className="select-campo"
          >
            <option value="">— Seleccioná un departamento —</option>
            { deptosDisponibles.map( letra => (
              <option key={letra} value={letra}>Depto {letra}</option>
            ) ) }
          </select>
        </>
      ) }

      { errorMsg && <p style={{ color: '#f87171', fontSize: '14px' }}>{errorMsg}</p> }

      <Button variant="contained" color="primary" onClick={crearUsuario}>
        Crear y enviar credenciales
      </Button>

    </div>
  );
}
