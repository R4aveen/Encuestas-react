import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

// Componentes UI
import UiButton from '../components/ui/UiButton';
import UiField from '../components/ui/UiField';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Credenciales inválidas. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <Container style={{ maxWidth: '420px' }}>
                <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                    {/* Header Decorativo */}
                    <div className="bg-primary p-4 text-center">
                        <div className="bg-white bg-opacity-25 rounded-circle p-3 d-inline-flex mb-2">
                            <UserCircleIcon className="text-white" style={{ width: '48px', height: '48px' }} />
                        </div>
                        <h3 className="fw-bold text-white mb-0">MuniGestión</h3>
                        <p className="text-white text-opacity-75 small mb-0">Acceso a Cuadrillas</p>
                    </div>

                    <Card.Body className="p-5">
                        <h4 className="text-center fw-bold text-dark mb-4">Iniciar Sesión</h4>

                        {error && (
                            <Alert variant="danger" className="border-0 shadow-sm text-center small py-2 mb-4">
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <UiField
                                    label="Usuario"
                                    type="text"
                                    placeholder="Ej: jdoe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <UiField
                                    label="Contraseña"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <UiButton
                                type="submit"
                                loading={loading}
                                isBlock
                                className="py-3 fs-6 shadow-sm"
                            >
                                Ingresar al Sistema
                            </UiButton>
                        </form>
                    </Card.Body>

                    <Card.Footer className="bg-light text-center py-3 border-0">
                        <small className="text-muted">© 2025 Municipalidad</small>
                    </Card.Footer>
                </Card>
            </Container>
        </div>
    );
};

export default LoginPage;