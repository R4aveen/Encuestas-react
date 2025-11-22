import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import CuadrillaIncidentsPage from '../pages/CuadrillaIncidentsPage';
import IncidentDetailPage from '../pages/IncidentDetailPage';
import AuthRequiredWrapper from '../components/router/AuthRequiredWrapper';
import { municipalPages } from '../config/pages.config';

import MainLayout from '../components/layout/MainLayout';
import DashboardPage from '../pages/DashboardPage';

const ContentRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path={municipalPages.loginPage.to} element={<LoginPage />} />

            <Route element={<AuthRequiredWrapper />}>
                <Route element={<MainLayout />}>
                    <Route path={municipalPages.dashboardPage.to} element={<DashboardPage />} />
                    <Route path={municipalPages.cuadrillaIncidentsPage.to} element={<CuadrillaIncidentsPage />} />
                    <Route path={municipalPages.incidentDetailPage.to} element={<IncidentDetailPage />} />
                    <Route path="/" element={<Navigate to={municipalPages.dashboardPage.to} replace />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to={municipalPages.loginPage.to} replace />} />
        </Routes>
    );
};

export default ContentRoutes;
