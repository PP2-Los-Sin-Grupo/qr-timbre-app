import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { VisitantePage } from "./pages/VisitantePage";
import { SeleccionarDepartamentoPage } from "./pages/SeleccionarDepartamentoPage";
import { LlamadaPage } from "./pages/LlamadaPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { UserDetailPage } from "./pages/UserDetailPage";
import { PerfilPage } from "./pages/PerfilPage";
import UserManagementPage from "./pages/UserManagementPage";
import NewUserPage from "./pages/NewUserPage";
import { DepartamentosPage } from "./pages/DepartamentosPage";

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

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

const VisitanteFlow = () => {
  const [step, setStep] = useState<"inicio" | "seleccionar" | "llamada">("inicio");
  const [edificio, setEdificio] = useState<EdificioData | null>(null);
  const [deptoActual, setDeptoActual] = useState<number>(1);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const uuid = searchParams.get("edificio");
    if (uuid) {
      fetch(`${API_URL}/api/edificios/qr/${encodeURIComponent(uuid)}`)
        .then((r) => r.json())
        .then((data) => {
          setEdificio(data);
          setStep("seleccionar");
        })
        .catch((err) => console.error("Error al cargar edificio:", err));
    }
  }, []);

  const handleEscanear = async (qrUuid: string) => {
    try {
      const res = await fetch(`${API_URL}/api/edificios/qr/${encodeURIComponent(qrUuid)}`);
      const data = await res.json();
      setEdificio(data);
      setStep("seleccionar");
    } catch (err) {
      console.error("Error al cargar edificio:", err);
    }
  };

  const handleLlamar = (depto: number) => {
    setDeptoActual(depto);
    setStep("llamada");
  };
  const handleVolver = () => setStep("inicio");
  const handleCancelar = () => setStep("seleccionar");

  if (step === "seleccionar") {
    return <SeleccionarDepartamentoPage edificio={edificio!} onLlamar={handleLlamar} onVolver={handleVolver} />;
  }
  if (step === "llamada") {
    return <LlamadaPage depto={deptoActual} onCancelar={handleCancelar} />;
  }
  return <VisitantePage onEscanear={handleEscanear} />;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/perfil" replace />;
  return <>{children}</>;
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <style>{`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #12121f;
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(1.8); opacity: 0; }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          button:active {
            transform: scale(0.98);
          }
        `}</style>
        <Routes>
          <Route path="/" element={<VisitanteFlow />} />
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <DashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/departamentos"
            element={
              <AdminRoute>
                <DepartamentosPage />
              </AdminRoute>
            }
          />
          <Route
            path="/gestion-usuarios"
            element={
              <AdminRoute>
                <UserManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/nuevo-usuario"
            element={
              <AdminRoute>
                <NewUserPage />
              </AdminRoute>
            }
          />
          <Route
            path="/usuarios/:id"
            element={
              <AdminRoute>
                <UserDetailPage />
              </AdminRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <PerfilPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
