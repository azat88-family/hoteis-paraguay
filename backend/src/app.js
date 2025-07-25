const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.get('/', (req, res) => {
  res.send('API do Hotel rodando!');
});

app.use('/api/guests', require('./routes/guestRoutes')); // Rotas de hóspedes
app.use('/api/rooms', require('./routes/roomRoutes')); // Rotas de quartos
app.use('/api/reservations', require('./routes/reservationRoutes')); // Rotas de reservas
app.use('/api/maintenance', require('./routes/maintenanceRoutes')); // Rotas de manutenção

module.exports = app;