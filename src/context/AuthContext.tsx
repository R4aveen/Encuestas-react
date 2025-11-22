import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

interface AuthContextType {
    token: string | null;
    login: (user: string, pass: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const login = async (username: string, pass: string) => {
        try {
            const response = await axios.post('/api/auth/token/', {
                username,
                password: pass
            });

            const newToken = response.data.token;
            setToken(newToken);
            localStorage.setItem('token', newToken);
        } catch (error: any) {
            console.error('Login failed', error);

            if (error.response) {
                if (error.response.data?.non_field_errors) {
                    throw new Error(error.response.data.non_field_errors[0]);
                }
                else if (error.response.data?.detail) {
                    throw new Error(error.response.data.detail);
                }
                else {
                    throw new Error('Credenciales inválidas');
                }
            } else if (error.request) {
                throw new Error('No se pudo conectar con el servidor');
            } else {
                throw new Error('Error al iniciar sesión');
            }
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
