const express = require('express');
const router = express.Router();

const {
    obtenerSalas,
    crearSala
} = require('../controllers/salas.controller');

router.get('/', obtenerSalas);
router.post('/', crearSala);

module.exports = router;
