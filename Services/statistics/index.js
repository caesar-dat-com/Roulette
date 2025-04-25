// Services/statistics/index.js

const express = require('express');
const cors    = require('cors');
const { Pool } = require('pg');
const app     = express();

// ————————————————————————————————
// 1) Middlewares
// ————————————————————————————————
app.use(cors());            // Permitir CORS desde el frontend
app.use(express.json());    // Parsear bodies JSON

// ————————————————————————————————
// 2) Conexión a PostgreSQL
// ————————————————————————————————
const pool = new Pool({
  connectionString: 'postgres://postgres:toor@localhost:5432/postgres'
});

// ————————————————————————————————
// 3) RUTAS DE ESTADÍSTICAS
// ————————————————————————————————

/**
 * GET /statistics
 * Estadísticas globales:
 *  - totalUsers: número de usuarios
 *  - totalGamesPlayed: número total de partidas (en events)
 *  - totalMoneyBet: suma de todas las apuestas (bet_amount)
 *  - totalMoneyWon: suma de todas las ganancias (win_amount)
 */
app.get('/statistics', async (req, res) => {
  try {
    // 1) Contar usuarios
    const { rows: u } = await pool.query(
      `SELECT COUNT(*)::int AS totalusers FROM users`
    );
    // 2) Contar partidas y suma de apuestas
    const { rows: g } = await pool.query(
      `SELECT COUNT(*)::int AS totalgames,
              COALESCE(SUM(bet_amount),0)::numeric AS totalmoneybet
       FROM events`
    );
    // 3) Suma de ganancias
    const { rows: w } = await pool.query(
      `SELECT COALESCE(SUM(win_amount),0)::numeric AS totalmoneywon
       FROM events`
    );

    return res.json({
      totalUsers:       u[0].totalusers,
      totalGamesPlayed: g[0].totalgames,
      totalMoneyBet:    parseFloat(g[0].totalmoneybet),
      totalMoneyWon:    parseFloat(w[0].totalmoneywon)
    });
  } catch (err) {
    console.error('GET /statistics error:', err.stack);
    return res.status(500).json({ message: 'Error al obtener estadísticas globales' });
  }
});

/**
 * GET /statistics/:userId
 * Estadísticas por usuario:
 *  - gamesPlayed: número de partidas del usuario
 *  - moneyBet: suma de sus apuestas
 *  - moneyWon: suma de sus ganancias
 */
app.get('/statistics/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'User ID inválido' });
  }
  try {
    const { rows } = await pool.query(
      `SELECT
         COUNT(*)::int AS gamesplayed,
         COALESCE(SUM(bet_amount),0)::numeric AS moneybet,
         COALESCE(SUM(win_amount),0)::numeric AS moneywon
       FROM events
       WHERE user_id = $1`,
      [userId]
    );
    return res.json({
      userId,
      gamesPlayed: rows[0].gamesplayed,
      moneyBet:    parseFloat(rows[0].moneybet),
      moneyWon:    parseFloat(rows[0].moneywon)
    });
  } catch (err) {
    console.error(`GET /statistics/${userId} error:`, err.stack);
    return res.status(500).json({ message: 'Error al obtener estadísticas de usuario' });
  }
});

/**
 * GET /statistics/games
 * Estadísticas agregadas de las partidas:
 *  - totalGames: total de partidas
 *  - averageBet: apuesta promedio por partida
 *  - averageWin: ganancia promedio por partida
 */
app.get('/statistics/games', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         COUNT(*)::int AS totalgames,
         COALESCE(AVG(bet_amount),0)::numeric AS averagebet,
         COALESCE(AVG(win_amount),0)::numeric AS averagewin
       FROM events`
    );
    return res.json({
      totalGames:  rows[0].totalgames,
      averageBet:  parseFloat(rows[0].averagebet),
      averageWin:  parseFloat(rows[0].averagewin)
    });
  } catch (err) {
    console.error('GET /statistics/games error:', err.stack);
    return res.status(500).json({ message: 'Error al obtener estadísticas de partidas' });
  }
});

// ————————————————————————————————
// 4) Arranque del servidor
// ————————————————————————————————
const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Statistics microservice running on port ${PORT}`);
});
