import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    const { logout } = useAuth();

    return (
        <header className="bg-white border-b border-highlight h-16 flex items-center justify-between px-4 lg:px-6">
            <button
                className="lg:hidden p-2 rounded-md text-text-paragraph hover:bg-background-secondary focus:outline-none"
                onClick={toggleSidebar}
            >
                <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex-1 flex justify-end items-center">
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-text-paragraph hidden sm:block">
                        Usuario
                    </span>
                    <button
                        onClick={logout}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
