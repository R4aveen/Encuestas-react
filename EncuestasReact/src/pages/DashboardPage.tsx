import React, { useEffect, useState } from 'react';
import { ChartBarIcon, UserGroupIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { CuadrillaService } from '../services/cuadrilla.service';

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState({
        total: 0,
        pendientes: 0,
        resueltas: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await CuadrillaService.getEstadisticas();
                setStats(data);
            } catch (err: any) {
                console.error('Error fetching statistics:', err);
                setError('Error al cargar las estadísticas');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statsDisplay = [
        { name: 'Incidencias Totales', value: stats.total.toString(), icon: ClipboardDocumentCheckIcon, color: 'bg-blue-500' },
        { name: 'Pendientes', value: stats.pendientes.toString(), icon: ChartBarIcon, color: 'bg-yellow-500' },
        { name: 'Resueltas', value: stats.resueltas.toString(), icon: UserGroupIcon, color: 'bg-green-500' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-text-paragraph">Cargando estadísticas...</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-headline mb-8">Dashboard</h1>

            {error && (
                <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {statsDisplay.map((item) => (
                    <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg border border-highlight">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <item.icon className={`h-6 w-6 text-white p-1 rounded-md ${item.color}`} aria-hidden="true" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-text-paragraph truncate">{item.name}</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-text-headline">{item.value}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-white shadow rounded-lg border border-highlight p-6">
                <h2 className="text-lg font-medium text-text-headline mb-4">Bienvenido al Sistema de Gestión</h2>
                <p className="text-text-paragraph">
                    Seleccione una opción del menú lateral para comenzar a gestionar las incidencias municipales.
                </p>
            </div>
        </div>
    );
};

export default DashboardPage;
