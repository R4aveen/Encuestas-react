import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CuadrillaService } from '../services/cuadrilla.service';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const IncidentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [incident, setIncident] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [comentario, setComentario] = useState('');
    const [evidenciaUrl, setEvidenciaUrl] = useState('');
    const [resolving, setResolving] = useState(false);

    useEffect(() => {
        const fetchIncident = async () => {
            try {
                setLoading(true);
                const data = await CuadrillaService.getIncidenciaById(Number(id));


                if (data) {
                    setIncident(data);
                } else {
                    setError('Incidencia no encontrada');
                }
            } catch (err: any) {
                console.error('Error fetching incident:', err);
                setError('Error al cargar la incidencia');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchIncident();
        }
    }, [id]);

    const handleResolve = async () => {
        if (!comentario.trim()) {
            alert('Por favor ingrese un comentario');
            return;
        }

        try {
            setResolving(true);
            await CuadrillaService.resolverIncidencia(Number(id), {
                evidencia_urls: evidenciaUrl ? [evidenciaUrl] : [],
                comentario
            });
            alert('Incidencia resuelta exitosamente');
            navigate('/cuadrilla/incidencias');
        } catch (err: any) {
            console.error('Error resolving incident:', err);
            alert('Error al resolver la incidencia');
        } finally {
            setResolving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-text-paragraph">Cargando incidencia...</div>
            </div>
        );
    }

    if (error || !incident) {
        return (
            <div className="p-4">
                <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    {error || 'Incidencia no encontrada'}
                </div>
                <button
                    onClick={() => navigate('/cuadrilla/incidencias')}
                    className="mt-4 px-4 py-2 bg-primary text-primary-text rounded-md hover:opacity-90"
                >
                    Volver a la lista
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <button
                    onClick={() => navigate('/cuadrilla/incidencias')}
                    className="flex items-center text-text-paragraph hover:text-text-headline"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Volver a la lista
                </button>
            </div>

            <div className="bg-white shadow rounded-lg border border-highlight p-6">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold text-text-headline">
                        Incidencia #{incident.id}
                    </h1>
                    {incident.estado === 'en_proceso' && (
                        <button
                            onClick={() => setShowResolveModal(true)}
                            className="px-4 py-2 bg-primary text-primary-text rounded-md hover:opacity-90 font-bold"
                        >
                            Resolver
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-text-paragraph mb-1">Título</h3>
                        <p className="text-lg text-text-headline">{incident.titulo}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-text-paragraph mb-1">Estado</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${incident.estado === 'en_proceso' ? 'bg-yellow-100 text-yellow-800' :
                            incident.estado === 'finalizada' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {incident.estado}
                        </span>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-text-paragraph mb-1">Fecha de Creación</h3>
                        <p className="text-text-headline">{incident.fecha_creacion || 'N/A'}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-text-paragraph mb-1">Cuadrilla</h3>
                        <p className="text-text-headline">{incident.cuadrilla?.nombre || 'N/A'}</p>
                    </div>

                    {incident.descripcion && (
                        <div className="md:col-span-2">
                            <h3 className="text-sm font-medium text-text-paragraph mb-1">Descripción</h3>
                            <p className="text-text-headline">{incident.descripcion}</p>
                        </div>
                    )}

                    {incident.ubicacion && (
                        <div className="md:col-span-2">
                            <h3 className="text-sm font-medium text-text-paragraph mb-1">Ubicación</h3>
                            <p className="text-text-headline">{incident.ubicacion}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Resolve Modal */}
            {showResolveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-text-headline">
                                Resolver Incidencia #{incident.id}
                            </h2>
                            <button
                                onClick={() => setShowResolveModal(false)}
                                className="text-text-paragraph hover:text-text-headline"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-paragraph mb-1">
                                    Comentario *
                                </label>
                                <textarea
                                    value={comentario}
                                    onChange={(e) => setComentario(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary border-gray-300"
                                    rows={4}
                                    placeholder="Describa el trabajo realizado..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-paragraph mb-1">
                                    URL Evidencia (Mock)
                                </label>
                                <input
                                    type="text"
                                    value={evidenciaUrl}
                                    onChange={(e) => setEvidenciaUrl(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary border-gray-300"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowResolveModal(false)}
                                    className="px-4 py-2 text-text-paragraph hover:bg-gray-100 rounded-md"
                                    disabled={resolving}
                                >
                                    CANCELAR
                                </button>
                                <button
                                    onClick={handleResolve}
                                    disabled={resolving}
                                    className="px-4 py-2 bg-primary text-primary-text rounded-md hover:opacity-90 font-bold disabled:opacity-50"
                                >
                                    {resolving ? 'GUARDANDO...' : 'GUARDAR RESOLUCIÓN'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncidentDetailPage;
