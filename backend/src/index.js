require('dotenv').config();
const express = require('express');
const app = express();

const cors = require('cors');

// Middleware para JSON
app.use(express.json());

// CORS: FRONTEND_URL puede ser varias URLs separadas por coma.
// También permitimos *.vercel.app para que funcionen los deploys preview
// (ej. xxx-joacolascas-projects.vercel.app) sin listarlos uno por uno.
const localDev = 'http://localhost:5173';
const fromEnv = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function corsAllowed(origin) {
  if (!origin) return true;
  if (origin === localDev) return true;
  if (fromEnv.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    if (hostname.endsWith('.vercel.app')) return true;
  } catch {
    return false;
  }
  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      if (corsAllowed(origin)) {
        callback(null, origin || true);
      } else {
        callback(null, false);
      }
    },
  })
);

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
