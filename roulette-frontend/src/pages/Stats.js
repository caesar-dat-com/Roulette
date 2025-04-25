// roulette-frontend/src/pages/Stats.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import usersApi from '../services/usersApi';  // Usamos el mismo servicio de users

const Stats = () => {
  const navigate = useNavigate();
  const [users, setUsers]       = useState([]);
  const [log, setLog]           = useState('');
  const [loading, setLoading]   = useState(false);

  // 1) Al montar, cargamos todos los usuarios (incluye balance)
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setLog('➡ GET /users');
    try {
      const res = await usersApi.get('/users');
      setLog(prev => prev + `\n✅ ${res.status} ${JSON.stringify(res.data)}`);
      setUsers(res.data);
    } catch (err) {
      const status = err.response?.status || 'Network Error';
      const data   = err.response?.data   || err.message;
      setLog(prev => prev + `\n❌ ${status} ${JSON.stringify(data)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>Estadísticas</h1>
      <nav>
        <ul>
          <li><Link to="/login">Log In</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/game">Jugar a la Ruleta</Link></li>
          <li><button onClick={handleSignOut}>Sign Out</button></li>
        </ul>
      </nav>

      <h2>Usuarios y Balances</h2>
      {loading && <p>Loading…</p>}
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: 'collapse', marginTop: '1rem', width: '100%' }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Alias</th>
            <th>Password</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.alias}</td>
              <td>{u.password}</td>
              <td>{u.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Panel de logs */}
      <div
        style={{
          marginTop: '1rem',
          padding: '0.5rem',
          background: '#f0f0f0',
          border: '1px solid #ccc',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          maxHeight: '200px',
          overflowY: 'auto',
        }}
      >
        {log}
      </div>
    </div>
  );
};

export default Stats;
