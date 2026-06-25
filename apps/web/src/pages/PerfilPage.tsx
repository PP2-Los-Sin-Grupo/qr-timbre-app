import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PerfilData {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  chat_id_telegram: number | null;
  rol: string;
  edificio_id: number;
  edificio_nombre?: string;
  depto_numero?: string;
  depto_piso?: string;
}

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

export const PerfilPage = () => {
  const { user, token, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<PerfilData | null>(null);
  const [chatId, setChatId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [telegramInput, setTelegramInput] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingTelegram, setSavingTelegram] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [telegramError, setTelegramError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!token || !user) return;
    fetch(`${API_URL}/api/usuarios/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("Error al cargar perfil");
        const d = await r.json();
        setData(d);
        setChatId(d.chat_id_telegram ? String(d.chat_id_telegram) : "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, user]);

  const openTelegramModal = () => {
    setTelegramInput(data?.chat_id_telegram ? String(data.chat_id_telegram) : "");
    setTelegramError("");
    setShowTelegramModal(true);
  };

  const handleSaveTelegram = async () => {
    if (!data || !token) return;
    setTelegramError("");
    setSavingTelegram(true);
    try {
      const res = await fetch(`${API_URL}/api/usuarios/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chat_id_telegram: telegramInput ? Number(telegramInput) : null,
        }),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setChatId(telegramInput);
      setData({ ...data, chat_id_telegram: telegramInput ? Number(telegramInput) : null });
      setSuccess("✅ ID de Telegram actualizado");
      setShowTelegramModal(false);
    } catch (err: any) {
      setTelegramError(err.message);
    } finally {
      setSavingTelegram(false);
    }
  };

  const openPasswordModal = () => {
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setShowPasswordModal(true);
  };

  const handleSavePassword = async () => {
    if (!data || !token) return;
    setPasswordError("");

    if (!newPassword || !confirmPassword) {
      setPasswordError("Completá todos los campos");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch(`${API_URL}/api/usuarios/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) throw new Error("Error al cambiar contraseña");
      setSuccess("✅ Contraseña cambiada correctamente");
      setShowPasswordModal(false);
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOverlayClick = (e: React.MouseEvent, closeFn: () => void) => {
    if (e.target === e.currentTarget) closeFn();
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={{ color: "#6e6e8a", textAlign: "center", paddingTop: "40px" }}>Cargando...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={styles.container}>
        <p style={{ color: "#ef4444", textAlign: "center", paddingTop: "40px" }}>Error al cargar perfil</p>
      </div>
    );
  }

  const telegramConnected = !!data.chat_id_telegram;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="2"/>
          </svg>
        </div>
        <div style={styles.headerText}>
          <span style={styles.title}>{data.nombre}</span>
          <span style={styles.roleBadge}>{data.rol}</span>
        </div>
      </div>

      {isAdmin && (
        <button style={styles.adminBtn} onClick={() => navigate("/dashboard")}>
          Ir al panel de administración
        </button>
      )}

      <div style={styles.card}>
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <div style={styles.value}>{data.email}</div>
        </div>

        {data.edificio_nombre && (
          <div style={styles.field}>
            <label style={styles.label}>Edificio</label>
            <div style={styles.value}>{data.edificio_nombre}</div>
          </div>
        )}

        {data.depto_numero && (
          <div style={styles.field}>
            <label style={styles.label}>Departamento</label>
            <div style={styles.value}>Piso {data.depto_piso} · Depto {data.depto_numero}</div>
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
              {telegramConnected ? "Conectado" : "Pendiente"}
            </span>
          </div>
        </div>

        <div style={styles.divider} />

        <button style={styles.actionBtn} onClick={openTelegramModal}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21.5 2L2 11l5 2 12-7-8 8 3 9 8-19z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {telegramConnected ? "Actualizar Telegram" : "Conectar Telegram"}
        </button>

        <button style={styles.actionBtn} onClick={openPasswordModal}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Cambiar contraseña
        </button>

        <div style={styles.divider} />

        {error && <div style={styles.errorMsg}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}
      </div>

      <button style={styles.logoutBtn} onClick={handleLogout}>
        Cerrar sesión
      </button>

      {showTelegramModal && (
        <div style={styles.overlay} onClick={(e) => handleOverlayClick(e, () => setShowTelegramModal(false))}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Conectar Telegram</h3>
            <p style={{ color: "#a0a0b8", fontSize: "13px", marginBottom: "16px", lineHeight: 1.5 }}>
              Enviá <strong style={{ color: "#f0f0f5" }}>/start</strong> al bot{" "}
              <strong style={{ color: "#f0f0f5" }}>@QRNoti_bot</strong> y pegá acá el número que te dé.
            </p>
            <div style={styles.inputCard}>
              <input
                style={styles.input}
                type="text"
                value={telegramInput}
                onChange={(e) => setTelegramInput(e.target.value)}
                placeholder="Ej: 123456789"
              />
            </div>
            {telegramError && <div style={styles.errorMsg}>{telegramError}</div>}
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowTelegramModal(false)}>
                Cancelar
              </button>
              <button style={styles.okBtn} onClick={handleSaveTelegram} disabled={savingTelegram}>
                {savingTelegram ? "Guardando..." : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div style={styles.overlay} onClick={(e) => handleOverlayClick(e, () => setShowPasswordModal(false))}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Cambiar contraseña</h3>

            <div style={styles.field}>
              <label style={styles.modalLabel}>Nueva contraseña</label>
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
              <label style={styles.modalLabel}>Confirmar nueva contraseña</label>
              <div style={styles.inputCard}>
                <input
                  style={styles.input}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetí la nueva"
                />
              </div>
            </div>

            {passwordError && <div style={styles.errorMsg}>{passwordError}</div>}

            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowPasswordModal(false)}>
                Cancelar
              </button>
              <button style={styles.okBtn} onClick={handleSavePassword} disabled={savingPassword}>
                {savingPassword ? "Cambiando..." : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#12121f",
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "20px",
    paddingTop: "16px",
  },
  avatar: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)",
  },
  headerText: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#f0f0f5",
  },
  roleBadge: {
    backgroundColor: "rgba(99,102,241,0.15)",
    color: "#6366f1",
    padding: "2px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
    width: "fit-content",
    textTransform: "capitalize",
  },
  adminBtn: {
    backgroundColor: "rgba(245,158,11,0.1)",
    border: "1px solid rgba(245,158,11,0.2)",
    color: "#f59e0b",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "20px",
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
  divider: {
    height: "1px",
    backgroundColor: "rgba(255,255,255,0.06)",
    margin: "4px 0",
  },
  actionBtn: {
    backgroundColor: "rgba(99,102,241,0.1)",
    border: "1px solid rgba(99,102,241,0.2)",
    color: "#6366f1",
    padding: "14px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center",
  },
  errorMsg: {
    backgroundColor: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "10px",
    padding: "12px",
    color: "#ef4444",
    fontSize: "14px",
    textAlign: "center",
  },
  successMsg: {
    backgroundColor: "rgba(34,197,94,0.1)",
    border: "1px solid rgba(34,197,94,0.2)",
    borderRadius: "10px",
    padding: "12px",
    color: "#22c55e",
    fontSize: "14px",
    textAlign: "center",
  },
  logoutBtn: {
    backgroundColor: "transparent",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#ef4444",
    padding: "14px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "auto",
  },
  overlay: {
    position: "fixed",
    inset: "0",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "1000",
  },
  modal: {
    backgroundColor: "#22223f",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "24px",
    width: "90%",
    maxWidth: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  modalTitle: {
    color: "#f0f0f5",
    fontSize: "18px",
    fontWeight: "700",
    margin: "0",
  },
  modalLabel: {
    color: "#a0a0b8",
    fontSize: "12px",
    fontWeight: "500",
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
  modalActions: {
    display: "flex",
    gap: "10px",
    marginTop: "4px",
  },
  cancelBtn: {
    flex: "1",
    backgroundColor: "transparent",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#a0a0b8",
    padding: "14px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  okBtn: {
    flex: "1",
    backgroundColor: "#6366f1",
    border: "none",
    color: "white",
    padding: "14px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
};
