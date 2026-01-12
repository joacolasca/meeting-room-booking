import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            return null;
        }
    });

    const login = (userData) => {
        setUser(userData);
        try {
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}
