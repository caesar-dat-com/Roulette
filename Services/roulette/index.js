// Services/roulette/index.js
const express = require('express');
const app = express();

app.use(express.json());

let games = [];

/**
 * POST /roulette
 * Inicia una partida o realiza un giro de ruleta.
 * Recibe: { userId, betAmount }
 * Genera un resultado aleatorio entre 0 y 36.
 */
app.post('/roulette', (req, res) => {
  const { userId, betAmount } = req.body;
  // Opcional: Validar que el usuario exista y tenga saldo (llamando al microservicio Users)
  const result = Math.floor(Math.random() * 37); // Número aleatorio de 0 a 36
  const game = {
    id: games.length + 1,
    userId,
    betAmount,
    result,
    timestamp: new Date().toISOString()
  };
  games.push(game);
  res.status(201).json(game);
});

/**
 * GET /roulette/:id
 * Obtiene el estado de una partida específica.
 */
app.get('/roulette/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const game = games.find(g => g.id === id);
  if (game) res.json(game);
  else res.status(404).json({ message: 'Game not found' });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Roulette microservice running on port ${PORT}`);
});
