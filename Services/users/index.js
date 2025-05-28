// Services/users/index.js

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const client = require('prom-client'); // 📊 Prometheus client

const app = express();

// 1) Middlewares
app.use(cors());
app.use(express.json());

// 2) Conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
    || 'postgres://postgres:toor@localhost:5433/usersdb'
});

// 3) Configurar Prometheus
const register = new client.Registry();
client.collectDefaultMetrics({ register }); // ← recolecta métricas básicas

// Métrica personalizada: contar las solicitudes HTTP
const httpRequestsCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP recibidas',
  labelNames: ['method', 'route', 'status']
});
register.registerMetric(httpRequestsCounter);

// Middleware para contar solicitudes
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestsCounter.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

// 4) Endpoint para Prometheus
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// 5) Rutas principales

app.get('/users/validate', async (req, res) => {
  const { alias, password } = req.query;
  if (!alias || !password) {
    return res.status(400).json({ message: 'Alias y password son obligatorios' });
  }
  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE "alias" = $1 AND password = $2',
      [alias, password]
    );
    if (!rows.length) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    return res.json({ message: 'Credenciales válidas', user: rows[0] });
  } catch (err) {
    console.error('GET /users/validate error:', err.stack);
    return res.status(500).json({ message: 'Error en la base de datos' });
  }
});

app.get('/users', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users ORDER BY id');
    return res.json(rows);
  } catch (err) {
    console.error('GET /users error:', err.stack);
    return res.status(500).json({ message: 'Error en la base de datos' });
  }
});

app.post('/users', async (req, res) => {
  const { name, email, alias, password } = req.body;
  if (!name || !email || !alias || !password) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, "alias", password)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, alias, password]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /users error:', err.stack);
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email o alias ya existe' });
    }
    return res.status(500).json({ message: 'Error en la base de datos' });
  }
});

app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error(`GET /users/${id} error:`, err.stack);
    return res.status(500).json({ message: 'Error en la base de datos' });
  }
});

app.put('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }
  const updates = [];
  const values = [];
  let idx = 1;
  for (const field of ['name', 'email', 'alias', 'password']) {
    if (req.body[field] !== undefined) {
      const column = field === 'alias' ? `"alias"` : field;
      updates.push(`${column} = $${idx}`);
      values.push(req.body[field]);
      idx++;
    }
  }
  if (!updates.length) {
    return res.status(400).json({ message: 'No hay campos para actualizar' });
  }
  values.push(id);
  const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`;
  try {
    const { rows } = await pool.query(sql, values);
    if (!rows.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error(`PUT /users/${id} error:`, err.stack);
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email o alias ya existe' });
    }
    return res.status(500).json({ message: 'Error en la base de datos' });
  }
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 6) Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Users microservice running on port ${PORT}`);
});
