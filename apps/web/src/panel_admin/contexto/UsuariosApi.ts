const STORAGE_KEY = 'usuarios';

export interface Usuario {
  id: string;
  nombreCompleto: string;
  email: string;
  piso: string;
  departamento: string;
}

function obtenerUsuarios() {
  try {
    const guardados = localStorage.getItem( STORAGE_KEY );
    const data: Usuario[] = guardados ? JSON.parse( guardados ) : [];
    return { estado: 'success', mensaje: 'Usuarios obtenidos', data };
  } catch {
    return { estado: 'error', mensaje: 'Error al obtener usuarios', data: [] as Usuario[] };
  }
}

function crearUsuario( datos: Omit<Usuario, 'id'> ) {
  try {
    const guardados = localStorage.getItem( STORAGE_KEY );
    const usuarios: Usuario[] = guardados ? JSON.parse( guardados ) : [];
    const nuevo: Usuario = { id: Date.now().toString(), ...datos };
    usuarios.push( nuevo );
    localStorage.setItem( STORAGE_KEY, JSON.stringify( usuarios ) );
    return { estado: 'success', mensaje: 'Usuario creado', data: nuevo };
  } catch {
    return { estado: 'error', mensaje: 'Error al crear el usuario' };
  }
}

function eliminarUsuario( id: string ) {
  try {
    const guardados = localStorage.getItem( STORAGE_KEY );
    const usuarios: Usuario[] = guardados ? JSON.parse( guardados ) : [];
    const filtrados = usuarios.filter( u => u.id !== id );
    localStorage.setItem( STORAGE_KEY, JSON.stringify( filtrados ) );
    return { estado: 'success', mensaje: 'Usuario eliminado' };
  } catch {
    return { estado: 'error', mensaje: 'Error al eliminar el usuario' };
  }
}

function editarUsuario( id: string, datos: Omit<Usuario, 'id'> ) {
  try {
    const guardados = localStorage.getItem( STORAGE_KEY );
    const usuarios: Usuario[] = guardados ? JSON.parse( guardados ) : [];
    const actualizados = usuarios.map( u => u.id === id ? { id, ...datos } : u );
    localStorage.setItem( STORAGE_KEY, JSON.stringify( actualizados ) );
    return { estado: 'success', mensaje: 'Usuario actualizado' };
  } catch {
    return { estado: 'error', mensaje: 'Error al editar el usuario' };
  }
}

const UsuariosApi = { obtenerUsuarios, crearUsuario, eliminarUsuario, editarUsuario };
export default UsuariosApi;
