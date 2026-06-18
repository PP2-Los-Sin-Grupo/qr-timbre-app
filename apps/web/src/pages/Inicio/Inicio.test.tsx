import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Inicio } from './Inicio';
import InicioApi from './api/InicioApi';

const mockNavigate = vi.fn();
const mockUseDepartamentos = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('./hooks/useDepartamentos', () => ({
  useDepartamentos: () => mockUseDepartamentos(),
}));

vi.mock('./api/InicioApi', () => ({
  default: {
    obtenerDepartamentos: vi.fn(),
    obtenerResidentePorDepto: vi.fn(),
    crearNotificacion: vi.fn(),
  },
}));

describe('Inicio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra loading cuando el hook esta cargando', () => {
    mockUseDepartamentos.mockReturnValue({
      depto: null,
      piso: null,
      numerosPiso: null,
      loading: true,
      pisoNroSeleccionado: null,
      getDepartamentos: vi.fn(),
      handleChangePiso: vi.fn(),
      handleChangeNumero: vi.fn(),
    });

    render(<Inicio />);

    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('muestra boton para actualizar departamentos cuando no hay datos', async () => {
    const getDepartamentos = vi.fn();

    mockUseDepartamentos.mockReturnValue({
      depto: null,
      piso: null,
      numerosPiso: null,
      loading: false,
      pisoNroSeleccionado: null,
      getDepartamentos,
      handleChangePiso: vi.fn(),
      handleChangeNumero: vi.fn(),
    });

    const user = userEvent.setup();
    render(<Inicio />);

    await user.click(screen.getByRole('button', { name: /actualizar departamentos/i }));

    expect(getDepartamentos).toHaveBeenCalledTimes(1);
  });

  it('navega a FormNotificacion cuando residente y notificacion son exitosos', async () => {
    mockUseDepartamentos.mockReturnValue({
      depto: [{ id: 'dep-1', piso: '1', numero: 'A' }],
      piso: ['1'],
      numerosPiso: ['A'],
      loading: false,
      pisoNroSeleccionado: { piso: '1', numero: 'A' },
      getDepartamentos: vi.fn(),
      handleChangePiso: vi.fn(),
      handleChangeNumero: vi.fn(),
    });

    vi.mocked(InicioApi.obtenerResidentePorDepto).mockResolvedValue({
      estado: 'success',
      mensaje: 'ok',
      data: {
        id: 'user-1',
        nombre: 'Ana',
        apellido: 'Perez',
      },
    });

    vi.mocked(InicioApi.crearNotificacion).mockResolvedValue({
      estado: 'success',
      mensaje: 'ok',
      data: { id: 'notif-1' },
    });

    const user = userEvent.setup();
    render(<Inicio />);

    await user.click(screen.getByRole('button', { name: /llamar/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/FormNotificacion', {
        state: {
          piso: '1',
          numero: 'A',
          residente: 'Ana Perez',
        },
      });
    });
  });
});
