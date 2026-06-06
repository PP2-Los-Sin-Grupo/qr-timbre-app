/* Hook personalizado: carga los departamentos desde Firestore y maneja
   la seleccion de piso y numero para el formulario de visita */

import { useEffect, useState } from 'react';
import InicioApi from "../api/InicioApi";
import type { IDepto } from '../interface/Inicio.interface';


export const useDepartamentos = () => {
  const [ depto, setDepto ] = useState<Array<IDepto> | null>( null );
  const [ piso, setPiso ] = useState<Array<string> | null>( null );
  const [ loading, setLoading ] = useState<boolean>( false );
  const [ numerosPiso, setNumerosPiso ] = useState<Array<string> | null>( null );
  const [ pisoNroSeleccionado, setPisoNroSeleccionado ] = useState<{
    piso: string;
    numero?: string;
  } | null>( null );

  const getDepartamentos = async () => {
    setLoading( true );
    try {
      const resDeptos = await InicioApi.obtenerDepartamentos();
      if ( resDeptos.estado === 'success' ) {
        setDepto( resDeptos.data ?? null );
        const pisos = [ ...new Set( resDeptos.data?.map( d => d.piso ) ) ];
        setPiso( pisos.length > 0 ? pisos : null );
      }
    }
    catch {
      console.log( "Ocurrio un error" );
    }
    finally {
      setLoading( false );
    }
  };

  /* Al cambiar el piso, filtra los numeros disponibles para ese piso */
  const handleChangePiso = ( pisoSelec: string | unknown ) => {
    if ( typeof pisoSelec === 'string' ) {
      const numerosPorPiso = depto
        ?.filter( d => d.piso === pisoSelec )
        .map( d => d.numero ) ?? [];
      setPisoNroSeleccionado( { ...pisoNroSeleccionado, piso: pisoSelec } );
      setNumerosPiso( numerosPorPiso.length > 0 ? numerosPorPiso : null );
    }
  };

  /* Guarda el numero seleccionado */
  const handleChangeNumero = ( numeroSelec: string | unknown ) => {
    if ( typeof numeroSelec === 'string' && pisoNroSeleccionado?.piso ) {
      setPisoNroSeleccionado( { ...pisoNroSeleccionado, numero: numeroSelec } );
    }
  };

  /* Al montar el componente, carga los departamentos desde Firestore */
  useEffect( () => {
    async function fetchData() {
      setLoading( true );
      try {
        const resDeptos = await InicioApi.obtenerDepartamentos();
        if ( resDeptos.estado === 'success' ) {
          setDepto( resDeptos.data ?? null );
          const pisos = [ ...new Set( resDeptos.data?.map( d => d.piso ) ) ];
          setPiso( pisos.length > 0 ? pisos : null );
        }
      }
      catch {
        console.log( "Ocurrio un error" );
      }
      finally {
        setLoading( false );
      }
    }
    fetchData();
  }, [] );

  return {
    depto,
    piso,
    numerosPiso,
    loading,
    pisoNroSeleccionado,
    //Funciones
    getDepartamentos,
    handleChangePiso,
    handleChangeNumero
  };

};