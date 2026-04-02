require('dotenv').config();
const express = require('express');
const app = express();

const cors = require('cors');

// Middleware para JSON
app.use(express.json());

// Enable CORS
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins }));

// Routes
const usersRoutes = require('./routes/users.routes');
const roomsRoutes = require('./routes/rooms.routes');
const reservationsRoutes = require('./routes/reservations.routes');

// Endpoints
app.use('/api/users', usersRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/reservations', reservationsRoutes);

app.get('/', (req, res) => {
    res.send('API funcionando');
});

// Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
