import React from 'react';

const Login = () => {
  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <form>
        <div>
          <label>Correo Electrónico:</label>
          <input type="email" placeholder="Correo" required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" placeholder="Contraseña" required />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
