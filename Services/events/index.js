const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:toor@localhost:5433/usersdb'
});

// Healthcheck
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Obtener todos los eventos
app.get('/eventos', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM eventos ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('GET /eventos error:', err.stack);
    res.status(500).json({ message: 'Error en la base de datos' });
  }
});

// Crear un nuevo evento
app.post('/eventos', async (req, res) => {
  const { nombre, descripcion, start_time, end_time, activo } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO eventos (nombre, descripcion, start_time, end_time, activo)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, descripcion, start_time, end_time, activo]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /eventos error:', err.stack);
    res.status(500).json({ message: 'Error en la base de datos' });
  }
});

// Iniciar el servidor
const PORT = 3006;
app.listen(PORT, () => {
  console.log(`Events microservice running on port ${PORT}`);
});
