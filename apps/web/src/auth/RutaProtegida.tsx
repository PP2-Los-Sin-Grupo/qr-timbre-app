import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { esAdmin } from "./authApi";

/* Protege rutas del panel: si no hay un admin con sesion iniciada,
   redirige a la pagina principal. */
export default function RutaProtegida({ children }: { children: ReactElement }) {
  if (!esAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
}
