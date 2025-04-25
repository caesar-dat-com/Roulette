// src/pages/Login.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import usersApi from '../services/usersApi';

const Login = () => {
  const [form, setForm] = useState({ alias: '', password: '' });
  const [message, setMessage] = useState('');
  const [log, setLog] = useState('');         // para mostrar petición/respuesta
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    // 1) Log de la petición
    setLog(`➡ GET /users/validate?alias=${encodeURIComponent(form.alias)}&password=${encodeURIComponent(form.password)}`);

    try {
      const res = await usersApi.get('/users/validate', { params: form });
      // 2) Log de la respuesta
      setLog(prev => prev + `\n✅ ${res.status} ${JSON.stringify(res.data)}`);
      setMessage(`Welcome, ${res.data.user.name}!`);
      setLoading(false);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      // 3) Log del error
      const status = err.response?.status || 'Network Error';
      const data = err.response?.data || err.message;
      setLog(prev => prev + `\n❌ ${status} ${JSON.stringify(data)}`);
      setMessage('Alias or password invalid');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Log In</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Alias:
          <input
            type="text"
            name="alias"
            value={form.alias}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Signing In…' : 'Log In'}
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>

      {message && <p className="message">{message}</p>}

      {/* Panel de logs para ver la petición y la respuesta */}
      <div style={{
        marginTop: '1rem',
        padding: '0.5rem',
        background: '#f0f0f0',
        border: '1px solid #ccc',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap'
      }}>
        {log}
      </div>
    </div>
  );
};

export default Login;
