import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import './About.css';

const About = () => {
    return (
        <>
            <Header />
            
            {/* Banner Principal */}
            <section className="hero-section bg-primary text-white py-5 mb-5">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h1 className="display-4 fw-bold mb-4">Sobre o NeighborTrade</h1>
                            <p className="lead mb-4">
                                Conectando a comunidade através de compras, vendas e trocas seguras e confiáveis.
                            </p>
                        </Col>
                        <Col md={6} className="text-center">
                            <i className="fas fa-handshake fa-6x opacity-75"></i>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Conteúdo Principal */}
            <Container className="py-5">
                {/* Nossa História */}
                <Row className="mb-5">
                    <Col lg={6} className="mb-4">
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body className="p-4">
                                <div className="text-primary mb-3">
                                    <i className="fas fa-history fa-2x"></i>
                                </div>
                                <h3 className="mb-3">Nossa História</h3>
                                <p className="text-muted">
                                    Fundado em 2025, o NeighborTrade surgiu da necessidade de criar um espaço 
                                    dedicado para transações e trocas na comunidade local. Desde então, temos 
                                    crescido e evoluído para melhor atender às necessidades dos nossos usuários.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={6} className="mb-4">
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body className="p-4">
                                <div className="text-primary mb-3">
                                    <i className="fas fa-bullseye fa-2x"></i>
                                </div>
                                <h3 className="mb-3">Nossa Missão</h3>
                                <p className="text-muted">
                                    Facilitar o processo de compra, venda e troca de produtos e serviços, 
                                    promovendo uma economia colaborativa e sustentável na nossa comunidade.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Nossos Valores */}
                <Row className="mb-5">
                    <Col xs={12} className="text-center mb-4">
                        <h2 className="section-title">Nossos Valores</h2>
                    </Col>
                    <Col md={3} className="mb-4">
                        <Card className="border-0 shadow-sm h-100 text-center">
                            <Card.Body className="p-4">
                                <div className="text-primary mb-3">
                                    <i className="fas fa-lock fa-2x"></i>
                                </div>
                                <h4 className="mb-3">Segurança</h4>
                                <p className="text-muted mb-0">
                                    Priorizamos a segurança nas transações e a proteção dos dados dos usuários.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-4">
                        <Card className="border-0 shadow-sm h-100 text-center">
                            <Card.Body className="p-4">
                                <div className="text-primary mb-3">
                                    <i className="fas fa-eye fa-2x"></i>
                                </div>
                                <h4 className="mb-3">Transparência</h4>
                                <p className="text-muted mb-0">
                                    Mantemos todas as transações transparentes e claras para nossos usuários.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-4">
                        <Card className="border-0 shadow-sm h-100 text-center">
                            <Card.Body className="p-4">
                                <div className="text-primary mb-3">
                                    <i className="fas fa-users fa-2x"></i>
                                </div>
                                <h4 className="mb-3">Comunidade</h4>
                                <p className="text-muted mb-0">
                                    Fortalecemos os laços da comunidade através de transações locais.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-4">
                        <Card className="border-0 shadow-sm h-100 text-center">
                            <Card.Body className="p-4">
                                <div className="text-primary mb-3">
                                    <i className="fas fa-leaf fa-2x"></i>
                                </div>
                                <h4 className="mb-3">Sustentabilidade</h4>
                                <p className="text-muted mb-0">
                                    Promovemos a reutilização e a economia circular em nossa comunidade.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

        </>
    );
};

export default About;
