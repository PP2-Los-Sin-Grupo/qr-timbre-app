import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const rol = await login(email, password);
      navigate(rol === "admin" ? "/dashboard" : "/perfil");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="8" height="8" rx="1" stroke="#6366f1" strokeWidth="2" />
            <rect x="14" y="2" width="8" height="8" rx="1" stroke="#6366f1" strokeWidth="2" />
            <rect x="2" y="14" width="8" height="8" rx="1" stroke="#6366f1" strokeWidth="2" />
            <rect x="14" y="14" width="8" height="8" rx="1" stroke="#6366f1" strokeWidth="2" />
          </svg>
        </div>
        <h1 style={styles.title}>Iniciar sesión</h1>
        <p style={styles.subtitle}>Ingresá a tu cuenta de TimbreQR</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputCard}>
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <div style={styles.inputCard}>
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p style={styles.footer}>
          ¿No tenés cuenta?{" "}
          <Link to="/registro" style={styles.link}>Registrate</Link>
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#12121f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: "#22223f",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "16px",
    padding: "32px 24px",
    width: "100%",
    maxWidth: "400px",
  },
  logo: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#f0f0f5",
    textAlign: "center",
    marginBottom: "6px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6e6e8a",
    textAlign: "center",
    marginBottom: "24px",
  },
  error: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    borderRadius: "10px",
    padding: "12px",
    color: "#ef4444",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "16px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    color: "#a0a0b8",
    fontSize: "13px",
    fontWeight: "500",
  },
  inputCard: {
    backgroundColor: "#1a1a2e",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "10px",
    padding: "14px",
  },
  input: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#f0f0f5",
    fontSize: "15px",
    width: "100%",
  },
  button: {
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "16px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "8px",
  },
  footer: {
    textAlign: "center",
    color: "#6e6e8a",
    fontSize: "14px",
    marginTop: "20px",
  },
  link: {
    color: "#6366f1",
    fontWeight: "600",
  },
};
