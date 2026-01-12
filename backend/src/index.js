const express = require('express');
const app = express();

const cors = require('cors');

// Middleware para JSON
app.use(express.json());

// Enable CORS for frontend
app.use(cors({ origin: 'http://localhost:5173' }));

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
app.listen(3001, () => {
    console.log('Servidor corriendo en puerto 3001');
});
