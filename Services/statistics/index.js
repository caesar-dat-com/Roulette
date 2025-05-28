const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3005;

// Configuración de conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:toor@localhost:5436/statisticsdb'
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Obtener estadísticas
app.get('/estadisticas', async (req, res) => {
  const userId = req.query.user_id;

  try {
    let result;

    if (userId) {
      result = await pool.query(
        'SELECT * FROM statistics WHERE user_id = $1 ORDER BY round_id DESC',
        [userId]
      );
    } else {
      result = await pool.query('SELECT * FROM statistics ORDER BY round_id DESC');
    }

    res.json(result.rows);
  } catch (error) {
    console.error('GET /estadisticas error:', error.message);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

// Insertar una nueva estadística
app.post('/estadisticas', async (req, res) => {
  const {
    user_id,
    round_id,
    winning_number,
    winning_color,
    is_win,
    event_aplicado,
    bonus_aplicado,
    ganancia
  } = req.body;

  if (
    user_id == null || round_id == null || winning_number == null ||
    !winning_color || is_win == null || ganancia == null
  ) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO statistics 
        (user_id, round_id, winning_number, winning_color, is_win, event_aplicado, bonus_aplicado, ganancia, round_timestamp) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [user_id, round_id, winning_number, winning_color, is_win, event_aplicado, bonus_aplicado, ganancia]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST /estadisticas error:', error.message);
    res.status(500).json({ message: 'Error al guardar estadística' });
  }
});


// Iniciar servidor
app.listen(port, () => {
  console.log(`Statistics microservice running on port ${port}`);
});
