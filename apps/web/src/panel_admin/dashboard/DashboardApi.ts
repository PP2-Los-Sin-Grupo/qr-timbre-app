import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebase/config';

/* Obtiene los contadores de departamentos y usuarios desde Firestore */
async function obtenerEstadisticas() {
  try {
    const [snapDepartamentos, snapUsuarios] = await Promise.all([
      getCountFromServer( collection( db, 'departamentos' ) ),
      getCountFromServer( collection( db, 'usuarios' ) ),
    ]);

    return {
      estado: 'success',
      mensaje: 'Estadísticas obtenidas correctamente',
      data: {
        totalDepartamentos: snapDepartamentos.data().count,
        totalUsuarios: snapUsuarios.data().count,
      },
    };
  } catch {
    return {
      estado: 'error',
      mensaje: 'Error al obtener las estadísticas',
    };
  }
}

const DashboardApi = { obtenerEstadisticas };

export default DashboardApi;
