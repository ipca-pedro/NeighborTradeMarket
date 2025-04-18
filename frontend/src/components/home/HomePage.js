import React, { useState, useEffect } from 'react';
import { getAnunciosDestaque, getAnunciosAleatorios } from '../../services/anuncioService';
import { Container, Row, Col, Card, Button, Form, Carousel, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import './HomePage.css';
import { anuncioService } from '../../services/api';

// Categorias estáticas correspondentes ao banco de dados
const staticCategories = [
    { ID_Categoria: 1, Descricao_Categoria: "Informática", icon: "fas fa-laptop", color: "#0d6efd" },
    { ID_Categoria: 2, Descricao_Categoria: "Móveis", icon: "fas fa-couch", color: "#0d6efd" },
    { ID_Categoria: 3, Descricao_Categoria: "Roupas", icon: "fas fa-tshirt", color: "#0d6efd" },
    { ID_Categoria: 4, Descricao_Categoria: "Livros", icon: "fas fa-book", color: "#0d6efd" },
    { ID_Categoria: 5, Descricao_Categoria: "Brinquedos", icon: "fas fa-gamepad", color: "#0d6efd" },
    { ID_Categoria: 6, Descricao_Categoria: "Ferramentas", icon: "fas fa-tools", color: "#0d6efd" },
    { ID_Categoria: 7, Descricao_Categoria: "Veículos", icon: "fas fa-car", color: "#0d6efd" },
    { ID_Categoria: 8, Descricao_Categoria: "Imóveis", icon: "fas fa-home", color: "#0d6efd" }
];

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
                    anuncioService.getAnunciosAleatorios(6, 1), // 6 Produtos
                    anuncioService.getAnunciosAleatorios(3, 2), // 3 Serviços 
                    anuncioService.getAnunciosAleatorios(3, 1)  // 3 Produtos para Destaque
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
        <Col key={anuncio.ID_Item} xs={12} md={4} lg={3} className="mb-4">
            <Card className="product-card h-100 shadow-sm">
                {anuncio.desconto && (
                    <div className="position-absolute top-0 end-0 bg-warning text-white p-2 m-2 rounded-circle">
                        <span className="fw-bold">{anuncio.desconto}%</span>
                    </div>
                )}
                <div className="product-image-container">
                    <Card.Img 
                        variant="top" 
                        src={anuncio.imagens?.[0]?.URL || '/images/no-image.jpg'} 
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
                        {anuncio.Descricao.substring(0, 80)}...
                    </Card.Text>
                    <Button 
                        as={Link} 
                        to={`/anuncios/${anuncio.ID_Item}`} 
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
                            <Carousel.Item key={produto.ID_Item || index}>
                                <div className="d-flex align-items-center" style={{ backgroundColor: '#f0f0f0', height: '500px' }}>
                                    <Container>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <div className="hero-content">
                                                    <h1 className="mb-3">PRODUTO EM DESTAQUE</h1>
                                                    <h2 className="mb-4">{produto.Titulo}</h2>
                                                    <p className="mb-4">{produto.Descricao.substring(0, 120)}...</p>
                                                    <div className="price-container mb-4">
                                                        <span className="product-price" style={{ fontSize: '1.5rem' }}>{parseFloat(produto.Preco).toFixed(2)}€</span>
                                                    </div>
                                                    <Button 
                                                        variant="primary" 
                                                        size="lg"
                                                        as={Link}
                                                        to={`/anuncios/${produto.ID_Item}`}
                                                        className="px-4 py-2"
                                                        style={{ backgroundColor: '#F97316', borderColor: '#F97316' }}
                                                    >
                                                        VER DETALHES <i className="fas fa-arrow-right ms-2"></i>
                                                    </Button>
                                                </div>
                                            </Col>
                                            <Col md={6} className="text-center">
                                                <img 
                                                    src={produto.imagens?.[0]?.URL || '/images/no-image.jpg'} 
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

            {/* Categorias Simplificadas - Estilo Clean */}
            <section className="categories-section py-5">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="section-title mb-0">Compre por Categoria</h2>
                        <Link to="/categorias" className="btn btn-outline-primary">
                            Ver Todas <i className="fas fa-arrow-right ms-1"></i>
                        </Link>
                    </div>
                    
                    <Row>
                        {staticCategories.map(category => (
                            <Col key={category.ID_Categoria} xs={6} md={3} className="mb-4">
                                <Link 
                                    to={`/anuncios?categoria=${category.ID_Categoria}`}
                                    className="text-decoration-none"
                                >
                                    <Card className="category-card h-100 text-center border-0 shadow-sm">
                                        <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                                            <div className="category-icon mb-3">
                                                <i className={`${category.icon} fa-3x`} style={{color: category.color}}></i>
                                            </div>
                                            <Card.Title className="category-name mb-0">
                                                {category.Descricao_Categoria}
                                            </Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Produtos em Destaque */}
            <section className="featured-products py-5 bg-light">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="section-title mb-0">Produtos em Destaque</h2>
                        <Link to="/anuncios" className="btn btn-outline-primary">Ver Todos <i className="fas fa-arrow-right ms-1"></i></Link>
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">A carregar...</span>
                            </div>
                        </div>
                    ) : (
                        <Row>
                            {produtos.map(produto => renderAnuncio(produto))}
                        </Row>
                    )}
                </Container>
            </section>

            {/* Serviços em Destaque */}
            <section className="featured-services py-5">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="section-title mb-0">Serviços em Destaque</h2>
                        <Link to="/anuncios?tipo=servico" className="btn btn-outline-primary">Ver Todos <i className="fas fa-arrow-right ms-1"></i></Link>
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">A carregar...</span>
                            </div>
                        </div>
                    ) : (
                        <Row>
                            {servicos.map(servico => renderAnuncio(servico))}
                        </Row>
                    )}
                </Container>
            </section>
            
      
        </>
    );
};

export default HomePage;
