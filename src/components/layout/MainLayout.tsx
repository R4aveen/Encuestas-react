import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="d-flex vh-100 overflow-hidden bg-light">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="d-flex flex-column flex-grow-1 w-100 overflow-hidden position-relative">
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                <main className="flex-grow-1 overflow-auto p-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;