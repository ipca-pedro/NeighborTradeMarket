import React, { useState, useEffect } from 'react';
import { getAnunciosDestaque, getAnunciosAleatorios } from '../../services/anuncioService';
import { Container, Row, Col, Card, Button, Form, Carousel, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import CategoryGrid from '../layout/CategoryGrid';
import './HomePage.css';
import { getImageUrl } from '../../services/api';

const HomePage = () => {
    const [produtos, setProdutos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [produtosDestaque, setProdutosDestaque] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch anuncios
                const [produtosRes, servicosRes, destaqueRes] = await Promise.all([
                    getAnunciosAleatorios(6, 1), // 6 Produtos
                    getAnunciosAleatorios(3, 2), // 3 Serviços 
                    getAnunciosAleatorios(3, 1)  // 3 Produtos para Destaque
                ]);

                setProdutos(produtosRes || []);
                setServicos(servicosRes || []);
                setProdutosDestaque(destaqueRes || []);
                
            } catch (error) {
                console.error('Erro ao buscar dados da homepage:', error);
                setError('Não foi possível carregar todos os dados da página.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Função para renderizar um anúncio
    const renderAnuncio = (anuncio) => (
        <Col key={anuncio.ID_Anuncio} xs={12} md={4} lg={3} className="mb-4">
            <Card className="product-card h-100 shadow-sm">
                {anuncio.desconto && (
                    <div className="position-absolute top-0 end-0 bg-warning text-white p-2 m-2 rounded-circle">
                        <span className="fw-bold">{anuncio.desconto}%</span>
                    </div>
                )}
                <div className="product-image-container">
                    <Card.Img 
                        variant="top" 
                        src={anuncio.item_imagems && anuncio.item_imagems.length > 0 
                            ? getImageUrl(anuncio.item_imagems[0]) 
                            : '/images/no-image.jpg'} 
                        alt={anuncio.Titulo}
                        className="product-image"
                    />
                </div>
                <Card.Body className="d-flex flex-column">
                    <Card.Title className="product-title">{anuncio.Titulo}</Card.Title>
                    <div className="price-container mt-auto">
                        <span className="product-price">{parseFloat(anuncio.Preco).toFixed(2)}€</span>
                    </div>
                    <Card.Text className="product-description text-muted mb-3">
                        {anuncio.Descricao?.substring(0, 80)}...
                    </Card.Text>
                    <Button 
                        as={Link} 
                        to={`/anuncios/${anuncio.ID_Anuncio}`} 
                        variant="primary"
                        className="mt-auto"
                        style={{ backgroundColor: '#F97316', borderColor: '#F97316' }}
                    >
                        <i className="fas fa-shopping-cart me-2"></i>
                        Ver Detalhes
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    );

    return (
        <>
            <Header />
            
            {/* Banner Principal - Produtos em Destaque */}
            <section className="hero-section mb-5">
                {loading ? (
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '500px', backgroundColor: '#f0f0f0' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">A carregar...</span>
                        </div>
                    </div>
                ) : (
                    <Carousel>
                        {produtosDestaque.map((produto, index) => (
                            <Carousel.Item key={produto.ID_Anuncio || index}>
                                <div className="d-flex align-items-center" style={{ backgroundColor: '#f0f0f0', height: '500px' }}>
                                    <Container>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <div className="hero-content">
                                                    <h1 className="mb-3">PRODUTO EM DESTAQUE</h1>
                                                    <h2 className="mb-4">{produto.Titulo}</h2>
                                                    <p className="mb-4">{produto.Descricao?.substring(0, 120)}...</p>
                                                    <div className="price-container mb-4">
                                                        <span className="product-price" style={{ fontSize: '1.5rem' }}>{parseFloat(produto.Preco).toFixed(2)}€</span>
                                                    </div>
                                                    <Button 
                                                        variant="primary" 
                                                        size="lg"
                                                        as={Link}
                                                        to={`/anuncios/${produto.ID_Anuncio}`}
                                                        className="px-4 py-2"
                                                        style={{ backgroundColor: '#F97316', borderColor: '#F97316' }}
                                                    >
                                                        VER DETALHES <i className="fas fa-arrow-right ms-2"></i>
                                                    </Button>
                                                </div>
                                            </Col>
                                            <Col md={6} className="text-center">
                                                <img 
                                                    src={produto.item_imagems && produto.item_imagems.length > 0 
                                                        ? getImageUrl(produto.item_imagems[0]) 
                                                        : '/images/no-image.jpg'} 
                                                    alt={produto.Titulo} 
                                                    className="img-fluid"
                                                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                                                />
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )}
            </section>

            {/* Categorias */}
            <section className="categories-section py-5">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="section-title mb-0">Compre por Categoria</h2>
                        <Link to="/anuncios" className="btn btn-outline-primary">
                            Ver Todas <i className="fas fa-arrow-right ms-1"></i>
                        </Link>
                    </div>
                    <CategoryGrid />
                </Container>
            </section>

            {/* Produtos em Destaque */}
            <section className="featured-products py-5 bg-light">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="section-title mb-0">Produtos em Destaque</h2>
                        <Link to="/anuncios?tipo=1" className="btn btn-outline-primary">Ver Todos <i className="fas fa-arrow-right ms-1"></i></Link>
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">A carregar...</span>
                            </div>
                        </div>
                    ) : (
                        <Row>
                            {produtos.map((produto, index) => (
                                <React.Fragment key={produto.ID_Anuncio || `produto-${index}`}>
                                    {renderAnuncio(produto)}
                                </React.Fragment>
                            ))}
                        </Row>
                    )}
                </Container>
            </section>

            {/* Serviços em Destaque */}
            <section className="featured-services py-5">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="section-title mb-0">Serviços em Destaque</h2>
                        <Link to="/anuncios?tipo=2" className="btn btn-outline-primary">Ver Todos <i className="fas fa-arrow-right ms-1"></i></Link>
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">A carregar...</span>
                            </div>
                        </div>
                    ) : (
                        <Row>
                            {servicos.map((servico, index) => (
                                <React.Fragment key={servico.ID_Anuncio || `servico-${index}`}>
                                    {renderAnuncio(servico)}
                                </React.Fragment>
                            ))}
                        </Row>
                    )}
                </Container>
            </section>
            
      
        </>
    );
};

export default HomePage;
