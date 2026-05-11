import { useState } from "react";
import { VisitantePage } from "./pages/VisitantePage";
import { SeleccionarDepartamentoPage } from "./pages/SeleccionarDepartamentoPage";
import { LlamadaPage } from "./pages/LlamadaPage";

type Page = "inicio" | "seleccionar" | "llamada";

export const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>("inicio");
  const [deptoActual, setDeptoActual] = useState<number>(1);

  const handleEscanear = () => {
    setCurrentPage("seleccionar");
  };

  const handleLlamar = (depto: number) => {
    setDeptoActual(depto);
    setCurrentPage("llamada");
  };

  const handleVolver = () => {
    setCurrentPage("inicio");
  };

  const handleCancelar = () => {
    setCurrentPage("seleccionar");
  };

  return (
    <>
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
      {currentPage === "inicio" && (
        <VisitantePage onEscanear={handleEscanear} />
      )}
      {currentPage === "seleccionar" && (
        <SeleccionarDepartamentoPage
          onLlamar={handleLlamar}
          onVolver={handleVolver}
        />
      )}
      {currentPage === "llamada" && (
        <LlamadaPage depto={deptoActual} onCancelar={handleCancelar} />
      )}
    </>
  );
};