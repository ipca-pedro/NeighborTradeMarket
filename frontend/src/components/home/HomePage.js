import React, { useState, useEffect } from 'react';
import { getAnunciosDestaque } from '../../services/anuncioService';
import { Container, Row, Col, Card, Button, Form, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import './HomePage.css';

const HomePage = () => {
    const [produtos, setProdutos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnuncios = async () => {
            try {
                setLoading(true);
                const anuncios = await getAnunciosDestaque();
                
                // Separar anúncios por tipo (1: Produto, 2: Serviço)
                const produtosArray = anuncios.filter(anuncio => anuncio.TipoItemID_TipoItem === 1)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 6);
                
                const servicosArray = anuncios.filter(anuncio => anuncio.TipoItemID_TipoItem === 2)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3);

                setProdutos(produtosArray);
                setServicos(servicosArray);
            } catch (error) {
                console.error('Erro ao procurar anúncios:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnuncios();
    }, []);

    const featuredCategories = [
        { id: 1, name: 'Computador & Portátil', icon: 'fas fa-laptop' },
        { id: 2, name: 'Acessórios de Computador', icon: 'fas fa-keyboard' },
        { id: 3, name: 'Smartphone', icon: 'fas fa-mobile-alt' },
        { id: 4, name: 'Auscultadores', icon: 'fas fa-headphones' },
        { id: 5, name: 'Acessórios Móveis', icon: 'fas fa-tablet-alt' },
        { id: 6, name: 'Consola de Jogos', icon: 'fas fa-gamepad' },
        { id: 7, name: 'Câmara & Foto', icon: 'fas fa-camera' },
        { id: 8, name: 'TV & Eletrodomésticos', icon: 'fas fa-tv' }
    ];

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

            {/* Banner Principal */}
            <section className="hero-section mb-5">
                <Carousel>
                    <Carousel.Item>
                        <div className="d-flex align-items-center" style={{ backgroundColor: '#f0f0f0', height: '500px' }}>
                            <Container>
                                <Row className="align-items-center">
                                    <Col md={6}>
                                        <div className="hero-content">
                                            <h1 className="mb-3">PROMOÇÕES DE VERÃO</h1>
                                            <h2 className="mb-4">Google Pixel 6 Pro</h2>
                                            <p className="mb-4">Aproveite 20% de desconto em todos os telemóveis Google Pixel da nova geração.</p>
                                            <Button 
                                                variant="primary" 
                                                size="lg"
                                                as={Link}
                                                to="/anuncios/categoria/3"
                                                className="px-4 py-2"
                                                style={{ backgroundColor: '#F97316', borderColor: '#F97316' }}
                                            >
                                                COMPRAR AGORA <i className="fas fa-arrow-right ms-2"></i>
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <img 
                                            src="/images/pixel-phone.png" 
                                            alt="Google Pixel Phone" 
                                            className="img-fluid"
                                        />
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </Carousel.Item>
                </Carousel>
            </section>

            {/* Categorias */}
            <section className="categories-section py-5">
                <Container>
                    <h2 className="section-title mb-4">Compre por Categoria</h2>
                    <Row>
                        {featuredCategories.map(category => (
                            <Col key={category.id} xs={6} md={3} lg={3} className="mb-4">
                                <Link to={`/anuncios/categoria/${category.id}`} className="category-item d-flex flex-column align-items-center text-center p-3 border rounded shadow-sm text-decoration-none">
                                    <div className="category-icon mb-3">
                                        <i className={`${category.icon} fa-3x text-primary`}></i>
                                    </div>
                                    <span className="category-name">{category.name}</span>
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

            
            <Footer />
        </>
    );
};

export default HomePage;
