import { useEffect, useState } from 'react';

function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
        const token = localStorage.getItem('token');

        const response = await fetch(
            'http://localhost:3001/api/rooms',
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || 'Error al cargar salas');
            return;
        }

        setRooms(data);
        } catch (err) {
        setError('No se pudo conectar con el servidor');
        }
    };

    return (
        <div>
        <h2>Salas disponibles</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {rooms.length === 0 && <p>No hay salas</p>}

        <ul>
            {rooms.map((room) => (
            <li key={room.id}>
                <strong>{room.nombre}</strong> – Capacidad: {room.capacidad}
            </li>
            ))}
        </ul>
        </div>
    );
}

export default Rooms;
