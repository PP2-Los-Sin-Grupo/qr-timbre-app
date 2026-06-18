import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormNotificacion } from './FormNotificacion';

type RouteState = {
  piso?: string;
  numero?: string;
  residente?: string;
};

const renderWithState = (state?: RouteState) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/FormNotificacion', state }]}>
      <Routes>
        <Route path="/FormNotificacion" element={<FormNotificacion />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('FormNotificacion', () => {
  it('muestra pantalla amigable de error si no hay state', () => {
    renderWithState();

    expect(screen.getByText(/ups, algo salio mal/i)).toBeTruthy();
    expect(screen.getByText(/no pudimos identificar el departamento/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /ir al inicio/i })).toBeTruthy();
  });

  it('muestra confirmacion con datos del residente cuando hay state valido', () => {
    renderWithState({
      piso: '2',
      numero: 'B',
      residente: 'Ana Perez',
    });

    expect(screen.getByText(/aviso enviado/i)).toBeTruthy();
    expect(screen.getByText(/piso 2 - depto b/i)).toBeTruthy();
    expect(screen.getByText(/ana perez/i)).toBeTruthy();
  });
});
