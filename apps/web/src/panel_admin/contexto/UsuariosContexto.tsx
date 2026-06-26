import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import UsuariosApi from "./UsuariosApi";
import type { Usuario } from "./UsuariosApi";

export type { Usuario };

interface ContextoUsuariosType {
  usuarios: Usuario[];
  cargando: boolean;
  agregarUsuario: ( datos: Omit<Usuario, 'id'> ) => Promise<boolean>;
  eliminarUsuario: ( id: string ) => Promise<void>;
  editarUsuario: ( id: string, datos: Omit<Usuario, 'id'> ) => Promise<void>;
}

const ContextoUsuarios = createContext<ContextoUsuariosType | null>( null );

export const ProveedorUsuarios = ({ children }: { children: ReactNode }) => {
  const [ usuarios, setUsuarios ] = useState<Usuario[]>( [] );
  const [ cargando, setCargando ] = useState( true );

  useEffect( () => {
    let activo = true;
    UsuariosApi.obtenerUsuarios().then( res => {
      if ( !activo ) return;
      if ( res.estado === 'success' ) setUsuarios( res.data );
      setCargando( false );
    } );
    return () => { activo = false; };
  }, [] );

  const agregarUsuario = async ( datos: Omit<Usuario, 'id'> ): Promise<boolean> => {
    const res = await UsuariosApi.crearUsuario( datos );
    if ( res.estado === 'success' && res.data ) {
      setUsuarios( prev => [ ...prev, res.data as Usuario ] );
      return true;
    }
    return false;
  };

  const eliminarUsuario = async ( id: string ) => {
    const res = await UsuariosApi.eliminarUsuario( id );
    if ( res.estado === 'success' ) {
      setUsuarios( prev => prev.filter( u => u.id !== id ) );
    }
  };

  const editarUsuario = async ( id: string, datos: Omit<Usuario, 'id'> ) => {
    const res = await UsuariosApi.editarUsuario( id, datos );
    if ( res.estado === 'success' ) {
      setUsuarios( prev => prev.map( u => u.id === id ? { id, ...datos } : u ) );
    }
  };

  return (
    <ContextoUsuarios.Provider value={{ usuarios, cargando, agregarUsuario, eliminarUsuario, editarUsuario }}>
      {children}
    </ContextoUsuarios.Provider>
  );
};

export const useUsuarios = () => {
  const contexto = useContext( ContextoUsuarios );
  if ( !contexto ) throw new Error( 'useUsuarios debe estar dentro del proveedor' );
  return contexto;
};
