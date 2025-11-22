import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Navbar, Container, Button, Dropdown } from 'react-bootstrap';

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    const { logout } = useAuth();

    return (
        <Navbar bg="white" className="border-bottom sticky-top" style={{ height: '64px', zIndex: 99 }}>
            <Container fluid className="px-3">
                <Button
                    variant="light"
                    className="d-lg-none me-3 p-1 border-0 bg-transparent text-secondary"
                    onClick={toggleSidebar}
                >
                    <Bars3Icon style={{ width: '28px', height: '28px' }} />
                </Button>

                <div className="me-auto"></div>

                <div className="d-flex align-items-center">
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="light" id="user-dropdown" className="d-flex align-items-center gap-2 border-0 bg-transparent text-dark p-1 no-arrow">
                            <span className="d-none d-md-block fw-medium small">Usuario</span>
                            <div className="bg-light rounded-circle p-1 border">
                                <UserCircleIcon style={{ width: '24px', height: '24px' }} className="text-secondary" />
                            </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow-sm border-0 mt-2 rounded-3">
                            <Dropdown.Item onClick={logout} className="text-danger small fw-medium">
                                Cerrar Sesión
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Container>
        </Navbar>
    );
};

export default Header;