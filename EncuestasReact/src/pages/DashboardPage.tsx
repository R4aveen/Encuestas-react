import React, { useEffect, useState } from 'react';
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend 
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { 
    ChartBarIcon, 
    CheckCircleIcon, 
    ClipboardDocumentListIcon, 
    ClockIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { CuadrillaService } from '../services/cuadrilla.service';

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, pendientes: 0, resueltas: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await CuadrillaService.getEstadisticas();
                setStats(data);
            } catch (err: any) {
                console.error('Error:', err);
                setError('No se pudieron cargar los datos del dashboard.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Configuración de datos para el Gráfico
    const chartData = {
        labels: ['Pendientes', 'Finalizadas', 'Otros/Rechazadas'],
        datasets: [
            {
                label: '# de Incidencias',
                data: [
                    stats.pendientes, 
                    stats.resueltas, 
                    stats.total - (stats.pendientes + stats.resueltas) // Calculamos el resto
                ],
                backgroundColor: [
                    '#F59E0B', // Amber-500 (Pendientes)
                    '#10B981', // Emerald-500 (Finalizadas)
                    '#94A3B8', // Slate-400 (Otros)
                ],
                borderColor: [
                    '#ffffff',
                    '#ffffff',
                    '#ffffff',
                ],
                borderWidth: 2,
                hoverOffset: 4
            },
        ],
    };

    // Opciones visuales del gráfico
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    }
                }
            }
        },
        cutout: '70%', // Hace la dona más fina y elegante
    };

    // Tarjetas de estadísticas superiores
    const statCards = [
        { 
            title: 'Total Asignadas', 
            value: stats.total, 
            icon: ClipboardDocumentListIcon, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50',
            desc: 'Incidencias históricas'
        },
        { 
            title: 'En Proceso', 
            value: stats.pendientes, 
            icon: ClockIcon, 
            color: 'text-amber-600', 
            bg: 'bg-amber-50',
            desc: 'Requieren atención inmediata'
        },
        { 
            title: 'Finalizadas', 
            value: stats.resueltas, 
            icon: CheckCircleIcon, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50',
            desc: 'Trabajos completados'
        },
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            {/* Título */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Operativo</h1>
                <p className="text-gray-500 mt-1">Resumen de actividad y métricas de rendimiento.</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded shadow-sm">
                    <p>{error}</p>
                </div>
            )}

            {/* 1. Tarjetas de KPIs (Top) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow duration-300">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                            <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* 2. Sección Principal: Gráfico + Acciones */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Columna Izquierda: Gráfico */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-1">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                        <ChartBarIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Distribución de Estado
                    </h2>
                    <div className="h-64 w-full relative">
                        <Doughnut data={chartData} options={chartOptions} />
                        {/* Texto central en la dona */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-800">{stats.total}</span>
                            <span className="text-xs text-gray-400 uppercase">Total</span>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Bienvenida y Accesos Rápidos */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white relative overflow-hidden lg:col-span-2 flex flex-col justify-center">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Gestión de Cuadrillas</h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-xl">
                            Bienvenido al panel de control. Desde aquí puedes monitorear el progreso de las tareas asignadas en tiempo real y actualizar el estado de las incidencias.
                        </p>
                        
                        <button 
                            onClick={() => navigate('/cuadrilla/incidencias')}
                            className="group bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-50 transition-all flex items-center w-max"
                        >
                            Ver Listado de Incidencias
                            <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Elementos decorativos de fondo */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white opacity-10 blur-2xl"></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;