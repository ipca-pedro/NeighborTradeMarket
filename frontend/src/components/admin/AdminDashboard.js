import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const AdminDashboard = () => {
    const { currentUser } = useAuth();

    return (
        <>
            <Header />
            <Container className="my-5">
                <Row className="mb-4 text-center">
                    <Col>
                        <h1 className="display-5">Painel de Administração</h1>
                        <p className="lead text-muted">Bem-vindo, {currentUser?.Name || 'Administrador'}!</p>
                    </Col>
                </Row>

                <Row className="g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
                    <Col>
                        <Card className="h-100 shadow-sm border-warning">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title><i className="fas fa-clock me-2 text-warning"></i>Anúncios Pendentes</Card.Title>
                                <Card.Text className="text-muted small">
                                    Reveja e aprove ou rejeite os anúncios submetidos pelos utilizadores.
                                </Card.Text>
                                <div className="mt-auto">
                                    <Link to="/admin/produtos-pendentes">
                                        <Button variant="warning" className="w-100">
                                            <i className="fas fa-tasks me-1"></i> Gerir Pendentes
                                        </Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card className="h-100 shadow-sm border-info">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title><i className="fas fa-user-clock me-2 text-info"></i>Utilizadores Pendentes</Card.Title>
                                <Card.Text className="text-muted small">
                                    Aprove ou rejeite os registos de novos utilizadores.
                                </Card.Text>
                                <div className="mt-auto">
                                    <Link to="/admin/users-pendentes">
                                        <Button variant="info" className="w-100 text-white">
                                            <i className="fas fa-user-check me-1"></i> Gerir Registos
                                        </Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card className="h-100 shadow-sm border-primary">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title><i className="fas fa-list-alt me-2 text-primary"></i>Gestão de Anúncios</Card.Title>
                                <Card.Text className="text-muted small">
                                    Veja, filtre e pesquise todos os anúncios do sistema (ativos, pendentes, etc.).
                                </Card.Text>
                                <div className="mt-auto">
                                    <Link to="/admin/anuncios">
                                        <Button variant="primary" className="w-100">
                                            <i className="fas fa-search me-1"></i> Ver Todos Anúncios
                                        </Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col>
                        <Card className="h-100 shadow-sm border-success">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title><i className="fas fa-users-cog me-2 text-success"></i>Gestão de Utilizadores</Card.Title>
                                <Card.Text className="text-muted small">
                                    Liste todos os utilizadores, filtre por estado ou tipo e veja os detalhes.
                                </Card.Text>
                                <div className="mt-auto">
                                    <Link to="/admin/users">
                                        <Button variant="success" className="w-100">
                                            <i className="fas fa-users me-1"></i> Gerir Utilizadores
                                        </Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card className="h-100 shadow-sm border-secondary">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title><i className="fas fa-chart-bar me-2 text-secondary"></i>Estatísticas</Card.Title>
                                <Card.Text className="text-muted small">
                                    Visualize métricas do sistema (utilizadores, anúncios, transações, etc.).
                                </Card.Text>
                                <div className="mt-auto">
                                    <Button variant="outline-secondary" className="w-100" disabled>
                                        <i className="fas fa-tools me-1"></i> Em Desenvolvimento
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card className="h-100 shadow-sm border-secondary">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title><i className="fas fa-cogs me-2 text-secondary"></i>Configurações</Card.Title>
                                <Card.Text className="text-muted small">
                                    Configure parâmetros (categorias, tipos, etc.) e outras opções.
                                </Card.Text>
                                <div className="mt-auto">
                                    <Button variant="outline-secondary" className="w-100" disabled>
                                        <i className="fas fa-tools me-1"></i> Em Desenvolvimento
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default AdminDashboard;
