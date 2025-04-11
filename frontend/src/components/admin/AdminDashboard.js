import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const [adminName, setAdminName] = useState('');

    useEffect(() => {
        if (currentUser) {
            setAdminName(currentUser.Name || 'Administrador');
        }
    }, [currentUser]);

    return (
        <>
            <Header />
            <Container className="my-5">
                <Row className="mb-4">
                    <Col>
                        <h1 className="text-center">Painel de Administração</h1>
                        <p className="text-center lead">Bem-vindo, {adminName}!</p>
                    </Col>
                </Row>

                <Row className="g-4">
                    <Col md={6}>
                        <Card className="h-100 shadow">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>Anúncios Pendentes</Card.Title>
                                <Card.Text>
                                    Gerencie os anúncios que estão aguardando aprovação. Você pode aprovar ou rejeitar anúncios.
                                </Card.Text>
                                <div className="mt-auto">
                                    <Link to="/admin/anuncios-pendentes">
                                        <Button variant="primary" className="w-100">
                                            Gerenciar Anúncios Pendentes
                                        </Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="h-100 shadow">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>Usuários Pendentes</Card.Title>
                                <Card.Text>
                                    Gerencie os usuários que estão aguardando aprovação. Você pode aprovar ou rejeitar novos usuários.
                                </Card.Text>
                                <div className="mt-auto">
                                    <Link to="/admin/utilizadores-pendentes">
                                        <Button variant="primary" className="w-100">
                                            Gerenciar Usuários Pendentes
                                        </Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col md={6}>
                        <Card className="h-100 shadow">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>Gestão de Utilizadores</Card.Title>
                                <Card.Text>
                                    Liste todos os utilizadores do sistema e altere seus estados (ativo, inativo, bloqueado, etc).
                                </Card.Text>
                                <div className="mt-auto">
                                    <Link to="/admin/utilizadores">
                                        <Button variant="primary" className="w-100">
                                            Gerir Utilizadores
                                        </Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="h-100 shadow">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>Estatísticas</Card.Title>
                                <Card.Text>
                                    Visualize estatísticas e métricas do sistema, como número de usuários, anúncios, transações, etc.
                                </Card.Text>
                                <div className="mt-auto">
                                    <Button variant="secondary" className="w-100" disabled>
                                        Em Desenvolvimento
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="h-100 shadow">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>Configurações</Card.Title>
                                <Card.Text>
                                    Configure parâmetros do sistema, como categorias, tipos de itens, e outras configurações.
                                </Card.Text>
                                <div className="mt-auto">
                                    <Button variant="secondary" className="w-100" disabled>
                                        Em Desenvolvimento
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
