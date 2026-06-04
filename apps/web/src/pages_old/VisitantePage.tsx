import { useState } from "react";

interface VisitantePageProps {
  onEscanear: () => void;
}

export const VisitantePage = ({ onEscanear }: VisitantePageProps) => {
  const [showManualEntry, setShowManualEntry] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="2"/>
          </svg>
        </div>
        <div style={styles.headerText}>
          <span style={styles.greeting}>Bienvenido</span>
          <span style={styles.buildingName}>Edificio Principal</span>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.qrFrame}>
          <div style={styles.qrPlaceholder}>
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <rect x="10" y="10" width="22" height="22" stroke="#6366f1" strokeWidth="2" />
              <rect x="68" y="10" width="22" height="22" stroke="#6366f1" strokeWidth="2" />
              <rect x="10" y="68" width="22" height="22" stroke="#6366f1" strokeWidth="2" />
              <rect x="18" y="18" width="6" height="6" fill="#6366f1" />
              <rect x="74" y="18" width="6" height="6" fill="#6366f1" />
              <rect x="18" y="74" width="6" height="6" fill="#6366f1" />
              <rect x="38" y="38" width="24" height="24" stroke="#6366f1" strokeWidth="2" fill="none" />
              <rect x="44" y="44" width="12" height="12" fill="#6366f1" />
              <rect x="38" y="10" width="4" height="4" fill="#6366f1" />
              <rect x="50" y="10" width="4" height="4" fill="#6366f1" />
              <rect x="62" y="10" width="4" height="4" fill="#6366f1" />
              <rect x="38" y="18" width="4" height="4" fill="#6366f1" />
              <rect x="50" y="22" width="4" height="4" fill="#6366f1" />
              <rect x="68" y="38" width="4" height="4" fill="#6366f1" />
              <rect x="78" y="42" width="4" height="4" fill="#6366f1" />
              <rect x="38" y="68" width="4" height="4" fill="#6366f1" />
              <rect x="44" y="76" width="4" height="4" fill="#6366f1" />
              <rect x="56" y="72" width="4" height="4" fill="#6366f1" />
              <rect x="72" y="68" width="4" height="4" fill="#6366f1" />
              <rect x="10" y="38" width="4" height="4" fill="#6366f1" />
              <rect x="18" y="44" width="4" height="4" fill="#6366f1" />
            </svg>
          </div>
          <span style={styles.qrLabel}>Código QR del edificio</span>
        </div>

        <button style={styles.scanButton} onClick={onEscanear}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: "10px" }}>
            <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <rect x="7" y="7" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2" />
          </svg>
          Escanear código QR
        </button>

        <button style={styles.linkButton} onClick={() => setShowManualEntry(!showManualEntry)}>
          {showManualEntry ? "Cerrar" : "¿No tienes código QR?"}
        </button>

        {showManualEntry && (
          <div style={styles.manualEntry}>
            <input
              type="text"
              placeholder="Código del edificio"
              style={styles.input}
            />
            <button style={styles.submitButton}>Continuar</button>
          </div>
        )}

        <p style={styles.helpText}>
          Escanea el código QR para contactingte con un residente
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
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "24px 20px 16px",
  },
  avatar: {
    width: "44px",
    height: "44px",
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
  },
  greeting: {
    color: "#a0a0b8",
    fontSize: "13px",
    fontWeight: "500",
  },
  buildingName: {
    color: "#f0f0f5",
    fontSize: "15px",
    fontWeight: "700",
  },
  content: {
    flex: 1,
    padding: "0 20px 28px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  qrFrame: {
    backgroundColor: "#22223f",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "28px",
    width: "100%",
    maxWidth: "360px",
  },
  qrPlaceholder: {
    width: "160px",
    height: "160px",
    backgroundColor: "#1a1a2e",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
  },
  qrLabel: {
    display: "block",
    textAlign: "center",
    color: "#6e6e8a",
    fontSize: "13px",
  },
  scanButton: {
    width: "100%",
    maxWidth: "360px",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "16px 24px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(99, 102, 241, 0.35)",
    marginBottom: "16px",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#6366f1",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "8px",
    marginBottom: "20px",
  },
  manualEntry: {
    backgroundColor: "#22223f",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "14px",
    padding: "20px",
    width: "100%",
    maxWidth: "360px",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "14px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "10px",
    backgroundColor: "#1a1a2e",
    color: "#f0f0f5",
    fontSize: "15px",
    marginBottom: "12px",
    boxSizing: "border-box",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#8b5cf6",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "14px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  helpText: {
    fontSize: "13px",
    color: "#6e6e8a",
    textAlign: "center",
    marginTop: "auto",
    paddingTop: "20px",
  },
};