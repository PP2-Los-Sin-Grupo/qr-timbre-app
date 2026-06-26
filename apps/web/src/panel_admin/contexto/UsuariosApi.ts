/* API de usuarios del panel de administracion.
   Lee y escribe en la coleccion "usuarios" de Firestore (la misma que usa el login
   y la app movil). Mapea el esquema de Firestore (nombre/apellido/departamentoId)
   al que usa el panel (nombreCompleto/piso/departamento), resolviendo el
   departamento contra la coleccion "departamentos". */

import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where,
} from "firebase/firestore";
import { db } from "../../firebase/config";

export interface Usuario {
  id: string;
  nombreCompleto: string;
  email: string;
  piso: string;
  departamento: string;
}

interface DeptoInfo {
  piso: string;
  numero: string;
}

/* Contraseña temporal para usuarios creados desde el panel.
   El residente la cambia luego desde la app movil. */
const PASSWORD_TEMPORAL = "portero123";

/* Hashea la contraseña con SHA-256 usando el email como salt.
   Mismo algoritmo que el login y la app movil para que los hashes coincidan. */
async function hashPassword( email: string, password: string ): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode( password + email.toLowerCase() );
  const hashBuffer = await crypto.subtle.digest( "SHA-256", data );
  return Array.from( new Uint8Array( hashBuffer ) )
    .map( b => b.toString( 16 ).padStart( 2, "0" ) )
    .join( "" );
}

/* Devuelve un mapa departamentoId -> { piso, numero } leyendo "departamentos". */
async function mapaDepartamentos(): Promise<Record<string, DeptoInfo>> {
  const snap = await getDocs( collection( db, "departamentos" ) );
  const mapa: Record<string, DeptoInfo> = {};
  snap.docs.forEach( d => {
    const data = d.data();
    mapa[ d.id ] = { piso: data[ "piso" ] ?? "", numero: data[ "numero" ] ?? "" };
  } );
  return mapa;
}

/* Busca el id del departamento que coincide con piso+numero. "" si no existe. */
async function buscarDepartamentoId( piso: string, numero: string ): Promise<string> {
  const q = query(
    collection( db, "departamentos" ),
    where( "piso", "==", piso ),
    where( "numero", "==", numero ),
  );
  const snap = await getDocs( q );
  return snap.empty ? "" : snap.docs[ 0 ].id;
}

/* Separa "Juan Carlos Perez" en nombre ("Juan") y apellido ("Carlos Perez"). */
function partirNombre( nombreCompleto: string ): { nombre: string; apellido: string } {
  const partes = nombreCompleto.trim().split( /\s+/ );
  const nombre = partes.shift() ?? "";
  return { nombre, apellido: partes.join( " " ) };
}

async function obtenerUsuarios() {
  try {
    const [ usuariosSnap, deptos ] = await Promise.all( [
      getDocs( collection( db, "usuarios" ) ),
      mapaDepartamentos(),
    ] );

    const data: Usuario[] = usuariosSnap.docs.map( d => {
      const u = d.data();
      const depto = deptos[ u[ "departamentoId" ] ] ?? { piso: "", numero: "" };
      return {
        id: d.id,
        nombreCompleto: `${ u[ "nombre" ] ?? "" } ${ u[ "apellido" ] ?? "" }`.trim(),
        email: u[ "email" ] ?? "",
        piso: depto.piso,
        departamento: depto.numero,
      };
    } );

    return { estado: "success", mensaje: "Usuarios obtenidos", data };
  } catch {
    return { estado: "error", mensaje: "Error al obtener usuarios", data: [] as Usuario[] };
  }
}

async function crearUsuario( datos: Omit<Usuario, "id"> ) {
  try {
    const email = datos.email.trim().toLowerCase();
    const departamentoId = await buscarDepartamentoId( datos.piso, datos.departamento );
    const { nombre, apellido } = partirNombre( datos.nombreCompleto );
    const password = await hashPassword( email, PASSWORD_TEMPORAL );

    const ref = await addDoc( collection( db, "usuarios" ), {
      email,
      password,
      nombre,
      apellido,
      rol: "Residente",
      departamentoId,
      telegramChatId: "",
    } );

    const nuevo: Usuario = { id: ref.id, ...datos };
    return { estado: "success", mensaje: "Usuario creado", data: nuevo };
  } catch {
    return { estado: "error", mensaje: "Error al crear el usuario" };
  }
}

async function eliminarUsuario( id: string ) {
  try {
    await deleteDoc( doc( db, "usuarios", id ) );
    return { estado: "success", mensaje: "Usuario eliminado" };
  } catch {
    return { estado: "error", mensaje: "Error al eliminar el usuario" };
  }
}

async function editarUsuario( id: string, datos: Omit<Usuario, "id"> ) {
  try {
    const departamentoId = await buscarDepartamentoId( datos.piso, datos.departamento );
    const { nombre, apellido } = partirNombre( datos.nombreCompleto );

    await updateDoc( doc( db, "usuarios", id ), {
      email: datos.email.trim().toLowerCase(),
      nombre,
      apellido,
      departamentoId,
    } );

    return { estado: "success", mensaje: "Usuario actualizado" };
  } catch {
    return { estado: "error", mensaje: "Error al editar el usuario" };
  }
}

const UsuariosApi = { obtenerUsuarios, crearUsuario, eliminarUsuario, editarUsuario };
export default UsuariosApi;
