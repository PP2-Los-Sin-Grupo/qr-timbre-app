import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";


export interface Usuario {
  id: number;
  nombreCompleto: string;
  email: string;
  piso: string;
  departamento: string;
}

interface ContextoUsuariosType {
  usuarios: Usuario[];
  agregarUsuario: (usuario: Usuario) => void;
}

const ContextoUsuarios = createContext<ContextoUsuariosType | null>(null);

export const ProveedorUsuarios = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const agregarUsuario = (usuario: Usuario) => {
    setUsuarios((anterior) => [...anterior, usuario]);
  };

  return (
    <ContextoUsuarios.Provider
      value={{
        usuarios,
        agregarUsuario,
      }}
    >
      {children}
    </ContextoUsuarios.Provider>
  );
};

export const useUsuarios = () => {
  const contexto = useContext(ContextoUsuarios);

  if (!contexto) {
    throw new Error("useUsuarios debe estar dentro del proveedor");
  }

  return contexto;
};
