import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import UsuariosApi from "./UsuariosApi";
import type { Usuario } from "./UsuariosApi";

export type { Usuario };

interface ContextoUsuariosType {
  usuarios: Usuario[];
  agregarUsuario: ( datos: Omit<Usuario, 'id'> ) => boolean;
  eliminarUsuario: ( id: string ) => void;
  editarUsuario: ( id: string, datos: Omit<Usuario, 'id'> ) => void;
}

const ContextoUsuarios = createContext<ContextoUsuariosType | null>( null );

export const ProveedorUsuarios = ({ children }: { children: ReactNode }) => {
  const [ usuarios, setUsuarios ] = useState<Usuario[]>( [] );

  useEffect( () => {
    const res = UsuariosApi.obtenerUsuarios();
    if ( res.estado === 'success' ) setUsuarios( res.data );
  }, [] );

  const agregarUsuario = ( datos: Omit<Usuario, 'id'> ): boolean => {
    const res = UsuariosApi.crearUsuario( datos );
    if ( res.estado === 'success' && res.data ) {
      setUsuarios( prev => [ ...prev, res.data as Usuario ] );
      return true;
    }
    return false;
  };

  const eliminarUsuario = ( id: string ) => {
    UsuariosApi.eliminarUsuario( id );
    setUsuarios( prev => prev.filter( u => u.id !== id ) );
  };

  const editarUsuario = ( id: string, datos: Omit<Usuario, 'id'> ) => {
    UsuariosApi.editarUsuario( id, datos );
    setUsuarios( prev => prev.map( u => u.id === id ? { id, ...datos } : u ) );
  };

  return (
    <ContextoUsuarios.Provider value={{ usuarios, agregarUsuario, eliminarUsuario, editarUsuario }}>
      {children}
    </ContextoUsuarios.Provider>
  );
};

export const useUsuarios = () => {
  const contexto = useContext( ContextoUsuarios );
  if ( !contexto ) throw new Error( 'useUsuarios debe estar dentro del proveedor' );
  return contexto;
};
