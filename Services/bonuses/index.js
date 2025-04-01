// Services/bonuses/index.js
const express = require('express');
const app = express();

app.use(express.json());

let bonuses = [];

/**
 * POST /bonuses
 * Crea una nueva bonificación.
 * Recibe: { type, description, effect, conditions }
 */
app.post('/bonuses', (req, res) => {
  const { type, description, effect, conditions } = req.body;
  const bonus = {
    id: bonuses.length + 1,
    type,
    description,
    effect,
    conditions
  };
  bonuses.push(bonus);
  res.status(201).json(bonus);
});

/**
 * GET /bonuses
 * Lista todas las bonificaciones.
 */
app.get('/bonuses', (req, res) => {
  res.json(bonuses);
});

/**
 * GET /bonuses/:id
 * Obtiene los detalles de una bonificación específica.
 */
app.get('/bonuses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bonus = bonuses.find(b => b.id === id);
  if (bonus) res.json(bonus);
  else res.status(404).json({ message: 'Bonus not found' });
});

/**
 * PUT /bonuses/:id
 * Actualiza una bonificación.
 */
app.put('/bonuses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let bonus = bonuses.find(b => b.id === id);
  if (!bonus) {
    return res.status(404).json({ message: 'Bonus not found' });
  }
  bonus = { ...bonus, ...req.body };
  bonuses = bonuses.map(b => (b.id === id ? bonus : b));
  res.json(bonus);
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Bonuses microservice running on port ${PORT}`);
});
