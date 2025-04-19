import React, { useState } from 'react';
import { Container, Nav, Tab, Row, Col } from 'react-bootstrap';
import MinhasCompras from './MinhasCompras';
import MinhasVendas from './MinhasVendas';
import MeusAnuncios from '../produtos/MeusAnuncios';
import Cartoes from './Cartoes';
import DadosPessoais from './DadosPessoais';
import MinhasReclamacoes from './MinhasReclamacoes';
import './Perfil.css';

const Perfil = () => {
    const [key, setKey] = useState('dados');

    return (
        <Container className="py-4">
            <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
                <Row>
                    <Col md={3}>
                        <div className="profile-nav">
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="dados" className="d-flex align-items-center">
                                        <i className="fas fa-user me-2"></i>
                                        Dados Pessoais
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="compras" className="d-flex align-items-center">
                                        <i className="fas fa-shopping-bag me-2"></i>
                                        Minhas Compras
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="vendas" className="d-flex align-items-center">
                                        <i className="fas fa-store me-2"></i>
                                        Minhas Vendas
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="anuncios" className="d-flex align-items-center">
                                        <i className="fas fa-tags me-2"></i>
                                        Meus Anúncios
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="cartoes" className="d-flex align-items-center">
                                        <i className="fas fa-credit-card me-2"></i>
                                        Cartões
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="reclamacoes" className="d-flex align-items-center">
                                        <i className="fas fa-exclamation-circle me-2"></i>
                                        Minhas Reclamações
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </div>
                    </Col>
                    <Col md={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="dados">
                                <DadosPessoais />
                            </Tab.Pane>
                            <Tab.Pane eventKey="compras">
                                <MinhasCompras />
                            </Tab.Pane>
                            <Tab.Pane eventKey="vendas">
                                <MinhasVendas />
                            </Tab.Pane>
                            <Tab.Pane eventKey="anuncios">
                                <MeusAnuncios />
                            </Tab.Pane>
                            <Tab.Pane eventKey="cartoes">
                                <Cartoes />
                            </Tab.Pane>
                            <Tab.Pane eventKey="reclamacoes">
                                <MinhasReclamacoes />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
};

export default Perfil; 