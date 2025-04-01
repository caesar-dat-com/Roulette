// Services/transactions/index.js
const express = require('express');
const app = express();

app.use(express.json());

let transactions = [];

/**
 * POST /transactions
 * Crea una nueva transacción (apuesta o ganancia).
 * Recibe: { userId, amount, type, rouletteId }
 */
app.post('/transactions', (req, res) => {
  const { userId, amount, type, rouletteId } = req.body;
  const transaction = {
    id: transactions.length + 1,
    userId,
    amount,
    type, // "bet" o "win"
    rouletteId,
    timestamp: new Date().toISOString()
  };
  transactions.push(transaction);
  res.status(201).json(transaction);
});

/**
 * GET /transactions/:id
 * Obtiene una transacción específica.
 */
app.get('/transactions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const transaction = transactions.find(t => t.id === id);
  if (transaction) res.json(transaction);
  else res.status(404).json({ message: 'Transaction not found' });
});

/**
 * GET /transactions
 * Lista las transacciones de un usuario (pasando ?userId=xxx)
 */
app.get('/transactions', (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const userTransactions = transactions.filter(t => t.userId == userId);
    res.json(userTransactions);
  } else {
    res.json(transactions);
  }
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Transactions microservice running on port ${PORT}`);
});
