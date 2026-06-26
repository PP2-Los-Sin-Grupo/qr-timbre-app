import { useEffect, useState } from 'react';
import DashboardApi from './DashboardApi';
import type { IDashboardStats } from './Dashboard.interface';

export const useDashboard = () => {
  const [ stats, setStats ] = useState<IDashboardStats | null>( null );
  const [ loading, setLoading ] = useState<boolean>( true );
  const [ error, setError ] = useState<string | null>( null );

  const cargarEstadisticas = async () => {
    setLoading( true );
    setError( null );

    const res = await DashboardApi.obtenerEstadisticas();

    if ( res.estado === 'success' && res.data ) {
      setStats( res.data );
    } else {
      setError( res.mensaje );
    }

    setLoading( false );
  };

  useEffect( () => {
    cargarEstadisticas();
  }, [] );

  return { stats, loading, error, cargarEstadisticas };
};
