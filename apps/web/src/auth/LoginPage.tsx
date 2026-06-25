import "./styles.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "./authApi";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async () => {
    if (!email || !password) {
      setError("Completá email y contraseña.");
      return;
    }

    setCargando(true);
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (e) {
      const codigo = e instanceof Error ? e.message : "";
      if (codigo === "not-admin") {
        setError("Esta cuenta no tiene permisos de administrador.");
      } else if (codigo === "invalid-credentials") {
        setError("Email o contraseña incorrectos.");
      } else {
        setError("Error al iniciar sesión. Intentá de nuevo.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-content">
      <div className="login-bg-gradient" />

      <div className="login-container">
        <div className="login-header">
          <div className="login-icon-wrap">
            <svg viewBox="0 0 24 24" className="login-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <path d="M9 22v-4h6v4" />
              <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
            </svg>
          </div>
          <h1 className="login-title">Mi Edificio</h1>
          <p className="login-subtitle">Panel de administración</p>
        </div>

        <div className="login-glass">
          <div className="custom-input">
            <svg viewBox="0 0 24 24" className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 5L2 7" />
            </svg>
            <input
              type="email"
              className="input-field"
              placeholder="usuario@edificio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && iniciarSesion()}
            />
          </div>

          <div className="custom-input">
            <svg viewBox="0 0 24 24" className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type={verPassword ? "text" : "password"}
              className="input-field"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && iniciarSesion()}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setVerPassword((v) => !v)}
              aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {verPassword ? (
                <svg viewBox="0 0 24 24" className="toggle-password-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="toggle-password-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <button className="login-button" onClick={iniciarSesion} disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>

          {error && (
            <div className="error-msg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
