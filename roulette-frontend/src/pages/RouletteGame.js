// src/pages/RouletteGame.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RouletteGame = () => {
  const [form, setForm] = useState({
    user_id: '',
    apostado_numero: '',
    apostado_color: '',
    valor_apuesta: ''
  });
  const [log, setLog] = useState('');
  const [message, setMessage] = useState('');
  const [resultado, setResultado] = useState(null);

  // Capturar user_id desde sessionStorage al cargar el componente
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setForm(prev => ({ ...prev, user_id: parsedUser.id }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setResultado(null);

    // Validación previa
    if (
      !form.user_id ||
      !form.apostado_numero ||
      !form.apostado_color ||
      !form.valor_apuesta ||
      isNaN(parseInt(form.user_id)) ||
      isNaN(parseInt(form.apostado_numero)) ||
      isNaN(parseFloat(form.valor_apuesta)) ||
      !['red', 'black', 'green'].includes(form.apostado_color.toLowerCase())
    ) {
      setMessage('❌ Todos los campos son obligatorios y deben tener valores válidos.');
      return;
    }

    setLog(`➡ POST /rondas\n${JSON.stringify(form, null, 2)}`);

    try {
      const res = await axios.post('http://localhost:3002/rondas', {
        user_id: parseInt(form.user_id),
        apostado_numero: parseInt(form.apostado_numero),
        apostado_color: form.apostado_color.toLowerCase(),
        valor_apuesta: parseFloat(form.valor_apuesta)
      });
      setMessage(res.data.message);
      setResultado(res.data.resultado);
      setLog(prev => prev + `\n✅ ${res.status} ${JSON.stringify(res.data)}`);
    } catch (err) {
      const status = err.response?.status || 'Error';
      const data = err.response?.data || err.message;
      setLog(prev => prev + `\n❌ ${status} ${JSON.stringify(data)}`);
      setMessage('Hubo un error realizando la jugada');
    }
  };

  return (
    <div className="auth-container">
      <h1>🎰 Roulette Game</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Número Apostado (0-36):
          <input
            type="number"
            name="apostado_numero"
            value={form.apostado_numero}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Color Apostado:
          <select
            name="apostado_color"
            value={form.apostado_color}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona un color --</option>
            <option value="red">Red</option>
            <option value="black">Black</option>
            <option value="green">Green</option>
          </select>
        </label>

        <label>
          Valor Apuesta:
          <input
            type="number"
            name="valor_apuesta"
            value={form.valor_apuesta}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Jugar</button>
      </form>

      {message && <p className="message">{message}</p>}

      {resultado && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Resultado:</strong>
          <pre>{JSON.stringify(resultado, null, 2)}</pre>
        </div>
      )}

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

export default RouletteGame;
