import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import type { IDepto } from '../interface/Inicio.interface';

async function obtenerDepartamentos() {
  try {
    const querySnapshot = await getDocs(
      collection( db, "departamentos" )
    );

    const departamentos: IDepto[] = querySnapshot.docs.map( doc => ( {
      id: doc.id,
      ...doc.data()
    } as IDepto ) );
    if ( Array.isArray( departamentos ) ) {
      return {
        estado: departamentos.length > 0 ? 'success' : 'info',
        mensaje: departamentos.length > 0 ? 'Consulta de departamentos correcta' : 'No hay departamentos habilitados',
        data: departamentos,
      };
    }
    else {
      return {
        estado: 'error',
        mensaje: 'Ocurrio un error al obtener los departamentos'
      };
    }
  }
  catch ( e ) {
    return {
      estado: 'error',
      mensaje: 'Ocurrio un error inesperado'
    };
  }
}

const fn = {
  obtenerDepartamentos
};

export default fn;