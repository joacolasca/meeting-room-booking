const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const {
    obtenerSalas,
    crearSala
} = require('../controllers/rooms.controller');

router.get('/', obtenerSalas);
router.post(
    '/',
    authMiddleware,
    roleMiddleware(['admin']),
    crearSala
);

module.exports = router;
