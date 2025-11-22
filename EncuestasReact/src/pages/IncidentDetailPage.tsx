import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CuadrillaService } from '../services/cuadrilla.service';
import { 
    ArrowLeftIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    ExclamationTriangleIcon, 
    MapPinIcon,
    CalendarIcon,
    DocumentTextIcon,
    CameraIcon,
    PlayIcon,
    XMarkIcon,
    CheckIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';

// --- 1. COMPONENTE: MODAL DE NOTIFICACIÓN (Success/Error) ---
const AlertModal: React.FC<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    onClose: () => void;
}> = ({ isOpen, type, title, message, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] transition-opacity">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transform scale-100 transition-transform border border-gray-100">
                <div className="flex flex-col items-center text-center">
                    {type === 'success' ? (
                        <div className="bg-green-100 p-3 rounded-full mb-4">
                            <CheckCircleIcon className="h-10 w-10 text-green-600" />
                        </div>
                    ) : (
                        <div className="bg-red-100 p-3 rounded-full mb-4">
                            <XCircleIcon className="h-10 w-10 text-red-600" />
                        </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-500 mb-6 leading-relaxed">{message}</p>
                    <button
                        onClick={onClose}
                        className={`px-6 py-2.5 rounded-xl text-white font-semibold w-full transition-colors shadow-md ${
                            type === 'success' ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                        }`}
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 2. COMPONENTE: MODAL DE CONFIRMACIÓN (Yes/No) ---
const ConfirmModal: React.FC<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}> = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirmar", cancelText = "Cancelar", isDestructive = false }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-yellow-50 p-3 rounded-full mb-4">
                        <ExclamationTriangleIcon className="h-10 w-10 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-500 mb-6 leading-relaxed">{message}</p>
                    <div className="flex space-x-3 w-full">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2.5 text-white rounded-xl font-semibold shadow-md transition-colors ${
                                isDestructive ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 3. PÁGINA PRINCIPAL ---
const IncidentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [incident, setIncident] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // UI State (Modals)
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    
    // Notification & Confirm State
    const [notification, setNotification] = useState({ isOpen: false, type: 'success' as 'success'|'error', title: '', message: '' });
    const [confirmData, setConfirmData] = useState<{isOpen: boolean, title: string, message: string, action: () => void} | null>(null);

    // Form Data State
    const [comentarioFinal, setComentarioFinal] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [evidenciaFiles, setEvidenciaFiles] = useState<File[]>([]);

    const [processing, setProcessing] = useState(false);

    // --- Helpers ---
    const notify = (type: 'success'|'error', title: string, message: string) => {
        setNotification({ isOpen: true, type, title, message });
    };
    const closeConfirm = () => setConfirmData(null);

    // --- Fetching ---
    const fetchIncident = async () => {
        try {
            setLoading(true);
            const data = await CuadrillaService.getIncidenciaById(Number(id));
            setIncident(data);
        } catch (err) {
            setError('No se pudo cargar la incidencia.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if(id) fetchIncident(); }, [id]);

    // --- Handlers (Actions) ---
    const handleStartClick = () => {
        setConfirmData({
            isOpen: true,
            title: '¿Iniciar Trabajo?',
            message: 'El estado cambiará a "En Proceso" y se notificará el inicio de labores.',
            action: async () => {
                try {
                    setProcessing(true);
                    closeConfirm();
                    await CuadrillaService.iniciarIncidencia(Number(id));
                    await fetchIncident();
                    notify('success', 'Trabajo Iniciado', 'La incidencia ahora está en proceso.');
                } catch (error) {
                    notify('error', 'Error', 'No se pudo iniciar la incidencia.');
                } finally {
                    setProcessing(false);
                }
            }
        });
    };

    const handleUploadEvidence = async () => {
        if (evidenciaFiles.length === 0) {
            notify('error', 'Sin archivos', 'Selecciona al menos una foto.');
            return;
        }
        try {
            setProcessing(true);
            const formData = new FormData();
            evidenciaFiles.forEach(file => formData.append('evidencias', file));
            await CuadrillaService.subirEvidencia(Number(id), formData);
            setShowUploadModal(false);
            setEvidenciaFiles([]);
            await fetchIncident();
            notify('success', 'Evidencia Subida', 'Las fotos se han guardado correctamente.');
        } catch (error) {
            notify('error', 'Error', 'Falló la subida de archivos.');
        } finally {
            setProcessing(false);
        }
    };

    const handleFinalizeAction = async () => {
        if (!comentarioFinal.trim()) {
            notify('error', 'Campo Requerido', 'Por favor escribe un comentario de cierre.');
            return;
        }
        if (!incident.multimedias || incident.multimedias.length === 0) {
            notify('error', 'Faltan Evidencias', 'Es obligatorio subir fotos antes de finalizar.');
            return;
        }
        try {
            setProcessing(true);
            await CuadrillaService.finalizarIncidencia(Number(id), comentarioFinal);
            setShowFinalizeModal(false);
            setComentarioFinal('');
            notify('success', '¡Tarea Completada!', 'La incidencia ha sido finalizada exitosamente.');
            await fetchIncident();
        } catch (error) {
            notify('error', 'Error', 'No se pudo finalizar la incidencia.');
        } finally {
            setProcessing(false);
        }
    };

    const handleRejectAction = async () => {
        if (!rejectReason.trim()) {
            notify('error', 'Campo Requerido', 'Debes indicar el motivo del rechazo.');
            return;
        }
        try {
            setProcessing(true);
            await CuadrillaService.rechazarIncidencia(Number(id), { motivo_rechazo: rejectReason });
            setShowRejectModal(false);
            notify('success', 'Incidencia Rechazada', 'El estado ha sido actualizado.');
            setTimeout(() => navigate('/cuadrilla/incidencias'), 2000);
        } catch (error) {
            notify('error', 'Error', 'No se pudo rechazar.');
        } finally {
            setProcessing(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setEvidenciaFiles(p => [...p, ...Array.from(e.target.files!)]);
    };
    const removeFile = (i: number) => setEvidenciaFiles(p => p.filter((_, idx) => idx !== i));

    // --- Styles Helper ---
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'finalizada': return 'bg-green-100 text-green-800 border-green-200 ring-green-500';
            case 'en_proceso': return 'bg-yellow-100 text-yellow-800 border-yellow-200 ring-yellow-500';
            case 'rechazada': return 'bg-red-100 text-red-800 border-red-200 ring-red-500';
            default: return 'bg-gray-100 text-gray-800 border-gray-200 ring-gray-500';
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    if (error || !incident) return <div className="p-8 text-center text-red-600 bg-red-50 rounded m-4">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 p-6 md:p-8">
            {/* GLOBAL MODALS */}
            <AlertModal isOpen={notification.isOpen} type={notification.type} title={notification.title} message={notification.message} onClose={() => setNotification(p => ({...p, isOpen: false}))} />
            <ConfirmModal isOpen={!!confirmData} title={confirmData?.title || ''} message={confirmData?.message || ''} onConfirm={confirmData?.action || (() => {})} onCancel={closeConfirm} />

            {/* HEADER NAVIGATION */}
            <div className="max-w-6xl mx-auto mb-6">
                <button 
                    onClick={() => navigate('/cuadrilla/incidencias')} 
                    className="group flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium mb-4"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al listado
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">Incidencia #{incident.id}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(incident.estado)}`}>
                                {incident.estado.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            Creada el {new Date(incident.creadoEl).toLocaleDateString()}
                        </p>
                    </div>

                    {/* ACTION BUTTONS BAR */}
                    <div className="flex flex-wrap gap-3">
                        {incident.estado === 'pendiente' && (
                            <button 
                                onClick={handleStartClick}
                                disabled={processing}
                                className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                {processing ? <span className="animate-pulse">Procesando...</span> : <><PlayIcon className="h-5 w-5 mr-2" /> Iniciar Trabajo</>}
                            </button>
                        )}

                        {incident.estado === 'en_proceso' && (
                            <>
                                <button 
                                    onClick={() => setShowRejectModal(true)}
                                    className="flex items-center bg-white border border-red-200 text-red-600 px-4 py-2.5 rounded-xl font-medium hover:bg-red-50 transition-colors"
                                >
                                    <XMarkIcon className="h-5 w-5 mr-2" /> Rechazar
                                </button>
                                <button 
                                    onClick={() => setShowUploadModal(true)}
                                    className="flex items-center bg-white border border-blue-200 text-blue-600 px-4 py-2.5 rounded-xl font-medium hover:bg-blue-50 transition-colors"
                                >
                                    <CameraIcon className="h-5 w-5 mr-2" /> Subir Fotos
                                </button>
                                <button 
                                    onClick={() => setShowFinalizeModal(true)}
                                    className="flex items-center bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 shadow-lg shadow-green-200 transition-all"
                                >
                                    <CheckIcon className="h-5 w-5 mr-2" /> Finalizar Tarea
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: DETAILS */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500" />
                            Detalles de la Incidencia
                        </h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Título del Problema</label>
                                <p className="text-xl font-medium text-gray-900 mt-1">{incident.titulo}</p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Descripción</label>
                                <p className="text-gray-700 leading-relaxed">{incident.descripcion}</p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="bg-blue-50 p-2 rounded-lg">
                                    <MapPinIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ubicación</label>
                                    <p className="text-gray-900 font-medium">{incident.ubicacion || incident.direccion?.nombre_direccion || 'Ubicación no especificada'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* REJECTION NOTE IF EXISTS */}
                    {incident.motivo_rechazo && (
                        <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
                            <h3 className="text-red-800 font-bold flex items-center mb-2">
                                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                                Nota de Resolución / Rechazo
                            </h3>
                            <p className="text-red-700">{incident.motivo_rechazo}</p>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: EVIDENCE */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <PhotoIcon className="h-5 w-5 mr-2 text-blue-500" />
                            Galería de Evidencias
                        </h2>

                        {incident.multimedias && incident.multimedias.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {incident.multimedias.map((media: any) => (
                                    <a 
                                        key={media.id} 
                                        href={media.url} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 cursor-zoom-in"
                                    >
                                        <img 
                                            src={media.url} 
                                            alt="evidencia" 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="bg-white/90 p-1.5 rounded-full shadow-sm">
                                                <ArrowLeftIcon className="h-4 w-4 text-gray-900 rotate-180" />
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                <PhotoIcon className="h-12 w-12 text-gray-300 mb-3" />
                                <p className="text-gray-500 font-medium">Sin evidencias aún</p>
                                <p className="text-sm text-gray-400 mt-1">Usa el botón "Subir Fotos" para agregar pruebas del trabajo.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- ACTION MODALS --- */}

            {/* 1. UPLOAD MODAL */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-blue-600 p-5 flex items-center justify-between">
                            <h3 className="text-white font-bold text-lg flex items-center"><CameraIcon className="h-6 w-6 mr-2"/> Subir Evidencias</h3>
                            <button onClick={() => {setShowUploadModal(false); setEvidenciaFiles([]);}} className="text-blue-100 hover:text-white"><XMarkIcon className="h-6 w-6"/></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl p-8 text-center hover:bg-blue-100 transition-colors cursor-pointer relative group">
                                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                    <CameraIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <p className="text-blue-900 font-medium">Haz clic para seleccionar fotos</p>
                                <p className="text-blue-600 text-sm mt-1">JPG, PNG permitidos</p>
                            </div>

                            {evidenciaFiles.length > 0 && (
                                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-100">
                                    {evidenciaFiles.map((f, i) => (
                                        <div key={i} className="bg-white text-xs px-3 py-1.5 rounded-full flex items-center border border-gray-200 shadow-sm">
                                            <span className="truncate max-w-[120px]">{f.name}</span>
                                            <button onClick={() => removeFile(i)} className="ml-2 text-red-500 hover:text-red-700"><XMarkIcon className="h-3 w-3"/></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <button 
                                onClick={handleUploadEvidence} 
                                disabled={processing || evidenciaFiles.length === 0}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all"
                            >
                                {processing ? 'Subiendo...' : `Subir ${evidenciaFiles.length > 0 ? evidenciaFiles.length : ''} Foto(s)`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. FINALIZE MODAL */}
            {showFinalizeModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-green-600 p-5 flex items-center justify-between">
                            <h3 className="text-white font-bold text-lg flex items-center"><CheckIcon className="h-6 w-6 mr-2"/> Finalizar Incidencia</h3>
                            <button onClick={() => setShowFinalizeModal(false)} className="text-green-100 hover:text-white"><XMarkIcon className="h-6 w-6"/></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm border border-green-100 flex items-start">
                                <CheckCircleIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-green-600"/>
                                <span>Asegúrate de haber subido todas las fotos necesarias antes de finalizar.</span>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Comentario de Cierre *</label>
                                <textarea 
                                    value={comentarioFinal}
                                    onChange={(e) => setComentarioFinal(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
                                    rows={4}
                                    placeholder="Describe brevemente la solución aplicada..."
                                />
                            </div>

                            <button 
                                onClick={handleFinalizeAction} 
                                disabled={processing}
                                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 disabled:opacity-50 disabled:shadow-none transition-all"
                            >
                                {processing ? 'Finalizando...' : 'Confirmar Finalización'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. REJECT MODAL */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-red-600 p-5 flex items-center justify-between">
                            <h3 className="text-white font-bold text-lg flex items-center"><XCircleIcon className="h-6 w-6 mr-2"/> Rechazar Incidencia</h3>
                            <button onClick={() => setShowRejectModal(false)} className="text-red-100 hover:text-white"><XMarkIcon className="h-6 w-6"/></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <p className="text-sm text-gray-600">La incidencia volverá a estado "Rechazada" y se notificará al administrador.</p>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Motivo del Rechazo *</label>
                                <textarea 
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none"
                                    rows={3}
                                    placeholder="Explica por qué no se puede realizar el trabajo..."
                                />
                            </div>

                            <button 
                                onClick={handleRejectAction} 
                                disabled={processing}
                                className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 disabled:opacity-50 disabled:shadow-none transition-all"
                            >
                                {processing ? 'Procesando...' : 'Confirmar Rechazo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default IncidentDetailPage;