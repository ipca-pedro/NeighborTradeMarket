import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HelpModal from '../help/HelpModal';

const Footer = () => {
    const [showHelpModal, setShowHelpModal] = useState(false);

    return (
        <footer className="bg-dark text-white pt-4 pb-3">
            <Container>
                <Row>
                    <Col md={4} className="mb-3">
                        <div className="mb-3">
                            <Link to="/" className="text-white text-decoration-none">
                                <img 
                                    src="/images/logotipo.png" 
                                    alt="NeighborTrade" 
                                    height="65" 
                                    className="d-inline-block align-top"
                                    style={{ filter: 'brightness(0) invert(1)' }}
                                />
                            </Link>
                        </div>
                        <p className="mb-1">(+351) 253 802 190</p>
                        <p className="mb-1">Campus do IPCA</p>
                        <p className="mb-1">Lugar do Aldão, 4750-810 Barcelos</p>
                        <p className="mb-2">info@neighbortrade.com</p>
                    </Col>
                    
                    <Col md={8}>
                        <h5 className="mb-3">CATEGORIAS PRINCIPAIS</h5>
                        <div className="d-flex flex-wrap gap-4">
                            <Link to="/anuncios/categoria/1" className="text-white text-decoration-none">Informática</Link>
                            <Link to="/anuncios/categoria/2" className="text-white text-decoration-none">Móveis</Link>
                            <Link to="/anuncios/categoria/3" className="text-white text-decoration-none">Roupas</Link>
                            <Link to="/anuncios/categoria/4" className="text-white text-decoration-none">Livros</Link>
                            <Link to="/anuncios/categoria/5" className="text-white text-decoration-none">Brinquedos</Link>
                            <Link to="/anuncios/categoria/6" className="text-white text-decoration-none">Ferramentas</Link>
                        </div>
                    </Col>
                </Row>
                
                <hr className="my-3" />
                
                <div className="text-center">
                    <small>NeighborTrade {new Date().getFullYear()}. Todos os direitos reservados.</small>
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
