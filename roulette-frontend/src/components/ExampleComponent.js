import React, { useEffect, useState } from 'react';
import usersApi from '../services/usersApi';

const ExampleComponent = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Ejemplo de llamada al microservicio "users"
    usersApi.get('/usuarios/1')
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error("Error al obtener el usuario:", error);
      });
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h2>Usuario: {user.name}</h2>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Cargando usuario...</p>
      )}
    </div>
  );
};

export default ExampleComponent;
