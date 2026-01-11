const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const {
    crearReserva,
    cancelarReserva,
    obtenerReservas
} = require('../controllers/reservations.controller');

// Crear reserva
router.post('/', authMiddleware, crearReserva);

// Cancelar reserva
router.put('/:id/cancel', authMiddleware, cancelarReserva);

// Obtener reservas
router.get('/', authMiddleware, obtenerReservas);

module.exports = router;
