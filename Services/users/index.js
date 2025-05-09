// Services/users/index.js

const express = require('express');
const cors    = require('cors');
const { Pool } = require('pg');
const app     = express();

// 1) Middlewares
app.use(cors());            // Permite que el frontend haga peticiones a este servicio
app.use(express.json());    // Parseo automático de JSON en el body

// 2) Conexión a PostgreSQL
const pool = new Pool({
  connectionString: 'postgres://postgres:toor@localhost:5432/postgres'
});

// 3) Rutas

/**
 * GET /users/validate?alias=XXX&password=YYY
 * — Debe ir primero, antes de /users/:id
 * Valida alias+password para login.
 */
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

/**
 * GET /users
 * Lista todos los usuarios existentes.
 */
app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users ORDER BY id');
    return res.json(rows);
  } catch (err) {
    console.error('GET /users error:', err.stack);
    return res.status(500).json({ message: 'Error en la base de datos' });
  }
});

/**
 * POST /users
 * Crea un usuario nuevo.
 */
app.post('/users', async (req, res) => {
  const { name, email, alias, password } = req.body;
  if (!name || !email || !alias || !password) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, "alias", password)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, alias, password]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /users error:', err.stack);
    if (err.code === '23505') {
      // violación de UNIQUE en email o alias
      return res.status(409).json({ message: 'Email o alias ya existe' });
    }
    return res.status(500).json({ message: 'Error en la base de datos' });
  }
});

/**
 * GET /users/:id
 * Recupera un usuario por su ID.
 */
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(parseInt(id, 10))) {
    return res.status(400).json({ message: 'ID inválido' });
  }
  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error(`GET /users/${id} error:`, err.stack);
    return res.status(500).json({ message: 'Error en la base de datos' });
  }
});

/**
 * PUT /users/:id
 * Actualiza uno o varios campos de un usuario existente.
 */
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(parseInt(id, 10))) {
    return res.status(400).json({ message: 'ID inválido' });
  }
  const updates = [];
  const values  = [];
  let idx = 1;

  for (const field of ['name','email','alias','password']) {
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

// 4) Arrancar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Users microservice running on port ${PORT}`);
});
