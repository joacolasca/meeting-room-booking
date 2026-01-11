const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'super_secreto_123';

async function registerUser(req, res) {
    const { nombre, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
            [nombre, email, hashedPassword]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = result.rows[0];

        const passwordCorrecta = await bcrypt.compare(password, user.password);

        if (!passwordCorrecta) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

            const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '1h' }
            );

            res.json({
            mensaje: 'Login correcto',
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email
            }
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en login' });
    }
}

module.exports = {
    registerUser,
    loginUser
};
