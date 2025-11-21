import React from 'react';
import { NavLink } from 'react-router-dom';
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

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const pages = Object.values(municipalPages).filter(page => page.id !== 'loginPage');

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-highlight transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-center h-16 bg-background-secondary border-b border-highlight">
                    <h1 className="text-xl font-bold text-text-headline">MuniGestión</h1>
                </div>

                <nav className="mt-5 px-2 space-y-1">
                    {pages.map((page) => {
                        const Icon = iconMap[page.icon] || HomeIcon;
                        return (
                            <NavLink
                                key={page.id}
                                to={page.to}
                                className={({ isActive }) =>
                                    `group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${isActive
                                        ? 'bg-primary text-primary-text'
                                        : 'text-text-paragraph hover:bg-background-secondary hover:text-text-headline'
                                    }`
                                }
                                onClick={() => setIsOpen(false)}
                            >
                                <Icon className="mr-4 h-6 w-6 flex-shrink-0" aria-hidden="true" />
                                {page.text}
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
