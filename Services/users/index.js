// Services/users/index.js
const express = require('express');
const app = express();

app.use(express.json());

let users = [];

/**
 * POST /users
 * Crea un usuario nuevo.
 */
app.post('/users', (req, res) => {
  const { name, email, alias, password } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email,
    alias,
    password,
    balance: 100 // Saldo inicial
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

/**
 * GET /users/:id
 * Obtiene la información de un usuario por ID.
 */
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (user) res.json(user);
  else res.status(404).json({ message: 'User not found' });
});

/**
 * PUT /users/:id
 * Actualiza los datos de un usuario.
 */
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user = { ...user, ...req.body };
  users = users.map(u => (u.id === id ? user : u));
  res.json(user);
});

/**
 * GET /users/validate?alias=xxx&password=yyy
 * Valida las credenciales del usuario.
 */
app.get('/users/validate', (req, res) => {
  const { alias, password } = req.query;
  const user = users.find(u => u.alias === alias && u.password === password);
  if (user) res.json({ message: 'Valid credentials', user });
  else res.status(401).json({ message: 'Invalid credentials' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Users microservice running on port ${PORT}`);
});
