import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
        setError('Completá todos los campos');
        return;
        }

        try {
        const response = await fetch('http://localhost:3001/api/users/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || 'Error al iniciar sesión');
            return;
        }

        login(data.user, data.token);
        setError('');
        } catch (err) {
        setError('No se pudo conectar con el servidor');
        }
    };

    return (
        <div>
        <h2>Login</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
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

            <button type="submit">Ingresar</button>
        </form>
        </div>
    );
}

export default Login;
