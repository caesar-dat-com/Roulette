import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Stats = () => {
  const navigate = useNavigate();
  const [rounds, setRounds] = useState([]);
  const [log, setLog] = useState('');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(sessionStorage.getItem('user'));
  const userId = user?.id || user?.id_usuario;

  useEffect(() => {
    if (userId) {
      fetchStats();
    } else {
      setLog('⚠️ Usuario no autenticado.');
    }
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setLog(`➡ GET /estadisticas (filtrando por user_id: ${userId})`);
    try {
      const res = await axios.get('http://localhost:3005/estadisticas');
      const filtered = res.data.filter(r => r.user_id === userId);
      setLog(prev => prev + `\n✅ ${res.status} Resultados del usuario: ${filtered.length}`);
      setRounds(filtered);
    } catch (err) {
      const status = err.response?.status || 'Network Error';
      const data = err.response?.data || err.message;
      setLog(prev => prev + `\n❌ ${status} ${JSON.stringify(data)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <h1>📊 Mis Estadísticas</h1>
      <nav>
        <ul>
          <li><Link to="/game">Jugar</Link></li>
          <li><button onClick={handleSignOut}>Cerrar sesión</button></li>
        </ul>
      </nav>

      {loading && <p>🔄 Cargando...</p>}

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>🆔 Ronda</th>
            <th>🎯 Número</th>
            <th>🎨 Color</th>
            <th>✅ ¿Ganó?</th>
            <th>🎁 Evento</th>
            <th>💎 Bono</th>
            <th>💰 Ganancia</th>
            <th>⏰ Fecha</th>
          </tr>
        </thead>
        <tbody>
          {rounds.map(r => (
            <tr key={r.id}>
              <td>{r.round_id}</td>
              <td>{r.winning_number}</td>
              <td>{r.winning_color}</td>
              <td>{r.is_win ? 'Sí' : 'No'}</td>
              <td>{r.event_applied}</td>
              <td>{r.bonus_applied}</td>
              <td>{r.winnings_amount}</td>
              <td>{new Date(r.round_timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{
        marginTop: '1rem',
        padding: '0.5rem',
        background: '#f0f0f0',
        border: '1px solid #ccc',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        maxHeight: '200px',
        overflowY: 'auto',
      }}>
        {log}
      </div>
    </div>
  );
};

export default Stats;

