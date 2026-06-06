/* API de Inicio: funciones que conectan con Firestore para obtener departamentos,
   buscar residentes y crear notificaciones de visita */

import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/config";
import type { IDepto } from '../interface/Inicio.interface';

/* Obtiene todos los departamentos desde Firestore */
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
  catch {
    return {
      estado: 'error',
      mensaje: 'Ocurrio un error inesperado'
    };
  }
}

/* Busca el residente cuyo departamentoId coincide con el id del depto (piso + numero) */
async function obtenerResidentePorDepto( piso: string, numero: string ) {
  try {
    // 1. Buscar el documento en "departamentos" que tenga ese piso y numero
    const deptoQuery = query(
      collection( db, "departamentos" ),
      where( "piso", "==", piso ),
      where( "numero", "==", numero )
    );
    const deptoSnapshot = await getDocs( deptoQuery );

    if ( deptoSnapshot.empty ) {
      return { estado: 'error', mensaje: 'No se encontró el departamento' };
    }

    const deptoDoc = deptoSnapshot.docs[ 0 ];
    const departamentoId = deptoDoc.id;

    // 2. Buscar en "usuarios" el residente con ese departamentoId
    const usuarioQuery = query(
      collection( db, "usuarios" ),
      where( "departamentoId", "==", departamentoId )
    );
    const usuarioSnapshot = await getDocs( usuarioQuery );

    if ( usuarioSnapshot.empty ) {
      return { estado: 'error', mensaje: 'No hay residente asignado a ese departamento' };
    }

    const usuarioDoc = usuarioSnapshot.docs[ 0 ];
    const usuarioData = usuarioDoc.data();

    return {
      estado: 'success',
      mensaje: 'Residente encontrado',
      data: {
        id: usuarioDoc.id,
        nombre: usuarioData[ 'nombre' ],
        apellido: usuarioData[ 'apellido' ],
        departamentoId: usuarioData[ 'departamentoId' ]
      }
    };
  }
  catch ( e ) {
    console.error( 'Error al obtener residente:', e );
    return { estado: 'error', mensaje: 'Ocurrio un error inesperado' };
  }
}

/* Crea una notificacion en Firestore para que la app mobile la procese */
async function crearNotificacion( residenteUid: string ) {
  try {
    const docRef = await addDoc( collection( db, "notificaciones" ), {
      residenteUid: residenteUid,
      estado: 'nueva',
      creadoEn: serverTimestamp(),
      visitante: { nombre: 'Visitante' }
    } );
    return {
      estado: 'success',
      mensaje: 'Notificacion enviada correctamente',
      data: { id: docRef.id }
    };
  }
  catch ( e ) {
    console.error( 'Error al crear notificacion:', e );
    return { estado: 'error', mensaje: 'Error al enviar la notificacion' };
  }
}

const fn = {
  obtenerDepartamentos,
  obtenerResidentePorDepto,
  crearNotificacion
};

export default fn;