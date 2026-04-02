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

async function obtenerSalaPorId(req, res) {
    const { id } = req.params;
    try {
        const roomResult = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
        if (roomResult.rows.length === 0) {
            return res.status(404).json({ error: 'Sala no encontrada' });
        }

        const ratingResult = await pool.query(
            'SELECT AVG(rating) as average, COUNT(*) as count FROM room_ratings WHERE room_id = $1',
            [id]
        );

        const upcomingResult = await pool.query(
            `SELECT r.*, u.name as user_name FROM reservations r
             LEFT JOIN users u ON u.id = r.user_id
             WHERE r.room_id = $1 AND r.status = 'active' AND (r.date > CURRENT_DATE OR (r.date = CURRENT_DATE AND r.end_time > CURRENT_TIME))
             ORDER BY r.date, r.start_time LIMIT 10`,
            [id]
        );

        const room = roomResult.rows[0];
        const avg = ratingResult.rows[0].average !== null ? parseFloat(ratingResult.rows[0].average) : null;
        const count = parseInt(ratingResult.rows[0].count, 10);

        res.json({
            ...room,
            rating: { average: avg, count },
            upcoming_reservations: upcomingResult.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la sala' });
    }
}

async function crearSala(req, res) {
    const { nombre, capacidad } = req.body;

    try {
        const result = await pool.query(
        'INSERT INTO rooms (name, capacity) VALUES ($1, $2) RETURNING *',
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

async function editarSala(req, res) {
    const { id } = req.params;
    const { nombre, capacidad } = req.body;

    try {
        const result = await pool.query(
            'UPDATE rooms SET name = COALESCE($1, name), capacity = COALESCE($2, capacity) WHERE id = $3 RETURNING *',
            [nombre, capacidad, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sala no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al editar sala' });
    }
}

async function eliminarSala(req, res) {
    const { id } = req.params;

    try {
        await pool.query("UPDATE reservations SET status = 'cancelled' WHERE room_id = $1 AND status = 'active'", [id]);
        await pool.query('DELETE FROM room_ratings WHERE room_id = $1', [id]);
        await pool.query('DELETE FROM favorite_rooms WHERE room_id = $1', [id]);
        await pool.query('DELETE FROM rooms WHERE id = $1', [id]);
        res.json({ mensaje: 'Sala eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar sala' });
    }
}

async function obtenerTodasReservas(req, res) {
    try {
        const result = await pool.query(
            `SELECT r.*, u.name as user_name, u.email as user_email, rm.name as room_name
             FROM reservations r
             LEFT JOIN users u ON u.id = r.user_id
             LEFT JOIN rooms rm ON rm.id = r.room_id
             ORDER BY r.date DESC, r.start_time DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
}

async function cancelarReservaAdmin(req, res) {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "UPDATE reservations SET status = 'cancelled' WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.json({ mensaje: 'Reserva cancelada por admin' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cancelar reserva' });
    }
}

module.exports = {
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
};