import { useState } from "react";

interface DepartamentoData {
  id: number;
  numero: string;
  piso: string;
}

interface EdificioData {
  id: number;
  nombre: string;
  direccion: string;
  qr_uuid: string;
  departamentos: DepartamentoData[];
}

interface SeleccionarDepartamentoPageProps {
  edificio: EdificioData;
  onLlamar: (depto: number) => void;
  onVolver: () => void;
}

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

export const SeleccionarDepartamentoPage = ({
  edificio,
  onLlamar,
  onVolver,
}: SeleccionarDepartamentoPageProps) => {
  const [deptoSeleccionado, setDeptoSeleccionado] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  const departamentos = edificio.departamentos;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onVolver}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 style={styles.title}>Seleccionar Departamento</h1>
      </div>

      <div style={styles.content}>
        <p style={styles.subtitle}>Tocá el número al que deseás llamar</p>

        <div style={styles.grid}>
          {departamentos.map((depto) => (
            <button
              key={depto.id}
              style={{
                ...styles.deptoButton,
                ...(deptoSeleccionado === depto.id ? styles.deptoButtonSelected : {}),
              }}
              onClick={() => setDeptoSeleccionado(depto.id)}
            >
              {depto.numero}
            </button>
          ))}
        </div>

        <button
          style={{
            ...styles.callButton,
            ...(deptoSeleccionado === null ? styles.callButtonDisabled : {}),
          }}
          disabled={deptoSeleccionado === null}
          onClick={async () => {
            if (!deptoSeleccionado) return;
            try {
              setSending(true);
              await fetch(`${API_URL}/api/visitas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ departamento_id: deptoSeleccionado }),
              });
            } catch (e) {
              console.error('Error al notificar:', e);
            } finally {
              setSending(false);
              onLlamar(deptoSeleccionado);
            }
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: "10px" }}>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {sending ? 'Enviando...' : 'Llamar'}
        </button>
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
  backBtn: {
    backgroundColor: "#22223f",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "12px",
    padding: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#a0a0b8",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#f0f0f5",
    margin: 0,
  },
  content: {
    flex: 1,
    padding: "0 20px 28px",
    display: "flex",
    flexDirection: "column",
  },
  subtitle: {
    color: "#a0a0b8",
    fontSize: "14px",
    marginBottom: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginBottom: "24px",
    maxWidth: "360px",
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  deptoButton: {
    aspectRatio: "1",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    backgroundColor: "#22223f",
    fontSize: "22px",
    fontWeight: "700",
    color: "#f0f0f5",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
    transition: "all 0.15s ease",
  },
  deptoButtonSelected: {
    borderColor: "#6366f1",
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    color: "#6366f1",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
  },
  callButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "360px",
    margin: "0 auto",
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "16px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.25)",
  },
  callButtonDisabled: {
    backgroundColor: "#3f3f5a",
    color: "#6e6e8a",
    cursor: "not-allowed",
    boxShadow: "none",
  },
};