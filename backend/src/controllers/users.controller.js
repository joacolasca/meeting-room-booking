const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_123';

async function registerUser(req, res) {
    const { nombre, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
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
                nombre: user.name,
                email: user.email,
                role: user.role || 'user'
            }
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en login' });
    }
}

async function obtenerUsuarios(req, res) {
    try {
        const result = await pool.query('SELECT id, name, email, role FROM users ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
}

async function cambiarRol(req, res) {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Rol invalido' });
    }

    try {
        const result = await pool.query(
            'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
            [role, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cambiar rol' });
    }
}

async function eliminarUsuario(req, res) {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
        return res.status(400).json({ error: 'No podes eliminarte a vos mismo' });
    }

    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ mensaje: 'Usuario eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    obtenerUsuarios,
    cambiarRol,
    eliminarUsuario
};
