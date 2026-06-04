
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Inicio } from './pages/Inicio/Inicio';
import { FormNotificacion } from './pages/FormNotificacion/FormNotificacion';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Inicio /> } />
        <Route path="/Inicio" element={ <Inicio /> } />
        <Route path="/FormNotificacion" element={ <FormNotificacion /> } />
      </Routes>
    </BrowserRouter>
  );
};
