const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

const {
    obtenerSalas,
    crearSala
} = require('../controllers/salas.controller');

router.get('/', obtenerSalas);
router.post('/', authMiddleware, crearSala);

module.exports = router;
