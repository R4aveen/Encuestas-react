import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Container, Row, Col, Card, Spinner, Button, Alert } from 'react-bootstrap';
import {
    ChartBarIcon,
    CheckCircleIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { CuadrillaService } from '../services/cuadrilla.service';

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

    const chartData = {
        labels: ['Pendientes', 'Finalizadas', 'Otras'],
        datasets: [
            {
                label: '# de Incidencias',
                data: [
                    stats.pendientes,
                    stats.resueltas,
                    stats.total - (stats.pendientes + stats.resueltas)
                ],
                backgroundColor: [
                    '#ffc107',
                    '#198754',
                    '#adb5bd',
                ],
                borderWidth: 0,
                hoverOffset: 4
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: { usePointStyle: true, padding: 20, font: { size: 12 } }
            }
        },
        cutout: '75%',
    };

    const statCards = [
        {
            title: 'Total Asignadas',
            value: stats.total,
            icon: ClipboardDocumentListIcon,
            variant: 'primary',
            desc: 'Histórico completo'
        },
        {
            title: 'En Proceso',
            value: stats.pendientes,
            icon: ClockIcon,
            variant: 'warning',
            desc: 'Requieren atención'
        },
        {
            title: 'Finalizadas',
            value: stats.resueltas,
            icon: CheckCircleIcon,
            variant: 'success',
            desc: 'Trabajo completado'
        },
    ];

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Spinner animation="border" variant="primary" />
        </div>
    );

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                <div className="mb-5">
                    <h2 className="fw-bold text-dark mb-1">Dashboard Operativo</h2>
                    <p className="text-muted">Resumen de actividad y métricas de rendimiento.</p>
                </div>

                {error && <Alert variant="danger" className="mb-4 shadow-sm border-0">{error}</Alert>}

                <Row className="g-4 mb-5">
                    {statCards.map((stat, index) => (
                        <Col md={4} key={index}>
                            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                <Card.Body className="p-4 d-flex align-items-center justify-content-between">
                                    <div>
                                        <h6 className="text-uppercase text-muted small fw-bold mb-2">{stat.title}</h6>
                                        <h2 className="fw-bold text-dark mb-0 display-6">{stat.value}</h2>
                                        <small className="text-muted mt-1 d-block">{stat.desc}</small>
                                    </div>
                                    <div className={`bg-${stat.variant} bg-opacity-10 p-3 rounded-4 text-${stat.variant}`}>
                                        <stat.icon style={{ width: '32px', height: '32px' }} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row className="g-4">
                    <Col lg={4}>
                        <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-4">
                                    <ChartBarIcon style={{ width: '20px' }} className="text-secondary me-2" />
                                    <h6 className="fw-bold text-dark mb-0">Distribución de Estado</h6>
                                </div>
                                <div style={{ height: '250px', position: 'relative' }}>
                                    <Doughnut data={chartData} options={chartOptions} />
                                    <div className="position-absolute top-50 start-50 translate-middle text-center" style={{ pointerEvents: 'none' }}>
                                        <h3 className="fw-bold mb-0">{stats.total}</h3>
                                        <small className="text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>Total</small>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={8}>
                        <Card className="border-0 shadow-sm h-100 bg-primary text-white overflow-hidden" style={{ borderRadius: '16px' }}>
                            <div className="position-absolute top-0 end-0 p-5 opacity-25">
                                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="100" cy="100" r="100" fill="white" />
                                </svg>
                            </div>
                            <Card.Body className="p-5 d-flex flex-column justify-content-center position-relative">
                                <h2 className="fw-bold mb-3">Sistema de Gestión de Cuadrillas</h2>
                                <p className="lead mb-4 opacity-75" style={{ maxWidth: '600px' }}>
                                    Bienvenido al panel de control. Desde aquí puedes monitorear el progreso de las tareas asignadas en tiempo real y actualizar el estado de las incidencias.
                                </p>
                                <div>
                                    <Button
                                        variant="light"
                                        size="lg"
                                        onClick={() => navigate('/cuadrilla/incidencias')}
                                        className="fw-bold px-4 shadow-sm d-inline-flex align-items-center"
                                        style={{ borderRadius: '10px' }}
                                    >
                                        Ver Listado de Incidencias
                                        <ArrowRightIcon style={{ width: '20px', marginLeft: '10px' }} />
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default DashboardPage;