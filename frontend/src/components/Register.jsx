import { useState } from 'react';

function Register() {
    const [nombre, setnombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || !email || !password) {
        setError('Completá todos los campos');
        return;
        }

        try {
        const response = await fetch(
            'http://localhost:3001/api/users/register',
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email, password })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || 'Error al registrarse');
            return;
        }

        setSuccess('Usuario creado correctamente');
        setError('');
        setnombre('');
        setEmail('');
        setPassword('');
        } catch (err) {
        setError('No se pudo conectar con el servidor');
        }
    };

    return (
        <div>
        <h2>Registro</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <form onSubmit={handleSubmit}>
            <input
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setnombre(e.target.value)}
            />

            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Registrarse</button>
        </form>
        </div>
    );
}

export default Register;
