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
      let resDeptos = await InicioApi.obtenerDepartamentos();
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

  const handleChangePiso = ( pisoSelec: string | unknown ) => {
    if ( typeof pisoSelec === 'string' ) {
      const numerosPorPiso = depto
        ?.filter( d => d.piso === pisoSelec )
        .map( d => d.numero ) ?? [];
      setPisoNroSeleccionado( { ...pisoNroSeleccionado, piso: pisoSelec } );
      setNumerosPiso( numerosPorPiso.length > 0 ? numerosPorPiso : null );
    }
  };

  const handleChangeNumero = ( numeroSelec: string | unknown ) => {
    if ( typeof numeroSelec === 'string' && pisoNroSeleccionado?.piso ) {
      setPisoNroSeleccionado( { ...pisoNroSeleccionado, numero: numeroSelec } );
    }
  };

  useEffect( () => {
    getDepartamentos();
  }, [] );

  return {
    //Variables de estado
    depto,
    piso,
    numerosPiso,
    loading,
    //Funciones
    getDepartamentos,
    handleChangePiso,
    handleChangeNumero
  };

};