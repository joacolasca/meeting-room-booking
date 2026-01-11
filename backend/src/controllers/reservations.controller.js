const pool = require('../config/db');

async function crearReserva(req, res) {
    const { room_id, date, start_time, end_time } = req.body;
    const user_id = req.user.id;

    try {
        const conflicto = await pool.query(
            `
            SELECT id FROM reservations
            WHERE room_id = $1
            AND date = $2
            AND status = 'active'
            AND (
                $3 < end_time
                AND
                $4 > start_time
            )
            `,
            [room_id, date, start_time, end_time]
        );

        if (conflicto.rows.length > 0) {
            return res.status(400).json({
                error: 'La sala ya está reservada en ese horario'
            });
        }

        const result = await pool.query(
            `
            INSERT INTO reservations
            (user_id, room_id, date, start_time, end_time, status)
            VALUES ($1, $2, $3, $4, $5, 'active')
            RETURNING *
            `,
            [user_id, room_id, date, start_time, end_time]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
}

async function cancelarReserva(req, res) {
    const { id } = req.params;
    const user_id = req.user.id;

    await pool.query(
        `
        UPDATE reservations
        SET status = 'cancelled'
        WHERE id = $1 AND user_id = $2
        `,
        [id, user_id]
    );

    res.json({ mensaje: 'Reserva cancelada' });
}

async function obtenerReservas(req, res) {
    await actualizarReservasFinalizadas();
    const { role, id } = req.user;

    let query;
    let params;

    if (role === 'admin') {
        query = `
        SELECT * FROM reservations
        ORDER BY date, start_time
        `;
        params = [];
    } else {
        query = `
        SELECT * FROM reservations
        WHERE user_id = $1
        ORDER BY date, start_time
        `;
        params = [id];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
}

async function actualizarReservasFinalizadas() {
    await pool.query(
        `
        UPDATE reservations
        SET status = 'finished'
        WHERE status = 'active'
        AND (
            date < CURRENT_DATE
            OR
            (date = CURRENT_DATE AND end_time < CURRENT_TIME)
        )
        `
    );
}

module.exports = {
    crearReserva,
    cancelarReserva,
    obtenerReservas,
    actualizarReservasFinalizadas
};
