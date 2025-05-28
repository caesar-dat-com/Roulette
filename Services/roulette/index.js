const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const client = require('prom-client');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// 1) Conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:toor@localhost:5434/roulettedb'
});

// 2) Configurar Prometheus
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP recibidas',
  labelNames: ['method', 'route', 'status']
});
register.registerMetric(httpRequestsCounter);

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestsCounter.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Endpoint de salud
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// POST: Realizar jugada de ruleta
app.post('/rondas', async (req, res) => {
  console.log('📥 Body recibido:', req.body);
  const { user_id, apostado_numero, apostado_color, valor_apuesta } = req.body;
  const isValid = (
  Number.isInteger(user_id) &&
  Number.isInteger(apostado_numero) &&
  ['red', 'black', 'green'].includes(apostado_color?.toLowerCase()) &&
  typeof valor_apuesta === 'number' && valor_apuesta > 0
);

if (!isValid) {
  console.log('🚨 Validación fallida. Datos inválidos:', req.body);
  console.log('📥 Body (tipado):', {
  user_id: typeof user_id,
  apostado_numero: typeof apostado_numero,
  apostado_color: typeof apostado_color,
  valor_apuesta: typeof valor_apuesta
});

  return res.status(400).json({ message: 'Faltan datos obligatorios o son inválidos' });
}


  try {
    // 1. Generar resultado aleatorio
    const winning_number = Math.floor(Math.random() * 37); // 0-36
    const winning_color = (winning_number === 0) ? 'green' : (winning_number % 2 === 0 ? 'black' : 'red');

    // 2. Verificar si ganó
    const is_win = apostado_numero === winning_number && apostado_color === winning_color;

    // 3. Consultar bonificación activa
    let bonus_applied = 'Ninguno';
    let bonus_multiplier = 1;
    try {
      const bonusRes = await axios.get('http://localhost:3003/bonificaciones');
      const bonus = bonusRes.data.find(b => b.tipo && b.tipo.toLowerCase().includes('bienvenida'));
      if (bonus) {
        bonus_applied = bonus.tipo;
        if (bonus.efecto.includes('x2')) bonus_multiplier = 2;
        if (bonus.efecto.includes('x3')) bonus_multiplier = 3;
      }
    } catch (e) {
      console.log('ℹ️ No se pudo obtener bonificación activa');
    }

    // 4. Consultar evento activo
    let event_applied = 'Ninguno';
    let event_multiplier = 1;
    try {
      const eventRes = await axios.get('http://localhost:3006/eventos');
      const now = new Date();
      const event = eventRes.data.find(ev => ev.activo && new Date(ev.start_time) <= now && new Date(ev.end_time) >= now);
      if (event) {
        event_applied = event.nombre;
        if (event.descripcion.includes('x2')) event_multiplier = 2;
        if (event.descripcion.includes('x3')) event_multiplier = 3;
      }
    } catch (e) {
      console.log('ℹ️ No se pudo obtener evento activo');
    }

    // 5. Calcular ganancia
    const multiplier = bonus_multiplier * event_multiplier;
    const winnings_amount = is_win ? valor_apuesta * multiplier : 0;

        // 6. Insertar resultado en la tabla
    const insert = await pool.query(
      `INSERT INTO rondas_ruleta (
        user_id, 
        apostado_numero, 
        apostado_color, 
        valor_apuesta, 
        winning_number, 
        winning_color, 
        is_win, 
        event_aplicado, 
        bonus_aplicado, 
        ganancia
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        user_id, 
        apostado_numero, 
        apostado_color, 
        valor_apuesta, 
        winning_number, 
        winning_color, 
        is_win, 
        event_applied, 
        bonus_applied, 
        winnings_amount
      ]
    );

  // 7. Enviar resultado a microservicio de estadísticas
  try {
    await axios.post('http://statistics:3005/estadisticas', {
  user_id,
  round_id: insert.rows[0].round_id,
  winning_number,
  winning_color,
  is_win,
  event_aplicado: event_applied,
  bonus_aplicado: bonus_applied,
  ganancia: winnings_amount
});

} catch (e) {
  console.warn('⚠️ No se pudo guardar en estadísticas:', e.message);
  console.log('📛 Detalles del error:', e.response?.data || e);
}
  
    res.status(201).json({
      message: is_win ? '🎉 ¡Ganaste!' : '😢 Lo sentimos, intenta de nuevo.',
      resultado: insert.rows[0]
    });
  } catch (err) {
    console.error('POST /rondas error:', err.stack);
    res.status(500).json({ message: 'Error en la base de datos' });
  }
});

// GET: Listar todas las rondas
app.get('/rondas', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rondas_ruleta ORDER BY round_id');
    res.json(result.rows);
  } catch (error) {
    console.error('GET /rondas error:', error.message);
    res.status(500).json({ message: 'Error al obtener rondas' });
  }
});

// Iniciar servidor
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Roulette microservice running on port ${PORT}`);
});
