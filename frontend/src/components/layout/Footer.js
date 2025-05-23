import React, { useState } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HelpModal from '../help/HelpModal';

const Footer = () => {
    const [showHelpModal, setShowHelpModal] = useState(false);

    return (
        <footer className="bg-dark text-white pt-5 pb-4">
            <Container>
                <Row className="mb-4 justify-content-center">
                    <Col md={3} className="mb-4 mb-md-0 mx-md-4">
                        <div className="mb-3">
                            <Link to="/" className="text-white text-decoration-none">
                                <img 
                                    src="/images/logotipo.png" 
                                    alt="NeighborTrade" 
                                    height="40" 
                                    className="d-inline-block align-top"
                                />
                                <h5 className="mt-2">NeighborTrade</h5>
                            </Link>
                        </div>
                        <p className="mb-2">(+351) 253 802 190</p>
                        <p className="mb-2">Campus do IPCA</p>
                        <p className="mb-2">Lugar do Aldão, 4750-810 Barcelos</p>
                        <p className="mb-3">info@neighbortrade.com</p>
                        {/* Removidos os links para redes sociais */}
                    </Col>
                    
                    <Col md={3} className="mb-4 mb-md-0 mx-md-4">
                        <h5 className="mb-4">CATEGORIAS PRINCIPAIS</h5>
                        <ListGroup variant="flush" className="footer-links">
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios/categoria/1" className="text-white text-decoration-none">Informática</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios/categoria/2" className="text-white text-decoration-none">Móveis</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios/categoria/3" className="text-white text-decoration-none">Roupas</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios/categoria/4" className="text-white text-decoration-none">Livros</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios/categoria/5" className="text-white text-decoration-none">Brinquedos</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios/categoria/6" className="text-white text-decoration-none">Ferramentas</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios/categoria/7" className="text-white text-decoration-none">Veículos</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios/categoria/8" className="text-white text-decoration-none">Imóveis</Link>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    
                    <Col md={3} className="mb-4 mb-md-0 mx-md-4">
                        <h5 className="mb-4">LINKS RÁPIDOS</h5>
                        <ListGroup variant="flush" className="footer-links">
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios" className="text-white text-decoration-none">Produtos</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios?tipo=2" className="text-white text-decoration-none">Serviços</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/wishlist" className="text-white text-decoration-none">Lista de Desejos</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/rastrear-encomenda" className="text-white text-decoration-none">Rastrear Encomenda</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/faq" className="text-white text-decoration-none">Apoio ao Cliente</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/sobre-nos" className="text-white text-decoration-none">Sobre Nós</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="#" onClick={(e) => { e.preventDefault(); setShowHelpModal(true); }} className="text-white text-decoration-none">Contactos</Link>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
                
                <hr className="my-4" />
                
                <div className="text-center">
                    <p className="mb-0">NeighborTrade {new Date().getFullYear()}. Todos os direitos reservados.</p>
                </div>
            </Container>

            <HelpModal
                show={showHelpModal}
                onHide={() => setShowHelpModal(false)}
            />
        </footer>
    );
};

export default Footer;
