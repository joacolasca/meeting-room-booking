const pool = require('../config/db');

async function obtenerSalas(req, res) {
    try {
        const result = await pool.query('SELECT * FROM rooms');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener salas' });
    }
}

async function crearSala(req, res) {
    const { nombre, capacidad } = req.body;

    try {
        const result = await pool.query(
        'INSERT INTO rooms (nombre, capacidad) VALUES ($1, $2) RETURNING *',
        [nombre, capacidad]
    );

    res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear sala' });
    }
}

module.exports = {
    obtenerSalas,
    crearSala
};
