// Services/events/index.js
const express = require('express');
const app = express();

app.use(express.json());

let events = [];

/**
 * GET /events
 * Lista todos los eventos activos.
 */
app.get('/events', (req, res) => {
  res.json(events);
});

/**
 * POST /events
 * Crea un nuevo evento.
 * Recibe: { name, description, startTime, endTime, active }
 */
app.post('/events', (req, res) => {
  const { name, description, startTime, endTime, active } = req.body;
  const event = {
    id: events.length + 1,
    name,
    description,
    startTime,
    endTime,
    active
  };
  events.push(event);
  res.status(201).json(event);
});

/**
 * PUT /events/:id
 * Actualiza un evento existente.
 */
app.put('/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let event = events.find(e => e.id === id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  event = { ...event, ...req.body };
  events = events.map(e => (e.id === id ? event : e));
  res.json(event);
});

/**
 * DELETE /events/:id
 * Elimina un evento.
 */
app.delete('/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = events.findIndex(e => e.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }
  const deletedEvent = events.splice(index, 1);
  res.json({ message: 'Event deleted', event: deletedEvent[0] });
});

const PORT = 3006;
app.listen(PORT, () => {
  console.log(`Events microservice running on port ${PORT}`);
});

