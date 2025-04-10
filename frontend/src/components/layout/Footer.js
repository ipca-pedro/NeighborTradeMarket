import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-5 pb-4">
            <Container>
                <Row className="mb-4">
                    <Col md={3} className="mb-4 mb-md-0">
                        <div className="mb-3">
                            <Link to="/" className="text-white text-decoration-none">
                                <img 
                                    src="/images/logo-white.png" 
                                    alt="NeighborTrade" 
                                    height="40" 
                                    className="d-inline-block align-top"
                                />
                                <h5 className="mt-2">NeighborTrade</h5>
                            </Link>
                        </div>
                        <p className="mb-2">(+351) 555-0104</p>
                        <p className="mb-2">4517 Washington Ave.</p>
                        <p className="mb-2">Manchester, Kentucky 39495</p>
                        <p className="mb-3">info@neighbortrade.com</p>
                        {/* Removidos os links para redes sociais */}
                    </Col>
                    
                    <Col md={3} className="mb-4 mb-md-0">
                        <h5 className="mb-4">CATEGORIAS PRINCIPAIS</h5>
                        <ListGroup variant="flush" className="footer-links">
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios/categoria/1" className="text-white text-decoration-none">Computador & Portátil</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios/categoria/3" className="text-white text-decoration-none">Smartphone</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios/categoria/4" className="text-white text-decoration-none">Auscultadores</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios/categoria/5" className="text-white text-decoration-none">Acessórios</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios/categoria/6" className="text-white text-decoration-none">Consolas</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios/categoria/7" className="text-white text-decoration-none">Câmaras & Foto</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios/categoria/8" className="text-white text-decoration-none">TV & Eletrodomésticos</Link>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    
                    <Col md={3} className="mb-4 mb-md-0">
                        <h5 className="mb-4">LINKS RÁPIDOS</h5>
                        <ListGroup variant="flush" className="footer-links">
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/anuncios" className="text-white text-decoration-none">Produtos</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/carrinho" className="text-white text-decoration-none">Carrinho</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/wishlist" className="text-white text-decoration-none">Lista de Desejos</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/rastrear-encomenda" className="text-white text-decoration-none">Rastrear Encomenda</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/apoio-cliente" className="text-white text-decoration-none">Apoio ao Cliente</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/sobre-nos" className="text-white text-decoration-none">Sobre Nós</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                                <Link to="/contactos" className="text-white text-decoration-none">Contactos</Link>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    
                    <Col md={3}>
                        <h5 className="mb-4">ETIQUETAS POPULARES</h5>
                        <div className="d-flex flex-wrap">
                            <Link to="/anuncios/tag/game" className="badge bg-secondary text-white text-decoration-none me-2 mb-2 p-2">Game</Link>
                            <Link to="/anuncios/tag/iphone" className="badge bg-secondary text-white text-decoration-none me-2 mb-2 p-2">iPhone</Link>
                            <Link to="/anuncios/tag/tv" className="badge bg-secondary text-white text-decoration-none me-2 mb-2 p-2">TV</Link>
                            <Link to="/anuncios/tag/asus" className="badge bg-secondary text-white text-decoration-none me-2 mb-2 p-2">Asus Laptop</Link>
                            <Link to="/anuncios/tag/macbook" className="badge bg-secondary text-white text-decoration-none me-2 mb-2 p-2">Macbook</Link>
                            <Link to="/anuncios/tag/ssd" className="badge bg-secondary text-white text-decoration-none me-2 mb-2 p-2">SSD</Link>
                            <Link to="/anuncios/tag/graphics" className="badge bg-secondary text-white text-decoration-none me-2 mb-2 p-2">Placa Gráfica</Link>
                            <Link to="/anuncios/tag/power" className="badge bg-secondary text-white text-decoration-none me-2 mb-2 p-2">Power Bank</Link>
                            <Link to="/anuncios/tag/smart-tv" className="badge bg-secondary text-white text-decoration-none me-2 mb-2 p-2">Smart TV</Link>
                            <Link to="/anuncios/tag/speaker" className="badge bg-secondary text-white text-decoration-none me-2 mb-2 p-2">Colunas</Link>
                            <Link to="/anuncios/tag/tablet" className="badge bg-secondary text-white text-decoration-none me-2 mb-2 p-2">Tablet</Link>
                            <Link to="/anuncios/tag/microwave" className="badge bg-secondary text-white text-decoration-none me-2 mb-2 p-2">Microondas</Link>
                            <Link to="/anuncios/tag/samsung" className="badge bg-secondary text-white text-decoration-none me-2 mb-2 p-2">Samsung</Link>
                        </div>
                    </Col>
                </Row>
                
                <hr className="my-4" />
                
                <div className="text-center">
                    <p className="mb-0">NeighborTrade © {new Date().getFullYear()}. Todos os direitos reservados.</p>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
