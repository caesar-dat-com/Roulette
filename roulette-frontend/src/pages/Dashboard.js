import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard del Usuario</h1>
      <nav>
        <ul>
          <li><Link to="/game">Jugar a la Ruleta</Link></li>
          <li><Link to="/stats">Ver Estadísticas</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
