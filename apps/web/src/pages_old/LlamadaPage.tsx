interface LlamadaPageProps {
  depto: number;
  onCancelar: () => void;
}

export const LlamadaPage = ({ depto, onCancelar }: LlamadaPageProps) => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <div style={styles.iconCircle}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="#fff"/>
            </svg>
          </div>
          <div style={styles.pulseRing} />
        </div>

        <h1 style={styles.title}>¡Aviso enviado!</h1>
        <p style={styles.subtitle}>
          El residente del depto <strong style={styles.deptoHighlight}>{depto}</strong> fue notificado
        </p>

        <div style={styles.statusBadge}>
          <span style={styles.statusDot} />
          <span>Enviando notificación...</span>
        </div>

        <div style={styles.divider} />

        <div style={styles.successMessage}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: "8px" }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Esperá que abran la puerta</span>
        </div>
      </div>

      <button style={styles.backButton} onClick={onCancelar}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: "8px" }}>
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Volver
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#12121f",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: "#22223f",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "14px",
    padding: "32px 24px",
    width: "100%",
    maxWidth: "360px",
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
  },
  iconContainer: {
    position: "relative",
    width: "80px",
    height: "80px",
    margin: "0 auto 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  pulseRing: {
    position: "absolute",
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "rgba(34, 197, 94, 0.3)",
    animation: "pulse 2s ease-out infinite",
  },
  title: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#22c55e",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#a0a0b8",
    lineHeight: "1.5",
    marginBottom: "16px",
  },
  deptoHighlight: {
    color: "#6366f1",
    fontWeight: "700",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    color: "#f59e0b",
    fontWeight: "500",
    marginBottom: "16px",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#f59e0b",
    animation: "blink 1.5s ease-in-out infinite",
  },
  divider: {
    height: "1px",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    margin: "20px 0",
  },
  successMessage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    color: "#f0f0f5",
    fontWeight: "500",
  },
  backButton: {
    marginTop: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22223f",
    color: "#a0a0b8",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "10px",
    padding: "14px 28px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
  },
};