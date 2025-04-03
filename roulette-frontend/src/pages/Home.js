import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bienvenido a Roulette Virtual Casino</h1>
      <nav>
        <ul>
          <li><Link to="/login">Iniciar Sesión</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/game">Jugar a la Ruleta</Link></li>
          <li><Link to="/stats">Ver Estadísticas</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
