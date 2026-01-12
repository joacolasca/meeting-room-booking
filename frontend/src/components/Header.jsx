import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Header() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav>
        { !user ? (
            <>
                <Link to="/login">Login</Link>
                {' | '}
                <Link to="/register">Registro</Link>
            </>
        ) : (
            <>
                <Link to="/rooms">Salas</Link>
                {' | '}
                <span>Hola {user.name}</span>
                {' | '}
                <button onClick={logout}>Salir</button>
            </>
        )}
        </nav>
    );
}

export default Header;
