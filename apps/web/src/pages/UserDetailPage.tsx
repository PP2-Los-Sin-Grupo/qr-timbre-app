import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface UserData {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  chat_id_telegram: number | null;
  rol: string;
  created_at: string;
  depto_numero?: string;
  depto_piso?: string;
}

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

export const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [user, setUser] = useState<UserData | null>(null);
  const [chatId, setChatId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!token || !id) return;
    fetch(`${API_URL}/api/usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("Error al cargar usuario");
        const data = await r.json();
        setUser(data);
        setChatId(data.chat_id_telegram ? String(data.chat_id_telegram) : "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, id]);

  const handleSave = async () => {
    if (!user || !token) return;
    setError("");
    setSuccess("");

    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) {
        setError("La nueva contraseña debe tener al menos 6 caracteres");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Las contraseñas nuevas no coinciden");
        return;
      }
    }

    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        chat_id_telegram: chatId ? Number(chatId) : null,
      };
      if (newPassword) {
        body.password = newPassword;
      }
      const res = await fetch(`${API_URL}/api/usuarios/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setSuccess("✅ Cambios guardados correctamente");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={{ color: "#6e6e8a", textAlign: "center", paddingTop: "40px" }}>Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <p style={{ color: "#ef4444", textAlign: "center", paddingTop: "40px" }}>Usuario no encontrado</p>
      </div>
    );
  }

  const telegramConnected = !!user.chat_id_telegram;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/gestion-usuarios")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={styles.title}>EDITAR USUARIO</h1>
      </div>

      <div style={styles.card}>
        <div style={styles.field}>
          <label style={styles.label}>Nombre</label>
          <div style={styles.value}>{user.nombre}</div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <div style={styles.value}>{user.email}</div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Rol</label>
          <div style={styles.badge}>{user.rol}</div>
        </div>

        {user.depto_numero && (
          <div style={styles.field}>
            <label style={styles.label}>Departamento</label>
            <div style={styles.value}>Piso {user.depto_piso} · Depto {user.depto_numero}</div>
          </div>
        )}

        <div style={styles.field}>
          <label style={styles.label}>Estado Telegram</label>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: telegramConnected ? "#22c55e" : "#f59e0b",
              }}
            />
            <span style={{ color: "#a0a0b8", fontSize: "14px" }}>
              {telegramConnected ? `Conectado (ID: ${user.chat_id_telegram})` : "Pendiente"}
            </span>
          </div>
        </div>

        <div style={{ ...styles.field, marginTop: "8px" }}>
          <label style={styles.label}>ID de Telegram</label>
          <div style={styles.inputCard}>
            <input
              style={styles.input}
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="Ej: 123456789"
            />
          </div>
          <p style={{ color: "#6e6e8a", fontSize: "12px", marginTop: "4px" }}>
            El propietario obtiene este número enviando /start al bot de Telegram
          </p>
        </div>

        <div style={styles.divider} />

        <div style={styles.field}>
          <label style={styles.label}>Cambiar contraseña (opcional)</label>
        </div>

        <div style={styles.field}>
          <label style={{ color: "#a0a0b8", fontSize: "12px" }}>Nueva contraseña</label>
          <div style={styles.inputCard}>
            <input
              style={styles.input}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={{ color: "#a0a0b8", fontSize: "12px" }}>Confirmar nueva contraseña</label>
          <div style={styles.inputCard}>
            <input
              style={styles.input}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repetí la nueva contraseña"
            />
          </div>
        </div>

        <div style={styles.divider} />

        {error && <div style={styles.errorMsg}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        <button
          style={styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#12121f",
    padding: "24px 20px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    paddingTop: "16px",
  },
  backBtn: {
    background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))",
    border: "1px solid rgba(99,102,241,0.2)",
    padding: "10px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#93c5fd",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#f0f0f5",
    letterSpacing: "1.5px",
    margin: 0,
  },
  card: {
    backgroundColor: "#22223f",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "24px",
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
  value: {
    color: "#f0f0f5",
    fontSize: "15px",
  },
  badge: {
    backgroundColor: "rgba(99,102,241,0.15)",
    color: "#6366f1",
    padding: "4px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
    width: "fit-content",
    textTransform: "capitalize" as const,
  },
  inputCard: {
    backgroundColor: "#1a1a2e",
    border: "1px solid rgba(255,255,255,0.06)",
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
  errorMsg: {
    backgroundColor: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "10px",
    padding: "12px",
    color: "#ef4444",
    fontSize: "14px",
    textAlign: "center" as const,
  },
  successMsg: {
    backgroundColor: "rgba(34,197,94,0.1)",
    border: "1px solid rgba(34,197,94,0.2)",
    borderRadius: "10px",
    padding: "12px",
    color: "#22c55e",
    fontSize: "14px",
    textAlign: "center" as const,
  },
  divider: {
    height: "1px",
    backgroundColor: "rgba(255,255,255,0.06)",
    margin: "4px 0",
  },
  saveBtn: {
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
};
