import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const AdminDashboard = () => {
    const { currentUser } = useAuth();

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <Container className="flex-grow-1 py-5">
                <Row className="mb-4 text-center">
                    <Col>
                        <h1 className="display-4 fw-bold mb-2">Painel de Administração</h1>
                        <p className="lead text-muted">Bem-vindo, {currentUser?.Name || 'Administrador'}!</p>
                    </Col>
                </Row>

                <Row className="g-4 justify-content-center">
                    {/* Anúncios Pendentes */}
                    <Col xs={12} md={6} xl={4}>
                        <Card className="h-100 shadow-sm border-0 card-hover">
                            <Card.Body className="d-flex flex-column p-4">
                                <div className="mb-3">
                                    <span className="badge bg-warning p-2 mb-3">
                                        <i className="fas fa-clock fa-lg"></i>
                                    </span>
                                    <Card.Title className="h4 mb-3">Anúncios Pendentes</Card.Title>
                                    <Card.Text className="text-muted">
                                        Reveja e aprove ou rejeite os anúncios submetidos pelos utilizadores.
                                    </Card.Text>
                                </div>
                                <div className="mt-auto">
                                    <Link to="/admin/produtos-pendentes" className="text-decoration-none">
                                        <Button variant="warning" className="w-100 py-2">
                                            <i className="fas fa-tasks me-2"></i>Gerir Pendentes
                                        </Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Utilizadores Pendentes */}
                    <Col xs={12} md={6} xl={4}>
                        <Card className="h-100 shadow-sm border-0 card-hover">
                            <Card.Body className="d-flex flex-column p-4">
                                <div className="mb-3">
                                    <span className="badge bg-info p-2 mb-3">
                                        <i className="fas fa-user-clock fa-lg"></i>
                                    </span>
                                    <Card.Title className="h4 mb-3">Utilizadores Pendentes</Card.Title>
                                    <Card.Text className="text-muted">
                                        Aprove ou rejeite os registos de novos utilizadores.
                                    </Card.Text>
                                </div>
                                <div className="mt-auto">
                                    <Link to="/admin/users-pendentes" className="text-decoration-none">
                                        <Button variant="info" className="w-100 py-2 text-white">
                                            <i className="fas fa-user-check me-2"></i>Gerir Registos
                                        </Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Gestão de Anúncios */}
                    <Col xs={12} md={6} xl={4}>
                        <Card className="h-100 shadow-sm border-0 card-hover">
                            <Card.Body className="d-flex flex-column p-4">
                                <div className="mb-3">
                                    <span className="badge bg-primary p-2 mb-3">
                                        <i className="fas fa-list-alt fa-lg"></i>
                                    </span>
                                    <Card.Title className="h4 mb-3">Gestão de Anúncios</Card.Title>
                                    <Card.Text className="text-muted">
                                        Veja, filtre e pesquise todos os anúncios do sistema (ativos, pendentes, etc.).
                                    </Card.Text>
                                </div>
                                <div className="mt-auto">
                                    <Link to="/admin/anuncios" className="text-decoration-none">
                                        <Button variant="primary" className="w-100 py-2">
                                            <i className="fas fa-search me-2"></i>Ver Todos Anúncios
                                        </Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {/* Gestão de Utilizadores */}
                    <Col xs={12} md={6} xl={4}>
                        <Card className="h-100 shadow-sm border-0 card-hover">
                            <Card.Body className="d-flex flex-column p-4">
                                <div className="mb-3">
                                    <span className="badge bg-success p-2 mb-3">
                                        <i className="fas fa-users-cog fa-lg"></i>
                                    </span>
                                    <Card.Title className="h4 mb-3">Gestão de Utilizadores</Card.Title>
                                    <Card.Text className="text-muted">
                                        Liste todos os utilizadores, filtre por estado ou tipo e veja os detalhes.
                                    </Card.Text>
                                </div>
                                <div className="mt-auto">
                                    <Link to="/admin/users" className="text-decoration-none">
                                        <Button variant="success" className="w-100 py-2">
                                            <i className="fas fa-users me-2"></i>Gerir Utilizadores
                                        </Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Gestão de Reclamações */}
                    <Col xs={12} md={6} xl={4}>
                        <Card className="h-100 shadow-sm border-0 card-hover">
                            <Card.Body className="d-flex flex-column p-4">
                                <div className="mb-3">
                                    <span className="badge bg-danger p-2 mb-3">
                                        <i className="fas fa-exclamation-circle fa-lg"></i>
                                    </span>
                                    <Card.Title className="h4 mb-3">Gestão de Reclamações</Card.Title>
                                    <Card.Text className="text-muted">
                                        Gerencie as reclamações dos utilizadores, atualize status e resolva problemas.
                                    </Card.Text>
                                </div>
                                <div className="mt-auto">
                                    <Link to="/admin/reclamacoes" className="text-decoration-none">
                                        <Button variant="danger" className="w-100 py-2">
                                            <i className="fas fa-tasks me-2"></i>Gerir Reclamações
                                        </Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminDashboard;
