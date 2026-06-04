
import { useNavigate } from 'react-router-dom';

export const Inicio = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={ () => {
          navigate( '/FormNotificacion', {
            state: {
              nombre: 'asd',
            }
          } );
        } }
      >
        Elegir
      </button>
    </div>

  );
};
