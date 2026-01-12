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

async function obtenerSalasDisponibles(req, res) {
    const { date, start_time, end_time } = req.query;

    try {
        const result = await pool.query(
        `
        SELECT *
        FROM rooms r
        WHERE r.id NOT IN (
            SELECT room_id
            FROM reservations
            WHERE status = 'active'
            AND date = $1
            AND (
                $2 < end_time
                AND
                $3 > start_time
            )
        )
        `,
        [date, start_time, end_time]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener disponibilidad' });
    }
}

async function rateRoom(req, res) {
    const room_id = req.params.id;
    const user_id = req.user.id;
    const { rating } = req.body;

    try {
        await pool.query(
        `
        INSERT INTO room_ratings (user_id, room_id, rating)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, room_id)
        DO UPDATE SET rating = $3
        `,
        [user_id, room_id, rating]
        );

        res.json({ mensaje: 'Puntuación guardada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al puntuar la sala' });
    }
}

async function obtenerPromedioSala(req, res) {
    const room_id = req.params.id;

    try {
        const result = await pool.query(
            'SELECT AVG(rating) as average, COUNT(*) as count FROM room_ratings WHERE room_id = $1',
            [room_id]
        );

        const avg = result.rows[0].average !== null ? parseFloat(result.rows[0].average) : null;
        const count = parseInt(result.rows[0].count, 10);

        res.json({ room_id: parseInt(room_id, 10), average: avg, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener promedio de la sala' });
    }
}
async function agregarFavorito(req, res) {
    await pool.query(
        `
        INSERT INTO favorite_rooms (user_id, room_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        `,
        [req.user.id, req.params.id]
    );

    res.json({ mensaje: 'Sala agregada a favoritos' });
}

async function quitarFavorito(req, res) {
    await pool.query(
        `
        DELETE FROM favorite_rooms
        WHERE user_id = $1 AND room_id = $2
        `,
        [req.user.id, req.params.id]
    );

    res.json({ mensaje: 'Sala eliminada de favoritos' });
}

async function misFavoritos(req, res) {
    const result = await pool.query(
        `
        SELECT r.*
        FROM rooms r
        JOIN favorite_rooms f ON f.room_id = r.id
        WHERE f.user_id = $1
        `,
        [req.user.id]
    );

    res.json(result.rows);
}

module.exports = {
    obtenerSalas,
    crearSala,
    obtenerSalasDisponibles,
    rateRoom,
    obtenerPromedioSala,
    agregarFavorito,
    quitarFavorito,
    misFavoritos
};