import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Building {
  id: number;
  nombre: string;
}

interface Department {
  id: number;
  numero: string;
  piso: string;
  usuario_id: number | null;
}

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [edificioId, setEdificioId] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/edificios/public`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Error del servidor");
        const data = await r.json();
        if (!Array.isArray(data)) throw new Error("Respuesta inválida");
        setBuildings(data);
        if (data.length > 0) setEdificioId(String(data[0].id));
      })
      .catch(() => setError("Error al cargar edificios"))
      .finally(() => setLoadingBuildings(false));
  }, []);

  useEffect(() => {
    if (!edificioId) {
      setDepartments([]);
      return;
    }
    fetch(`${API_URL}/api/departamentos/public/${edificioId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Error del servidor");
        const data = await r.json();
        if (!Array.isArray(data)) throw new Error("Respuesta inválida");
        setDepartments(data.filter((d: Department) => !d.usuario_id));
        setDepartamentoId("");
      })
      .catch(() => setError("Error al cargar departamentos"));
  }, [edificioId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!edificioId) {
      setError("Seleccioná un edificio");
      return;
    }
    if (!departamentoId) {
      setError("Seleccioná un departamento");
      return;
    }
    setSubmitting(true);
    try {
      await register({
        edificio_id: Number(edificioId),
        nombre,
        email,
        password,
        departamento_id: Number(departamentoId),
      });
      alert("¡Registro exitoso! Ahora iniciá sesión.");
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Crear cuenta</h1>
        <p style={styles.subtitle}>Registrate como propietario</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Nombre completo</label>
            <div style={styles.inputCard}>
              <input
                style={styles.input}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Juan García"
                required
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputCard}>
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@email.com"
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
                minLength={6}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Edificio</label>
            <div style={styles.inputCard}>
              <select
                style={styles.select}
                value={edificioId}
                onChange={(e) => setEdificioId(e.target.value)}
              >
                {loadingBuildings ? (
                  <option>Cargando...</option>
                ) : (
                  buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nombre}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Departamento</label>
            <div style={styles.inputCard}>
              <select
                style={styles.select}
                value={departamentoId}
                onChange={(e) => setDepartamentoId(e.target.value)}
              >
                <option value="">Seleccioná uno</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    Piso {d.piso} - Depto {d.numero}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" disabled={submitting} style={styles.button}>
            {submitting ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <p style={styles.footer}>
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" style={styles.link}>Iniciá sesión</Link>
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
    gap: "16px",
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
  select: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#f0f0f5",
    fontSize: "15px",
    width: "100%",
    cursor: "pointer",
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
