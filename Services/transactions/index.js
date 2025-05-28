// Services/transactions/index.js
const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors());
app.use(express.json());

let transactions = [];

/**
 * POST /transactions
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
 */
app.get('/transactions/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tx = transactions.find(t => t.id === id);
  if (tx) res.json(tx);
  else res.status(404).json({ message: 'Transaction not found' });
});

/**
 * GET /transactions
 */
app.get('/transactions', (req, res) => {
  const { userId } = req.query;
  if (userId) return res.json(transactions.filter(t => t.userId == userId));
  res.json(transactions);
});

/**
 * GET /health
 */
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Transactions microservice running on port ${PORT}`);
});
