import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { VisitantePage } from "./pages/VisitantePage";
import { SeleccionarDepartamentoPage } from "./pages/SeleccionarDepartamentoPage";
import { LlamadaPage } from "./pages/LlamadaPage";
import { DashboardPage } from "./pages/DashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import NewUserPage from "./pages/NewUserPage";

const VisitanteFlow = () => {
  const [step, setStep] = useState<"inicio" | "seleccionar" | "llamada">("inicio");
  const [deptoActual, setDeptoActual] = useState<number>(1);

  const handleEscanear = () => setStep("seleccionar");
  const handleLlamar = (depto: number) => {
    setDeptoActual(depto);
    setStep("llamada");
  };
  const handleVolver = () => setStep("inicio");
  const handleCancelar = () => setStep("seleccionar");

  if (step === "seleccionar") {
    return <SeleccionarDepartamentoPage onLlamar={handleLlamar} onVolver={handleVolver} />;
  }
  if (step === "llamada") {
    return <LlamadaPage depto={deptoActual} onCancelar={handleCancelar} />;
  }
  return <VisitantePage onEscanear={handleEscanear} />;
};

export const App = () => {
  return (
    <BrowserRouter>
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
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/gestion-usuarios" element={<UserManagementPage />} />
        <Route path="/nuevo-usuario" element={<NewUserPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
