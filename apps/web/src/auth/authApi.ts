/* Autenticacion del panel de administracion web.
   Reutiliza la coleccion "usuarios" de Firestore (la misma que la app movil).
   Solo permite el acceso a usuarios con rol "admin". */

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export interface SesionUsuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  departamentoId: string;
}

const SESSION_KEY = "usuario_session";

/* Hashea la contraseña con SHA-256 usando el email como salt.
   Mismo algoritmo que la app movil para que los hashes coincidan. */
async function hashPassword(email: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + email.toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* Inicia sesion validando email+password. Solo deja pasar a administradores.
   Lanza: "invalid-credentials" | "not-admin" */
export async function login(email: string, password: string): Promise<SesionUsuario> {
  const normalizedEmail = email.trim().toLowerCase();
  const hashed = await hashPassword(normalizedEmail, password);

  const ref = collection(db, "usuarios");
  const q = query(ref, where("email", "==", normalizedEmail));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("invalid-credentials");
  }

  const docSnap = snapshot.docs[0];
  const data = docSnap.data();
  const stored = data["password"];

  /* Acepta tanto contraseñas hasheadas como en texto plano (usuarios cargados manualmente) */
  const matches = stored === hashed || stored === password;
  if (!matches) {
    throw new Error("invalid-credentials");
  }

  if (data["rol"] !== "admin") {
    throw new Error("not-admin");
  }

  const sesion: SesionUsuario = {
    id: docSnap.id,
    nombre: data["nombre"],
    apellido: data["apellido"],
    email: data["email"],
    rol: data["rol"],
    departamentoId: data["departamentoId"],
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
  return sesion;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSesion(): SesionUsuario | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function esAdmin(): boolean {
  return getSesion()?.rol === "admin";
}
