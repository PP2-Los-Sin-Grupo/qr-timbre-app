import { useLocation } from 'react-router-dom';

export const FormNotificacion = () => {
  const location = useLocation();
  const { nombre } = location.state || {};
  return (
    <div>FormNotificacion: { nombre }</div>
  );
};
