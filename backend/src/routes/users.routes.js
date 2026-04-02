const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const {
    registerUser,
    loginUser,
    obtenerUsuarios,
    cambiarRol,
    eliminarUsuario
} = require('../controllers/users.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', authMiddleware, roleMiddleware(['admin']), obtenerUsuarios);
router.put('/:id/role', authMiddleware, roleMiddleware(['admin']), cambiarRol);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), eliminarUsuario);

module.exports = router;
