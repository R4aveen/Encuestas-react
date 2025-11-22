import React from 'react';
import { NavLink } from 'react-router-dom';
import { Offcanvas, Nav } from 'react-bootstrap';
import { municipalPages } from '../../config/pages.config';
import { HomeIcon, WrenchScrewdriverIcon, UserIcon } from '@heroicons/react/24/outline';

const iconMap: Record<string, React.ElementType> = {
    'HeroHome': HomeIcon,
    'HeroWrench': WrenchScrewdriverIcon,
    'HeroUser': UserIcon,
};

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

// Contenido del Menú (Reutilizable para Desktop y Móvil)
const SidebarContent = ({ closeMenu }: { closeMenu?: () => void }) => {
    const pages = Object.values(municipalPages).filter(page => page.id !== 'loginPage' && page.id !== 'incidentDetailPage');

    return (
        <div className="h-100 d-flex flex-column bg-white">
            {/* Logo / Título */}
            <div className="d-flex align-items-center justify-content-center border-bottom" style={{ height: '64px', minHeight: '64px' }}>
                <h5 className="fw-bold text-primary m-0">MuniGestión</h5>
            </div>

            {/* Links de Navegación */}
            <div className="flex-grow-1 py-3 px-2 overflow-auto">
                <Nav className="flex-column gap-1">
                    {pages.map((page) => {
                        const Icon = iconMap[page.icon] || HomeIcon;
                        return (
                            <NavLink
                                key={page.id}
                                to={page.to}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center rounded-3 px-3 py-2 fw-medium ${isActive
                                        ? 'bg-primary text-dark shadow-sm'
                                        : 'text-secondary hover-light'
                                    }`
                                }
                                style={({ isActive }) => ({
                                    backgroundColor: isActive ? 'var(--bs-primary)' : 'transparent',
                                    color: isActive ? '#000' : 'inherit',
                                    transition: 'all 0.2s'
                                })}
                            >
                                {/* IMPORTANTE: Tamaño fijo al icono para que no explote */}
                                <Icon style={{ width: '20px', height: '20px' }} className="me-3" />
                                {page.text}
                            </NavLink>
                        );
                    })}
                </Nav>
            </div>

            {/* Footer del Sidebar (Opcional) */}
            <div className="p-3 border-top text-center">
                <small className="text-muted">v1.0.0</small>
            </div>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    return (
        <>
            {/* Versión Desktop (Panel lateral fijo) */}
            <div className="d-none d-lg-block border-end shadow-sm" style={{ width: '260px', minWidth: '260px', zIndex: 100 }}>
                <SidebarContent />
            </div>

            {/* Versión Móvil (Offcanvas / Drawer) */}
            <Offcanvas show={isOpen} onHide={() => setIsOpen(false)} responsive="lg" className="d-lg-none border-0">
                <Offcanvas.Body className="p-0">
                    <SidebarContent closeMenu={() => setIsOpen(false)} />
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default Sidebar;