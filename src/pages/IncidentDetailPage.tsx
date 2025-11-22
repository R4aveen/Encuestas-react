import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Alert, Image, Spinner } from 'react-bootstrap';
import { CuadrillaService } from '../services/cuadrilla.service';
import {
    ArrowLeftIcon, MapPinIcon, CalendarIcon,
    DocumentTextIcon, PhotoIcon, CameraIcon,
    ExclamationTriangleIcon, XMarkIcon, CheckIcon
} from '@heroicons/react/24/outline';

import UiButton from '../components/ui/UiButton';
import UiCard from '../components/ui/UiCard';
import UiField from '../components/ui/UiField';
import UiModal from '../components/ui/UiModal';

const IncidentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [incident, setIncident] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [comentarioFinal, setComentarioFinal] = useState('');
    const [evidenciaNombre, setEvidenciaNombre] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [evidenciaFiles, setEvidenciaFiles] = useState<File[]>([]);

    const fetchIncident = async () => {
        try {
            setLoading(true);
            const data = await CuadrillaService.getIncidenciaById(Number(id));
            setIncident(data);
        } catch (err) {
            console.error(err);
            setError('No se pudo cargar la incidencia.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchIncident();
    }, [id]);

    const handleStartClick = async () => {
        if (!window.confirm('¿Desea iniciar el trabajo en esta incidencia?')) return;

        try {
            setProcessing(true);
            await CuadrillaService.iniciarIncidencia(Number(id));
            await fetchIncident();
        } catch (e) {
            console.error(e);
            alert('Error al iniciar la incidencia. Intente nuevamente.');
        } finally {
            setProcessing(false);
        }
    };

    const handleUploadEvidence = async () => {
        if (evidenciaFiles.length === 0) return;

        try {
            setProcessing(true);
            const formData = new FormData();

            if (evidenciaNombre.trim()) {
                formData.append('nombre', evidenciaNombre);
            }

            evidenciaFiles.forEach(file => {
                formData.append('evidencias', file);
            });

            await CuadrillaService.subirEvidencia(Number(id), formData);

            setEvidenciaFiles([]);
            setEvidenciaNombre('');
            setShowUploadModal(false);
            await fetchIncident();

        } catch (e) {
            console.error(e);
            alert('Error al subir las evidencias.');
        } finally {
            setProcessing(false);
        }
    };

    const handleFinalizeAction = async () => {
        if (!comentarioFinal.trim()) {
            alert('Debe ingresar un comentario de cierre.');
            return;
        }

        try {
            setProcessing(true);
            await CuadrillaService.finalizarIncidencia(Number(id), comentarioFinal);
            setShowFinalizeModal(false);
            setComentarioFinal('');
            await fetchIncident();
        } catch (e) {
            console.error(e);
            alert('Error al finalizar la incidencia.');
        } finally {
            setProcessing(false);
        }
    };

    const handleRejectAction = async () => {
        if (!rejectReason.trim()) {
            alert('Debe ingresar el motivo del rechazo.');
            return;
        }

        try {
            setProcessing(true);
            await CuadrillaService.rechazarIncidencia(Number(id), { motivo_rechazo: rejectReason });
            setShowRejectModal(false);
            navigate('/cuadrilla/incidencias');
        } catch (e) {
            console.error(e);
            alert('Error al rechazar la incidencia.');
        } finally {
            setProcessing(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setEvidenciaFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setEvidenciaFiles(prev => prev.filter((_, i) => i !== index));
    };

    const getStatusBadge = (status: string) => {
        const map: any = {
            'finalizada': { bg: 'success', text: 'Finalizada' },
            'en_proceso': { bg: 'warning', text: 'En Proceso' },
            'rechazada': { bg: 'danger', text: 'Rechazada' },
            'pendiente': { bg: 'secondary', text: 'Pendiente' }
        };
        const st = map[status] || map['pendiente'];
        return (
            <Badge
                bg={st.bg}
                text={status === 'en_proceso' ? 'dark' : 'white'}
                className="px-3 py-2 rounded-pill shadow-sm text-uppercase fw-bold"
            >
                {st.text}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error || !incident) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error || 'Incidencia no encontrada'}</Alert>
                <UiButton onClick={() => navigate('/cuadrilla/incidencias')}>Volver</UiButton>
            </Container>
        );
    }

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                <div className="mb-4">
                    <button
                        onClick={() => navigate('/cuadrilla/incidencias')}
                        className="btn btn-link text-decoration-none text-secondary p-0 d-flex align-items-center fw-bold small"
                    >
                        <ArrowLeftIcon style={{ width: 16 }} className="me-2" /> Volver al listado
                    </button>
                </div>

                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-5 gap-4">
                    <div>
                        <div className="d-flex align-items-center gap-3 mb-2">
                            <h1 className="fw-bold text-dark mb-0 display-6">Incidencia #{incident.id}</h1>
                            {getStatusBadge(incident.estado)}
                        </div>
                        <div className="text-muted d-flex align-items-center small">
                            <CalendarIcon style={{ width: 18 }} className="me-2" />
                            Creada el {new Date(incident.creadoEl).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                        {incident.estado === 'pendiente' && (
                            <UiButton onClick={handleStartClick} loading={processing} className="px-4 py-2">
                                Iniciar Trabajo
                            </UiButton>
                        )}
                        {incident.estado === 'en_proceso' && (
                            <>
                                <UiButton variant="outline-danger" onClick={() => setShowRejectModal(true)} className="px-3">
                                    <XMarkIcon style={{ width: 20 }} className="me-1" /> Rechazar
                                </UiButton>
                                <UiButton variant="outline-primary" onClick={() => setShowUploadModal(true)} className="px-3">
                                    <CameraIcon style={{ width: 20 }} className="me-1" /> Subir Fotos
                                </UiButton>
                                <UiButton variant="success" onClick={() => setShowFinalizeModal(true)} className="px-4 text-white">
                                    <CheckIcon style={{ width: 20 }} className="me-1" /> Finalizar Tarea
                                </UiButton>
                            </>
                        )}
                    </div>
                </div>

                <Row className="g-4">
                    <Col lg={8}>
                        <UiCard header={<><DocumentTextIcon style={{ width: 20 }} className="me-2 text-primary" /> Detalles de la Incidencia</>}>
                            <div className="mb-4">
                                <label className="text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>Título del Problema</label>
                                <h4 className="text-dark fw-bold mb-0">{incident.titulo}</h4>
                            </div>

                            <div className="p-4 bg-light rounded-4 border-0 mb-4">
                                <label className="text-muted small fw-bold text-uppercase d-block mb-2" style={{ fontSize: '0.7rem' }}>Descripción</label>
                                <p className="mb-0 text-dark fs-6" style={{ lineHeight: 1.6 }}>{incident.descripcion}</p>
                            </div>

                            <div className="d-flex align-items-center p-3 rounded-3" style={{ backgroundColor: '#fffbf0' }}>
                                <div className="bg-white p-2 rounded-circle me-3 shadow-sm text-primary">
                                    <MapPinIcon style={{ width: 24 }} />
                                </div>
                                <div>
                                    <label className="text-muted small fw-bold text-uppercase mb-0" style={{ fontSize: '0.7rem' }}>Ubicación</label>
                                    <p className="mb-0 fw-medium text-dark fs-5">{incident.ubicacion || 'No especificada'}</p>
                                </div>
                            </div>
                        </UiCard>

                        {incident.motivo_rechazo && (
                            <div className="mt-4">
                                <Alert variant="danger" className="border-0 shadow-sm rounded-3">
                                    <Alert.Heading className="h6 fw-bold d-flex align-items-center mb-2">
                                        <ExclamationTriangleIcon style={{ width: 20 }} className="me-2" /> Motivo de Rechazo
                                    </Alert.Heading>
                                    <p className="mb-0 small opacity-75">{incident.motivo_rechazo}</p>
                                </Alert>
                            </div>
                        )}
                    </Col>

                    <Col lg={4}>
                        <UiCard header={<><PhotoIcon style={{ width: 20 }} className="me-2 text-primary" /> Galería de Evidencias</>}>
                            {incident.multimedias && incident.multimedias.length > 0 ? (
                                <div className="d-flex flex-column gap-3">
                                    {incident.multimedias.map((media: any) => (
                                        <a key={media.id} href={media.url} target="_blank" rel="noreferrer" className="d-block text-decoration-none shadow-sm rounded-3 overflow-hidden position-relative">
                                            <div style={{ height: '200px', width: '100%' }}>
                                                <Image src={media.url} alt={media.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            {media.nombre && (
                                                <div className="p-2 bg-white border-top text-truncate small text-center fw-bold text-dark">
                                                    {media.nombre}
                                                </div>
                                            )}
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5 bg-light rounded-3 border border-dashed">
                                    <PhotoIcon className="text-secondary mb-3" style={{ width: 48, opacity: 0.3 }} />
                                    <p className="text-muted small mb-0 fw-medium">No hay evidencias</p>
                                </div>
                            )}
                        </UiCard>
                    </Col>
                </Row>
            </Container>

            <UiModal show={showUploadModal} handleClose={() => setShowUploadModal(false)} title="Subir Evidencias" size="lg">
                <div className="text-center p-5 bg-white rounded-4 border border-2 border-dashed border-primary mx-auto" style={{ maxWidth: '500px', position: 'relative' }}>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                        style={{ cursor: 'pointer' }}
                    />
                    <div className="mb-3 text-primary bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex">
                        <CameraIcon style={{ width: 40 }} />
                    </div>
                    <h5 className="fw-bold text-primary mb-1">Haz clic para seleccionar fotos</h5>
                    <p className="text-muted small mb-0">JPG, PNG permitidos</p>
                </div>

                <div className="mt-4 px-4">
                    <UiField
                        label="Título opcional para las evidencias"
                        placeholder="Ej: Reparación completada"
                        value={evidenciaNombre}
                        onChange={e => setEvidenciaNombre(e.target.value)}
                    />
                </div>

                {evidenciaFiles.length > 0 && (
                    <div className="text-center mt-3">
                        <Badge bg="success" className="px-3 py-2 fw-normal">
                            {evidenciaFiles.length} archivo(s) listo(s) para subir
                        </Badge>
                        <div className="d-flex flex-wrap gap-2 justify-content-center mt-2">
                            {evidenciaFiles.map((f, i) => (
                                <span key={i} className="badge bg-light text-dark border d-flex align-items-center">
                                    {f.name}
                                    <span className="ms-2 cursor-pointer text-danger" onClick={() => removeFile(i)} style={{ cursor: 'pointer' }}>×</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="d-grid gap-2 mt-4 col-lg-6 mx-auto">
                    <UiButton
                        onClick={handleUploadEvidence}
                        loading={processing}
                        disabled={evidenciaFiles.length === 0}
                        className="py-3 fs-5"
                        isBlock
                    >
                        Subir Foto(s)
                    </UiButton>
                </div>
            </UiModal>

            <UiModal show={showFinalizeModal} handleClose={() => setShowFinalizeModal(false)} title="Finalizar Tarea">
                <Alert variant="info" className="d-flex align-items-center p-2 small mb-3 border-0 shadow-sm rounded-3">
                    <CheckIcon style={{ width: 18 }} className="me-2" /> Recuerda subir las fotos antes de finalizar.
                </Alert>
                <UiField
                    as="textarea"
                    rows={4}
                    label="Comentario Final *"
                    value={comentarioFinal}
                    onChange={e => setComentarioFinal(e.target.value)}
                    placeholder="Describe el trabajo realizado..."
                />
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <UiButton variant="light" onClick={() => setShowFinalizeModal(false)}>Cancelar</UiButton>
                    <UiButton variant="success" onClick={handleFinalizeAction} loading={processing} className="text-white">Confirmar Finalización</UiButton>
                </div>
            </UiModal>

            <UiModal show={showRejectModal} handleClose={() => setShowRejectModal(false)} title="Rechazar Incidencia">
                <UiField
                    as="textarea"
                    rows={4}
                    label="Motivo del Rechazo *"
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="Explica por qué rechazas la tarea..."
                />
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <UiButton variant="light" onClick={() => setShowRejectModal(false)}>Cancelar</UiButton>
                    <UiButton variant="danger" onClick={handleRejectAction} loading={processing}>Confirmar Rechazo</UiButton>
                </div>
            </UiModal>
        </div>
    );
};

export default IncidentDetailPage;