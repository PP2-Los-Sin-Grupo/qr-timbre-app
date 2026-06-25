import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./DepartamentosPage.css";

interface Departamento {
  id: number;
  numero: string;
  piso: string;
  usuario_id: number | null;
  residente_nombre: string | null;
  residente_email: string | null;
  residente_telefono: string | null;
  residente_chat_id: number | null;
}

interface Edificio {
  id: number;
  nombre: string;
}

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

export const DepartamentosPage = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [edificio, setEdificio] = useState<Edificio | null>(null);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [selected, setSelected] = useState<Departamento | null>(null);

  useEffect(() => {
    if (!token || !user) return;

    const edificioId = user.edificio_id;

    fetch(`${API_URL}/api/edificios/${edificioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setEdificio(data))
      .catch(console.error);

    fetch(`${API_URL}/api/departamentos/edificio/${edificioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setDepartamentos(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, user]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setSelected(null);
  };

  if (loading) {
    return (
      <div className="deptos-page">
        <p className="deptos-loading">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="deptos-page">
      <div className="deptos-header">
        <button className="deptos-back-btn" onClick={() => navigate("/dashboard")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <h1 className="deptos-title">DEPARTAMENTOS</h1>
          {edificio && <p className="deptos-subtitle">{edificio.nombre}</p>}
        </div>
      </div>

      <div className="deptos-divider" />

      <div className="deptos-content">
        <div className="deptos-grid">
          {departamentos.map((depto) => (
            <button
              key={depto.id}
              className="deptos-card"
              onClick={() => setSelected(depto)}
            >
              <div className="deptos-card-title">
                Piso {depto.piso} · Depto {depto.numero}
              </div>
              {depto.residente_nombre ? (
                <div className="deptos-card-resident">
                  {depto.residente_nombre}
                </div>
              ) : (
                <div className="deptos-card-empty">Sin asignar</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="deptos-overlay" onClick={handleOverlayClick}>
          <div className="deptos-modal">
            <h2 className="deptos-modal-title">
              Piso {selected.piso} · Depto {selected.numero}
            </h2>

            {selected.residente_nombre ? (
              <>
                <div className="deptos-modal-field">
                  <span className="deptos-modal-label">Propietario</span>
                  <span className="deptos-modal-value">{selected.residente_nombre}</span>
                </div>
                <div className="deptos-modal-field">
                  <span className="deptos-modal-label">Email</span>
                  <span className="deptos-modal-value">{selected.residente_email}</span>
                </div>
                <div className="deptos-modal-field">
                  <span className="deptos-modal-label">Teléfono</span>
                  <span className="deptos-modal-value">{selected.residente_telefono || "—"}</span>
                </div>
                <div className="deptos-modal-field">
                  <span className="deptos-modal-label">Telegram</span>
                  <div className="deptos-modal-telegram">
                    <div
                      className="deptos-telegram-dot"
                      style={{
                        backgroundColor: selected.residente_chat_id ? "#22c55e" : "#f59e0b",
                      }}
                    />
                    <span className="deptos-telegram-text">
                      {selected.residente_chat_id ? "Conectado" : "Pendiente"}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p style={{ color: "#6e6e8a", fontSize: "14px" }}>
                Este departamento no tiene propietario asignado.
              </p>
            )}

            <button className="deptos-modal-close" onClick={() => setSelected(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
