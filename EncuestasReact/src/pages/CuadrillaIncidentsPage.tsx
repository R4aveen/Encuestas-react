import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CuadrillaService } from '../services/cuadrilla.service';
import { 
    MagnifyingGlassIcon, 
    ChevronRightIcon, 
    MapPinIcon, 
    CalendarIcon 
} from '@heroicons/react/24/outline';

interface Incidencia {
    id: number;
    titulo: string;
    descripcion: string;
    estado: string;
    creadoEl: string;
    ubicacion?: string; // Asumiendo que viene del backend
}

const CuadrillaIncidentsPage: React.FC = () => {
    const navigate = useNavigate();
    const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
    const [filteredIncidencias, setFilteredIncidencias] = useState<Incidencia[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadIncidencias();
    }, []);

    useEffect(() => {
        // Lógica de filtrado en cliente
        const filtered = incidencias.filter(inc => 
            inc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inc.id.toString().includes(searchTerm) ||
            inc.estado.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredIncidencias(filtered);
    }, [searchTerm, incidencias]);

    const loadIncidencias = async () => {
        try {
            const data = await CuadrillaService.getIncidencias();
            setIncidencias(data);
            setFilteredIncidencias(data);
        } catch (error) {
            console.error('Error loading incidencias', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Helper para estilos de estado
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'finalizada':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'en_proceso':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rechazada':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        return status.replace('_', ' ').toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Incidencias Asignadas</h1>
                        <p className="text-gray-500 mt-1">Gestiona el trabajo diario de tu cuadrilla</p>
                    </div>
                    
                    <div className="relative w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out shadow-sm"
                            placeholder="Buscar por ID, título o estado..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredIncidencias.length > 0 ? (
                                        filteredIncidencias.map((incidencia) => (
                                            <tr 
                                                key={incidencia.id} 
                                                className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                                onClick={() => navigate(`/cuadrilla/incidencias/${incidencia.id}`)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{incidencia.id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-gray-900">{incidencia.titulo}</span>
                                                        {incidencia.ubicacion && (
                                                            <span className="flex items-center text-xs text-gray-500 mt-1">
                                                                <MapPinIcon className="h-3 w-3 mr-1" />
                                                                {incidencia.ubicacion}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusStyle(incidencia.estado)}`}>
                                                        {getStatusLabel(incidencia.estado)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                                                        {formatDate(incidencia.creadoEl)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button 
                                                        className="text-gray-400 hover:text-blue-600 group-hover:translate-x-1 transition-transform"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/cuadrilla/incidencias/${incidencia.id}`);
                                                        }}
                                                    >
                                                        <ChevronRightIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                No se encontraron incidencias que coincidan con tu búsqueda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CuadrillaIncidentsPage;