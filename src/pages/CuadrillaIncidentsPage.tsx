import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, InputGroup, Spinner, Badge } from 'react-bootstrap';
import { CuadrillaService } from '../services/cuadrilla.service';
import {
    MagnifyingGlassIcon,
    ChevronRightIcon,
    MapPinIcon,
    CalendarIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

import UiCard from '../components/ui/UiCard';
import UiButton from '../components/ui/UiButton';

interface Incidencia {
    id: number;
    titulo: string;
    descripcion: string;
    estado: string;
    creadoEl: string;
    ubicacion?: string;
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
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        const config: any = {
            'finalizada': {
                bg: 'success',
                text: 'white',
                icon: CheckCircleIcon,
                label: 'Finalizada'
            },
            'en_proceso': {
                bg: 'warning',
                text: 'dark',
                icon: ClockIcon,
                label: 'En Proceso'
            },
            'rechazada': {
                bg: 'danger',
                text: 'white',
                icon: XCircleIcon,
                label: 'Rechazada'
            },
            'pendiente': {
                bg: 'secondary',
                text: 'white',
                icon: ExclamationCircleIcon,
                label: 'Pendiente'
            }
        };

        const st = config[status] || config['pendiente'];
        const Icon = st.icon;

        return (
            <Badge
                bg={st.bg}
                text={st.text}
                className="px-3 py-2 rounded-pill fw-medium shadow-sm d-inline-flex align-items-center gap-2 border border-light"
            >
                <Icon style={{ width: 16, height: 16 }} />
                <span className="text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>{st.label}</span>
            </Badge>
        );
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                <Row className="mb-5 align-items-center g-3">
                    <Col md={6}>
                        <h2 className="fw-bold text-dark mb-1 display-6">Incidencias Asignadas</h2>
                        <p className="text-secondary mb-0 fs-6">Gestiona y actualiza el trabajo diario de tu cuadrilla</p>
                    </Col>
                    <Col md={6} lg={4} className="ms-auto">
                        <InputGroup className="shadow-sm rounded-pill overflow-hidden border-0 bg-white p-1">
                            <InputGroup.Text className="bg-transparent border-0 ps-3">
                                <MagnifyingGlassIcon style={{ width: 20 }} className="text-primary opacity-75" />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Buscar por ID, título o estado..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-0 shadow-none bg-transparent"
                            />
                        </InputGroup>
                    </Col>
                </Row>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Cargando lista...</p>
                    </div>
                ) : (
                    <UiCard className="overflow-hidden border-0 shadow-sm" noPadding>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="px-4 py-4 text-secondary small text-uppercase fw-bold border-0" style={{ width: '80px' }}>ID</th>
                                        <th className="px-4 py-4 text-secondary small text-uppercase fw-bold border-0">Detalles del Problema</th>
                                        <th className="px-4 py-4 text-secondary small text-uppercase fw-bold border-0 text-center">Estado Actual</th>
                                        <th className="px-4 py-4 text-secondary small text-uppercase fw-bold border-0">Fecha Creación</th>
                                        <th className="px-4 py-4 text-secondary small text-uppercase fw-bold border-0 text-end">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredIncidencias.length > 0 ? (
                                        filteredIncidencias.map((incidencia) => (
                                            <tr
                                                key={incidencia.id}
                                                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                                onClick={() => navigate(`/cuadrilla/incidencias/${incidencia.id}`)}
                                                className="group-hover-row"
                                            >
                                                <td className="px-4 py-4">
                                                    <span className="fw-bold text-primary bg-primary bg-opacity-10 px-2 py-1 rounded">
                                                        #{incidencia.id}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="fw-bold text-dark mb-1 fs-6">{incidencia.titulo}</div>
                                                    {incidencia.ubicacion ? (
                                                        <div className="text-muted small d-flex align-items-center">
                                                            <MapPinIcon style={{ width: 14, height: 14, marginRight: 4 }} className="text-danger opacity-75" />
                                                            {incidencia.ubicacion}
                                                        </div>
                                                    ) : (
                                                        <div className="text-muted small fst-italic">Sin ubicación</div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    {getStatusBadge(incidencia.estado)}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="d-flex align-items-center text-muted small fw-medium">
                                                        <CalendarIcon style={{ width: 16, height: 16, marginRight: 8 }} className="text-primary opacity-75" />
                                                        {formatDate(incidencia.creadoEl)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-end">
                                                    <UiButton
                                                        variant="light"
                                                        size="sm"
                                                        className="rounded-circle p-2 shadow-sm border hover-shadow"
                                                        style={{ width: 40, height: 40 }}
                                                        onClick={(e: any) => {
                                                            e.stopPropagation();
                                                            navigate(`/cuadrilla/incidencias/${incidencia.id}`);
                                                        }}
                                                    >
                                                        <ChevronRightIcon style={{ width: 20 }} className="text-primary" />
                                                    </UiButton>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-5 text-muted">
                                                <div className="d-flex flex-column align-items-center py-4">
                                                    <div className="bg-light rounded-circle p-4 mb-3">
                                                        <MagnifyingGlassIcon style={{ width: 32, opacity: 0.4 }} />
                                                    </div>
                                                    <h6 className="fw-bold text-secondary">No se encontraron resultados</h6>
                                                    <p className="small mb-0">Intenta con otro término de búsqueda</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </UiCard>
                )}
            </Container>
        </div>
    );
};

export default CuadrillaIncidentsPage;