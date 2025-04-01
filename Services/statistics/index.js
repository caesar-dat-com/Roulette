// Services/statistics/index.js
const express = require('express');
const app = express();

app.use(express.json());

// Datos estáticos de ejemplo. En un escenario real, se obtendrían de una base de datos o de otros servicios.
const globalStats = {
  totalUsers: 100,
  totalGamesPlayed: 500,
  totalMoneyBet: 10000,
  totalMoneyWon: 6000
};

/**
 * GET /statistics
 * Devuelve las estadísticas globales.
 */
app.get('/statistics', (req, res) => {
  res.json(globalStats);
});

/**
 * GET /statistics/:userId
 * Devuelve estadísticas específicas de un usuario.
 */
app.get('/statistics/:userId', (req, res) => {
  const userId = req.params.userId;
  // Datos simulados para el usuario.
  res.json({
    userId,
    gamesPlayed: 10,
    moneyBet: 500,
    moneyWon: 300
  });
});

/**
 * GET /statistics/games
 * Devuelve estadísticas específicas de las partidas.
 */
app.get('/statistics/games', (req, res) => {
  res.json({
    totalGames: 500,
    averageBet: 20,
    averageWin: 15
  });
});

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Statistics microservice running on port ${PORT}`);
});
