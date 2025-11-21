import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CuadrillaService } from '../services/cuadrilla.service';

interface Incidencia {
    id: number;
    titulo: string;
    descripcion: string;
    estado: string;
    fecha_creacion: string;
}

const CuadrillaIncidentsPage: React.FC = () => {
    const navigate = useNavigate();
    const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIncidencia, setSelectedIncidencia] = useState<Incidencia | null>(null);
    const [comentario, setComentario] = useState('');
    const [evidenciaUrl, setEvidenciaUrl] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadIncidencias();
    }, []);

    const loadIncidencias = async () => {
        try {
            const data = await CuadrillaService.getIncidencias();
            setIncidencias(data);
        } catch (error) {
            console.error('Error loading incidencias', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolverClick = (incidencia: Incidencia) => {
        setSelectedIncidencia(incidencia);
        setShowModal(true);
    };

    const handleResolverSubmit = async () => {
        if (!selectedIncidencia) return;

        try {
            await CuadrillaService.resolverIncidencia(selectedIncidencia.id, {
                comentario,
                evidencia_urls: [evidenciaUrl]
            });
            setShowModal(false);
            setComentario('');
            setEvidenciaUrl('');
            loadIncidencias();
        } catch (error) {
            console.error('Error resolving incidencia', error);
            alert('Error al resolver la incidencia');
        }
    };

    return (
        <div className="p-6 bg-background-page min-h-screen">
            <h1 className="text-3xl font-bold text-text-headline mb-6">Incidencias Asignadas</h1>

            {loading ? (
                <div className="text-center">Cargando...</div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow border border-highlight">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-background-secondary">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-headline uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-headline uppercase tracking-wider">Título</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-headline uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-headline uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-headline uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {incidencias.map((incidencia) => (
                                <tr key={incidencia.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-paragraph">{incidencia.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-paragraph">{incidencia.titulo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-paragraph">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${incidencia.estado === 'RESUELTA' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {incidencia.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-paragraph">{new Date(incidencia.fecha_creacion).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => navigate(`/cuadrilla/incidencias/${incidencia.id}`)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Ver Detalle
                                        </button>
                                        <button
                                            onClick={() => handleResolverClick(incidencia)}
                                            className="text-primary-text bg-primary hover:opacity-80 px-3 py-1 rounded-md"
                                        >
                                            Resolver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
                    <div className="relative w-full max-w-lg mx-auto my-6">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t bg-background-secondary">
                                <h3 className="text-xl font-semibold text-text-headline">
                                    Resolver Incidencia #{selectedIncidencia?.id}
                                </h3>
                                <button
                                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    onClick={() => setShowModal(false)}
                                >
                                    <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                                </button>
                            </div>
                            <div className="relative p-6 flex-auto">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-text-paragraph mb-2">Comentario</label>
                                    <textarea
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        rows={3}
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-text-paragraph mb-2">URL Evidencia (Mock)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={evidenciaUrl}
                                        onChange={(e) => setEvidenciaUrl(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                                <button
                                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="bg-primary text-primary-text font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={handleResolverSubmit}
                                >
                                    Guardar Resolución
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CuadrillaIncidentsPage;
