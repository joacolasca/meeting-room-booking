const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const {
    obtenerSalas,
    crearSala,
    obtenerSalasDisponibles,
    rateRoom,
    obtenerPromedioSala,
    agregarFavorito,
    quitarFavorito,
    misFavoritos
} = require('../controllers/rooms.controller');

router.get('/', obtenerSalas);
router.post(
    '/',
    authMiddleware,
    roleMiddleware(['admin']),
    crearSala
);
router.get(
    '/availability',
    authMiddleware,
    obtenerSalasDisponibles
);
router.get(
    '/:id/average',
    authMiddleware,
    obtenerPromedioSala
);
router.post(
    '/:id/rate',
    authMiddleware,
    rateRoom
);
router.post('/:id/favorite', authMiddleware, agregarFavorito);
router.delete('/:id/favorite', authMiddleware, quitarFavorito);
router.get('/favorites/me', authMiddleware, misFavoritos);


module.exports = router;
