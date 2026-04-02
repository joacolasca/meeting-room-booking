const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const {
    obtenerSalas,
    obtenerSalaPorId,
    crearSala,
    editarSala,
    eliminarSala,
    obtenerSalasDisponibles,
    rateRoom,
    obtenerPromedioSala,
    agregarFavorito,
    quitarFavorito,
    misFavoritos,
    obtenerTodasReservas,
    cancelarReservaAdmin
} = require('../controllers/rooms.controller');

// Static paths first
router.get('/', obtenerSalas);
router.post('/', authMiddleware, roleMiddleware(['admin']), crearSala);
router.get('/availability', authMiddleware, obtenerSalasDisponibles);
router.get('/favorites/me', authMiddleware, misFavoritos);
router.get('/admin/reservations', authMiddleware, roleMiddleware(['admin']), obtenerTodasReservas);
router.put('/admin/reservations/:id/cancel', authMiddleware, roleMiddleware(['admin']), cancelarReservaAdmin);

// Param routes
router.get('/:id/detail', authMiddleware, obtenerSalaPorId);
router.get('/:id/average', authMiddleware, obtenerPromedioSala);
router.post('/:id/rate', authMiddleware, rateRoom);
router.post('/:id/favorite', authMiddleware, agregarFavorito);
router.delete('/:id/favorite', authMiddleware, quitarFavorito);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), editarSala);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), eliminarSala);


module.exports = router;
