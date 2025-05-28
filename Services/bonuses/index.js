const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Ruta de salud
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Obtener todas las bonificaciones
app.get("/bonificaciones", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bonificaciones");
    res.json(result.rows);
  } catch (err) {
    console.error("GET /bonificaciones error:", err.message);
    res.status(500).json({ message: "Error en la base de datos" });
  }
});

// Insertar una nueva bonificación
app.post("/bonificaciones", async (req, res) => {
  const { tipo, descripcion, efecto, condiciones } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO bonificaciones (tipo, descripcion, efecto, condiciones) VALUES ($1, $2, $3, $4) RETURNING *",
      [tipo, descripcion, efecto, condiciones]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /bonificaciones error:", err.message);
    res.status(500).json({ message: "Error en la base de datos" });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Bonuses microservice running on port ${PORT}`);
});
