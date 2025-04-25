// src/pages/SignUp.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import usersApi from '../services/usersApi';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    alias: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [log, setLog] = useState('');       // Para mostrar petición/respuesta
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setLog(`➡ POST /users\nPayload: ${JSON.stringify(form)}`);

    try {
      const res = await usersApi.post('/users', form);
      setLog(prev => prev + `\n✅ ${res.status} ${JSON.stringify(res.data)}`);
      setMessage(`Account created! ID: ${res.data.id}`);
      setLoading(false);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const status = err.response?.status || 'Error';
      const data   = err.response?.data   || err.message;
      setLog(prev => prev + `\n❌ ${status} ${JSON.stringify(data)}`);
      if (status === 409) setMessage('Email or alias already exists');
      else setMessage('Error creating account');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

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
          {loading ? 'Signing Up…' : 'Sign Up'}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Log In</Link>
      </p>

      {message && <p className="message">{message}</p>}

      {/* Panel de logs para ver la petición y la respuesta del microservicio */}
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

export default SignUp;
