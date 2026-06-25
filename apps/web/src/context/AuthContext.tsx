import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  edificio_id: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<string>;
  register: (data: {
    edificio_id: number;
    nombre: string;
    email: string;
    password: string;
    departamento_id?: number;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem("auth");
      }
    }
  }, []);

  const saveAuth = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("auth", JSON.stringify({ user, token }));
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al iniciar sesión");
    }
    const data = await res.json();
    saveAuth(
      { id: data.id, nombre: data.nombre, email: data.email, rol: data.rol, edificio_id: data.edificio_id },
      data.token
    );
    return data.rol;
  };

  const register = async (data: {
    edificio_id: number;
    nombre: string;
    email: string;
    password: string;
    departamento_id?: number;
  }) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al registrarse");
    }
    await res.json();
  };

  const logout = () => clearAuth();

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.rol === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
